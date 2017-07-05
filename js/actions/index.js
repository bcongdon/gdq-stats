import axios from 'axios'
import moment from 'moment'
import Notify from 'notifyjs'
import { INITIAL_TIMESERIES,
  UPDATE_TIMESERIES,
  UPDATE_SCHEDULE,
  SET_CURRENT_SERIES,
  SET_BUTTON_ZOOM,
  SET_GAME_ZOOM,
  SET_CURRENT_SECONDARY_SERIES,
  TOGGLE_NOTIFICATION_GAME,
  NOTIFY_GAME } from '../actions/types'
import { gameForId } from '../utils'
import { GDQ_API_ENDPOINT, GDQ_STORAGE_ENDPOINT } from '../constants'


export const fetchInitialTimeseries = () => (dispatch) =>
  axios.get(GDQ_STORAGE_ENDPOINT + '/latest.json')
    .then(response => {
      dispatch({ type: INITIAL_TIMESERIES, payload: response.data })
      const maxTime = moment(response.data[response.data.length - 1].time).toDate()
      fetchRecentTimeseries(maxTime)(dispatch)
    })

export const fetchRecentTimeseries = (since) => (dispatch) =>
  axios.get(`${GDQ_API_ENDPOINT}/recentEvents?since=${moment.utc(since).format('YYYY-MM-DDTHH:mm[Z]')}`)
    .then(response => {
      dispatch({ type: UPDATE_TIMESERIES, payload: response.data })
    })

export const fetchSchedule = () => (dispatch) =>
  axios.get(GDQ_STORAGE_ENDPOINT + '/schedule.json')
    .then(response => {
      dispatch({ type: UPDATE_SCHEDULE, payload: response.data })
    })

export const setCurrentSeries = (series) => (dispatch) => dispatch({ type: SET_CURRENT_SERIES, payload: series })
export const setCurrentSecondarySeries = (series) => (dispatch) => dispatch({ type: SET_CURRENT_SECONDARY_SERIES, payload: series })

export const setButtonZoom = (idx) => (dispatch) => dispatch({ type: SET_BUTTON_ZOOM, payload: idx })
export const setGameZoom = (id) => (dispatch) => dispatch({ type: SET_GAME_ZOOM, payload: id })

export const toggleNotificationGame = (id) => (dispatch, getState) => {
  // If we're adding a new game and we need permission, ask for it
  if (!getState().gdq.notificationGames.includes(id) && Notify.needsPermission) {
    Notify.requestPermission()
  }

  dispatch({ type: TOGGLE_NOTIFICATION_GAME, payload: id })
}
export const notifyGame = (id) => (dispatch, getState) => {
  const schedule = getState().gdq.schedule
  const game = gameForId(id, schedule)
  if (!game) {
    return
  }
  var notification = new Notify('GDQStatus: ' + game.name, {
    body: game.name + ' is up next!',
    icon: 'img/favicon-196x196.png',
    notifyClick: () => {
      window.open('https://www.twitch.tv/gamesdonequick')
    }
  })
  notification.show()
  dispatch({type: NOTIFY_GAME, payload: id})
}
