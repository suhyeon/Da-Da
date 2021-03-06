import React, { Component } from 'react'
import {
  BrowserRouter,
  Route,
  Switch,
} from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store'
import 'typeface-spoqa-han-sans2/spoqa-han-sans.css'
import 'wfk-montserrat/montserrat.css'
import './Root.css'
import 'semantic-ui-css/semantic.min.css'
import App from './App'
import Helmet from 'react-helmet'
import LoginPage from './pages/LoginPage'

class Root extends Component {
  render() {
    return (
      <BrowserRouter>
        <Provider store={store}>
          <div>
            <Helmet>
              <title itemProp="name">
                DA, DA
              </title>
            </Helmet>
            <Switch>
              {/* intro페이지 & 네비게이션 없는 페이지 */}
              <Route
                path="/login"
                component={LoginPage}
              />
              {/* 서비스 페이지 (로그인 이후 접근 가능) & 네비게이션 있는 페이지*/}
              <Route path="/" component={App} />
            </Switch>
          </div>
        </Provider>
      </BrowserRouter>
    )
  }
}

export default Root
