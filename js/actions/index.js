import axios from 'axios'
import moment from 'moment'
import { INITIAL_TIMESERIES,
  UPDATE_TIMESERIES,
  UPDATE_SCHEDULE,
  SET_CURRENT_SERIES,
  SET_BUTTON_ZOOM,
  SET_GAME_ZOOM } from '../actions/types'

const GDQ_API_ENDPOINT = 'https://api.gdqstat.us'
const GDQ_STORAGE_ENDPOINT = 'http://storage.api.gdqstat.us'

export const fetchInitialTimeseries = () => (dispatch) =>
  axios.get(GDQ_STORAGE_ENDPOINT + '/latest.json')
    .then(response => {
      dispatch({ type: INITIAL_TIMESERIES, payload: response.data })
      const maxTime = moment(response.data[response.data.length - 1].time).toDate()
      fetchRecentTimeseries(maxTime)(dispatch)
    })

export const fetchRecentTimeseries = (since) => (dispatch) =>
  axios.get(`${GDQ_API_ENDPOINT}/recentEvents?since=${moment.utc(since).format("YYYY-MM-DDTHH:mm[Z]")}`)
    .then(response => {
      dispatch({ type: UPDATE_TIMESERIES, payload: response.data })
    })

export const fetchSchedule = () => (dispatch) =>
  axios.get(GDQ_STORAGE_ENDPOINT + '/schedule.json')
    .then(response => {
      dispatch({ type: UPDATE_SCHEDULE, payload: response.data })
    })

export const setCurrentSeries = (series) => (dispatch) => dispatch({ type: SET_CURRENT_SERIES, payload: series })

export const setButtonZoom = (idx) => (dispatch) => dispatch({ type: SET_BUTTON_ZOOM, payload: idx })
export const setGameZoom = (idx) => (dispatch) => dispatch({ type: SET_GAME_ZOOM, payload: idx })
