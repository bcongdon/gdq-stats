import moment from 'moment'
import { bisector } from 'd3-array'

export const gameFromTime = (schedule, time) => {
  const result = bisector((a, b) => a.moment.diff(b)).left(schedule, moment(time), 1)
  return schedule[result - 1]
}

export const movingAverage = (arr, dataKey, windowSize) => {
  let result = []
  arr.slice(windowSize).map((obj, idx) => {
    const windowSum = arr.slice(idx, idx + windowSize).reduce((acc, currObj) => {
      return acc + currObj[dataKey]
    }, 0)
    const copy = Object.assign({}, obj)
    copy[dataKey] = windowSum / windowSize
    result.push(copy)
  })
  return result
}
