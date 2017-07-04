import React from 'react'
import { gameFromTime } from '../utils'
import { PropTypes } from 'prop-types'
import moment from 'moment'

export default class GamesTooltip extends React.PureComponent {
  static propTypes = {
    payload: PropTypes.array,
    label: PropTypes.number,
    active: PropTypes.bool,
    schedule: PropTypes.array,
    format: PropTypes.func,
    secondaryFormat: PropTypes.func
  }

  static defaultProps = {
    format: (x) => x,
    secondaryFormat: (x) => x
  }

  render () {
    const { payload, label, active, schedule } = this.props

    if (!active || !payload || !schedule.length) {
      return null
    }
    const payloadObj = payload[0].payload
    const payloadProps = payload[0]
    const dataKey = payloadProps.dataKey
    const value = this.props.format(payloadObj[dataKey])

    let secondaryPayloadProps, secondaryValue
    if (payload.length > 1) {
      const secondaryPayloadObj = payload[1].payload
      secondaryPayloadProps = payload[1]
      const secondaryDataKey = secondaryPayloadProps.dataKey
      secondaryValue = this.props.secondaryFormat(secondaryPayloadObj[secondaryDataKey])
    }

    const secondaryField = payload.length > 1 ? (<div className='tool-secondary'>{secondaryPayloadProps.name}: {secondaryValue}</div>) : null

    const game = gameFromTime(schedule, moment.unix(label))

    return (
      <div className='gdq-tooltip'>
        <div className='tool-game'>{game.name}</div>
        <div className='tool-primary'>{payloadProps.name}: {value}</div>
        {secondaryField}
        <div className='tool-date'>{moment.unix(label).format('ddd, MMM Do YYYY, h:mm a')}</div>
      </div>
    )
  }
}
