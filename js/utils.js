import moment from 'moment'
import { bisector } from 'd3-array'

export const gameEndTime = (game) => {
  const { moment, duration } = game
  const split = duration.split(':')
  const hours = split[0]
  const minutes = split[1]
  const seconds = split[2]
  return moment.clone().add({hours, minutes, seconds})
}

export const gameFromTime = (schedule, time) => {
  if (schedule[0].moment.isAfter(time)) {
    return { name: 'Pre-show', moment: moment.unix(0) }
  } else if (gameEndTime(schedule[schedule.length - 1]).isBefore(time)) {
    return { name: 'Post-show', moment: gameEndTime(schedule[schedule.length - 1]) }
  }

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

export const gameForId = (id, games) => {
  const game = games.filter((g) => g.id === id)[0]
  if(!game) {
    console.debug("No game with id " + id)
    return null
  }
  return game
}
