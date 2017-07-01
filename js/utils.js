import moment from 'moment'
import { bisector } from 'd3-array'

export const gameFromTime = (schedule, time) => {
  const result = bisector((a, b) => a.moment.diff(b)).left(schedule, moment(time), 1)
  return schedule[result - 1]
}
