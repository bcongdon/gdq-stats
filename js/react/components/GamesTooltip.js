import React from 'react'
import { gameFromTime } from '../utils'
import { PropTypes } from 'prop-types'
import moment from 'moment'

export default class GamesTooltip extends React.Component {
  static propTypes = {
    payload: PropTypes.array,
    label: PropTypes.string,
    active: PropTypes.bool,
    schedule: PropTypes.array,
    format: PropTypes.func
  }

  static defaultProps = {
    format: (x) => x
  }

  render () {
    const { payload, label, active, schedule } = this.props

    if (!active || !payload) {
      return null
    }

    const payloadObj = payload[0].payload
    const payloadProps = payload[0]
    const dataKey = payloadProps.dataKey
    const value = this.props.format(payloadObj[dataKey])

    const game = gameFromTime(schedule, label)

    return (
      <div className='gdq-tooltip'>
        <div className='tool-game'>{game.name}</div>
        <div className='tool-date'>{moment(label).format('ddd, MMM Do YYYY, h:mm a')}</div>
        <div className='tool-primary'>{payloadProps.name}: {value}</div>
        <div className='tool-footer'>Baz</div>
      </div>
    )
  }
}
