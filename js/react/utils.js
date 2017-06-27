import moment from 'moment'
import { bisector } from 'd3'

export const gameFromTime = (schedule, time) => {
  const result = bisector((a, b) => a.start_time.isAfter(b)).right(schedule, moment(time))
  return schedule[result]
}
