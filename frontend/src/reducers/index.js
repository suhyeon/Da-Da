import { combineReducers } from 'redux'
import {
  weightListReducer,
  weightAllReducer,
} from './weightReducer/weight'
import authReducer from './authReducer/auth'
import navActiveItemReducer from './appReducer/navActiveItem'
import {
  shortLogReducer,
  longLogReducer,
} from './diaryReducer/diaryReview'
import {
  todayDateReducer,
  beforeDateReducer,
} from './appReducer/date'
import { diaryFoodReducer } from './diaryReducer/diaryFood'
import { calorieGoalReducer } from './diaryReducer/diaryKcalGoal'
import { diarySummaryReducer } from './diaryReducer/diarySummary'
import { diaryKcalReducer } from './diaryReducer/diaryKcal'

import {
  calorieChartReducer,
  nutritionChartReducer,
} from './reportReducer/chartData'
import {
  calorySummaryReducer,
  nutritionSummaryReducer,
} from './reportReducer/summaryData'

const reducers = combineReducers({
  navActiveItem: navActiveItemReducer,
  today: todayDateReducer,
  beforeDay: beforeDateReducer,
  auth: authReducer,
  weightList: weightListReducer,
  weightAll: weightAllReducer,
  shortLog: shortLogReducer,
  longLog: longLogReducer,
  foodLogs: diaryFoodReducer,
  caloriesChart: calorieChartReducer,
  goalKcal: diaryKcalReducer,
  nutritionChart: nutritionChartReducer,
  calorieGoalAboutADay: calorieGoalReducer,
  diarySummary: diarySummaryReducer,
  calorySummary: calorySummaryReducer,
  nutritionSummary: nutritionSummaryReducer,
})

export default reducers