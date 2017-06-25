import React from 'react'
import { PropTypes } from 'prop-types'
import Odometer from 'react-odometerjs'

export default class Stat extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    emoji: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
  }

  render () {
    return (
      <div className='stat'>
        <span className='current_header'>{this.props.title}:</span>
        <div className='odometer-group'>
          {this.props.value === 0 ? "0" : <Odometer value={this.props.value} />}
          <div className='emoji'>{this.props.emoji}</div>
        </div>
      </div>
    )
  }
}
