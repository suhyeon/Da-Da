import { combineReducers } from 'redux'
import { diaryFoodReducer } from './diaryFood'
import { weigthListReducer } from './weight'
import authReducer from './auth'
import navActiveItemReducer from './navActiveItem'
import readingRegretReducer from './readRegret'
import readingCommentReducer from './readComment'

const reducers = combineReducers({
  weightList: weigthListReducer,
  navActiveItem: navActiveItemReducer,
  auth: authReducer,
  // diaryFood: diaryFoodReducer,
  readRegret: readingRegretReducer,
  readComment: readingCommentReducer,
})

export default reducers