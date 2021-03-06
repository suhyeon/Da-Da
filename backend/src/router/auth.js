const express = require('express')
const cookieSession = require('cookie-session')
const csurf = require('csurf')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const KakaoStrategy = require('passport-kakao').Strategy
const NaverStrategy = require('passport-naver').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const InstagramStrategy = require('passport-instagram').Strategy


const query = require('../query')
const mw = require('../middleware')

const router = express.Router()

router.use(mw.urlencodedMiddleware)

router.use(cookieSession({
  'name': 'oasess',
  'keys': [
    process.env.SESSION_SECRET
  ]
}))

router.use(csurf())
router.use(mw.insertReq)
router.use(mw.insertToken)
router.use(passport.initialize())
router.use(passport.session())

passport.serializeUser((user, done) => {
  done(null, `${user.member_provider}:${user.member_provider_number}`)
})

passport.deserializeUser((str, done) => {
  const [member_provider, member_provider_number] = str.split(':')
  query.firstOrCreateUserByProvider({ member_provider, member_provider_number })
    .then(user => {
      if (user) {
        done(null, user)
      } else {
        done(new Error('해당 정보와 일치하는 사용자가 없습니다.'))
      }
    })
})


passport.use(new KakaoStrategy({
  'clientID': process.env.KAKAO_CLIENT_ID,
  'clientSecret': process.env.KAKAO_CLIENT_SECRET,
  'callbackURL': process.env.KAKAO_CALLBACK_URL
}, (accessToken, refreshToken, profile, done) => {
  const avatar_url = profile._json.properties.profile_image ? profile._json.properties.profile_image : null
  const user_name = profile.displayName ? profile.displayName : null
  const member_data = {
    'member_provider': 'kakao',
    'member_provider_number': profile.id,
    'member_provider_name': user_name,
    'member_avatar_url': avatar_url,
    'token': accessToken
  }

  query.firstOrCreateUserByProvider(member_data)
    .then(user => {
      if (member_data.member_provider_name !== null && (user.member_provider_name !== member_data.member_provider_name || user.member_avatar_url !== member_data.member_avatar_url)) {
        query.updateUserInfo(member_data).then()
      }
      return user ? done(null, user) : done(new Error('해당 정보와 일치하는 사용자가 없습니다.'))
    }).catch(err => {
      done(err)
    })
}))

passport.use(new NaverStrategy({
  'clientID': process.env.NAVER_CLIENT_ID,
  'clientSecret': process.env.NAVER_CLIENT_SECRET,
  'callbackURL': process.env.NAVER_CALLBACK_URL
}, (accessToken, refreshToken, profile, done) => {
  const avatar_url = profile._json.profile_image ? profile._json.profile_image : null
  const user_name = profile._json.nickname ? profile._json.nickname : null
  const member_data = {
    'member_provider': 'naver',
    'member_provider_number': profile._json.id,
    'member_provider_name': user_name,
    'member_avatar_url': avatar_url,
    'token': accessToken
  }

  query.firstOrCreateUserByProvider(member_data)
    .then(user => {
      if (member_data.member_provider_name !== null && (user.member_provider_name !== member_data.member_provider_name || user.member_avatar_url !== member_data.member_avatar_url)) {
        query.updateUserInfo(member_data).then()
      }
      return user ? done(null, user) : done(new Error('해당 정보와 일치하는 사용자가 없습니다.'))
    }).catch(err => {
      done(err)
    })
}))

passport.use(new FacebookStrategy({
  'clientID': process.env.FACEBOOK_CLIENT_ID,
  'clientSecret': process.env.FACEBOOK_CLIENT_SECRET,
  'callbackURL': process.env.FACEBOOK_CALLBACK_URL,
  'profileFields': ['id', 'displayName', 'photos', 'email']
}, (accessToken, refreshToken, profile, done) => {
  const avatar_url = profile.photos[0] ? profile.photos[0].value : null
  const user_name = profile.displayName ? profile.displayName : null
  const member_data = {
    'member_provider': 'facebook',
    'member_provider_number': profile.id,
    'member_provider_name': user_name,
    'member_avatar_url': avatar_url,
    'token': accessToken
  }

  query.firstOrCreateUserByProvider(member_data)
    .then(user => {
      if (member_data.member_provider_name !== null && (user.member_provider_name !== member_data.member_provider_name || user.member_avatar_url !== member_data.member_avatar_url)) {
        query.updateUserInfo(member_data).then()
      }
      return user ? done(null, user) : done(new Error('해당 정보와 일치하는 사용자가 없습니다.'))
    }).catch(err => {
      done(err)
    })
}))

passport.use(new InstagramStrategy({
  'clientID': process.env.INSTAGRAM_CLIENT_ID,
  'clientSecret': process.env.INSTAGRAM_CLIENT_SECRET,
  'callbackURL': process.env.INSTAGRAM_CALLBACK_URL
}, (accessToken, refreshToken, profile, done) => {
  const avatar_url = profile._json.data.profile_picture ? profile._json.data.profile_picture : null
  const user_name = profile.displayName ? profile.displayName : null
  const member_data = {
    'member_provider': 'instagram',
    'member_provider_number': profile.id,
    'member_provider_name': user_name,
    'member_avatar_url': avatar_url,
    'token': accessToken
  }

  query.firstOrCreateUserByProvider(member_data)
    .then(user => {
      if (member_data.member_provider_name !== null && (user.member_provider_name !== member_data.member_provider_name || user.member_avatar_url !== member_data.member_avatar_url)) {
        query.updateUserInfo(member_data).then()
      }
      return user ? done(null, user) : done(new Error('해당 정보와 일치하는 사용자가 없습니다.'))
    }).catch(err => {
      done(err)
    })
}))

router.get('/', (req, res) => {
  res.render('auth.pug')
})

// 로그인 성공
router.get('/success', mw.loginRequired, (req, res) => {
  const token = jwt.sign({ 'id': req.user.member_id }, process.env.JWT_SECRET)

  res.render('success.pug', {
    token,
    'origin': process.env.TARGET_ORIGIN
  })
})

router.get('/kakao', passport.authenticate('kakao'))

router.get('/kakao/callback', (req, res, next) => {
  passport.authenticate('kakao', (err, user) => {
    if (err) {
      // 예상치 못한 예외 발생 시
      return next(err)
    }
    if (!user) {
      // 로그인 실패 시
      return res.redirect(req.baseUrl)
    }
    req.logIn(user, err => {
      // 예상치 못한 예외 발생 시
      if (err) {
        return next(err)
      }
      // 로그인 성공
      res.redirect(`${req.baseUrl}/success`)
    })
  })(req, res, next)
})

router.get('/naver', passport.authenticate('naver'))

router.get('/naver/callback', (req, res, next) => {
  passport.authenticate('naver', (err, user) => {
    if (err) {
      return next(err)
    }
    if (!user) {
      return res.redirect(req.baseUrl)
    }
    req.logIn(user, err => {
      if (err) {
        return next(err)
      }
      // 로그인 성공
      res.redirect(`${req.baseUrl}/success`)
    })
  })(req, res, next)
})

router.get('/facebook', passport.authenticate('facebook'))

router.get('/facebook/callback', (req, res, next) => {
  passport.authenticate('facebook', (err, user) => {
    if (err) {
      // 예상치 못한 예외 발생 시
      return next(err)
    }
    if (!user) {
      // 로그인 실패 시
      return res.redirect(req.baseUrl)
    }
    req.logIn(user, err => {
      // 예상치 못한 예외 발생 시
      if (err) {
        return next(err)
      }
      // 로그인 성공
      res.redirect(`${req.baseUrl}/success`)
    })
  })(req, res, next)
})

router.get('/instagram', passport.authenticate('instagram'))

router.get('/instagram/callback', (req, res, next) => {
  passport.authenticate('instagram', (err, user) => {
    if (err) {
      // 예상치 못한 예외 발생 시
      return next(err)
    }
    if (!user) {
      // 로그인 실패 시
      return res.redirect(req.baseUrl)
    }
    req.logIn(user, err => {
      // 예상치 못한 예외 발생 시
      if (err) {
        return next(err)
      }
      // 로그인 성공
      res.redirect(`${req.baseUrl}/success`)
    })
  })(req, res, next)
})

router.use((err, req, res, next) => {
  console.log(err, err.message, '<< [ err, err.message ]')
  res.redirect(req.baseUrl)
})

module.exports = router
