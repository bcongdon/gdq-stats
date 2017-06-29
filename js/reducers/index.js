import { combineReducers } from 'redux'
import gdqReducer from './gdqReducers'

const rootReducer = combineReducers({
  gdq: gdqReducer
})

export default rootReducer
