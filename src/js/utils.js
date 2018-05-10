import dayjs from 'dayjs'
import { bisector } from 'd3-array'

export const gameEndTime = (game) => {
  const { moment, duration } = game
  const split = duration.split(':')
  const hours = split[0]
  const minutes = split[1]
  const seconds = split[2]
  return moment.clone().add(hours, 'hour').add(minutes, 'minute').add(seconds, 'second')
}

export const gameFromTime = (schedule, time) => {
  if (schedule[0].moment.isAfter(time)) {
    return { name: 'Pre-show', moment: dayjs(0) }
  } else if (gameEndTime(schedule[schedule.length - 1]).isBefore(time)) {
    return { name: 'Post-show', moment: gameEndTime(schedule[schedule.length - 1]) }
  }

  const result = bisector((a, b) => a.moment.diff(b)).left(schedule, dayjs(time), 1)
  return schedule[result - 1]
}

export const movingAverage = (arr, dataKey, windowSize) => {
  // Exponential moving average 
  // Adopted from: https://stackoverflow.com/a/40058688/2421634
  return arr.reduce((previous, current, idx) => {
    if (!idx) {
      return previous
    }
    const scaleFactor = (windowSize - 1) / (windowSize + 1)
    const newVal = 2 * current[dataKey] / (windowSize + 1) + previous[previous.length - 1][dataKey] * scaleFactor
    current[dataKey] = newVal
    return previous.concat(current)
  }, [arr[0]])
}

export const gameForId = (id, games) => {
  const game = games.filter((g) => g.id === id)[0]
  if (!game) {
    console.debug('No game with id ' + id)
    return null
  }
  return game
}
