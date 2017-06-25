import axios from 'axios'
import { INITIAL_TIMESERIES,
         UPDATE_TIMESERIES,
         UPDATE_SCHEDULE } from '../actions/types'

const GDQ_API_ENDPOINT = 'https://api.gdqstat.us'
// const GDQ_STORAGE_ENDPOINT = 'http://storage.api.gdqstat.us'
const GDQ_STORAGE_ENDPOINT = 'data/2017/agdq_final'

export const fetchInitialTimeseries = () => (dispatch) => 
  axios.get(GDQ_STORAGE_ENDPOINT + '/latest.json')
  .then(response => {
    dispatch({ type: INITIAL_TIMESERIES, payload: response.data })
    fetchRecentTimeseries()
  })

export const fetchRecentTimeseries = (since) => (dispatch) => 
  axios.get(`${GDQ_API_ENDPOINT}/recentEvents?since=${since.toISOString()}`)
  .then(response => {
    dispatch({ type: UPDATE_TIMESERIES, payload: response.data })
  })

export const fetchSchedule = () => (dispatch) => 
  axios.get(GDQ_STORAGE_ENDPOINT + '/schedule.json')
  .then(response => {
    dispatch({ type: UPDATE_SCHEDULE, payload: response.data })
  })
