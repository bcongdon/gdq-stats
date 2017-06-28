import { INITIAL_TIMESERIES,
  UPDATE_TIMESERIES,
  UPDATE_SCHEDULE,
  SET_CURRENT_SERIES,
  SET_BUTTON_ZOOM,
  SET_GAME_ZOOM } from '../actions/types'
import moment from 'moment'

const INITIAL_STATE = {
  schedule: [],
  timeseries: [],
  timeseriesLoaded: false,
  scheduleLoaded: false,
  series: 0,
  activeButtonZoomIndex: -1,
  activeGameZoomIndex: -1
}

const mostRecentTime = (data) => {
  return !data ? 0 : data[data.length - 1].time
}

const updateTimeseries = (newData, current) => {
  // Do some minor manipulations of data to keep assumptions about data correct
  for (var i = 0; i < newData.length; i++) {
    newData[i].time = new Date(newData[i].time)
    for (var k in newData[i]) {
      if (newData[i][k] == null) {
        newData[i][k] = -1
      }
    }
  }
  newData.sort(function (a, b) { return a.time - b.time })
  var mostRecent = mostRecentTime(current)
  newData = newData.filter((d) => d.time > mostRecent)
  return current.concat(newData)
}

const normalizeSchedule = (schedule) => {
  for (var i = 0; i < schedule.length; i++) {
    schedule[i].start_time = moment.utc(schedule[i].start_time)
  }
  schedule.sort((a, b) => a.start_time - b.start_time)
  return schedule
}

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case INITIAL_TIMESERIES:
      return { ...state, timeseries: action.payload }
    case UPDATE_TIMESERIES:
      return { ...state, timeseries: updateTimeseries(action.payload, state.timeseries), timeseriesLoaded: true }
    case UPDATE_SCHEDULE:
      return { ...state, schedule: normalizeSchedule(action.payload), scheduleLoaded: true }
    case SET_CURRENT_SERIES:
      return { ...state, series: action.payload }
    case SET_BUTTON_ZOOM:
      return { ...state, activeButtonZoomIndex: action.payload, activeGameZoomIndex: -1 }
    case SET_GAME_ZOOM:
      return { ...state, activeButtonZoomIndex: -1, activeGameZoomIndex: action.payload }
  }
  return state
}
