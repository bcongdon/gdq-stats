import React from 'react'
import { PropTypes } from 'prop-types'
import Odometer from 'react-odometerjs'
import Col from 'react-bootstrap/lib/Col'

export default class Stat extends React.PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.any.isRequired,
    emoji: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    prefix: PropTypes.string,
    format: PropTypes.string
  }

  static defaultProps = {
    prefix: ''
  }

  render () {
    return (
      <Col lg={4} md={6} xs={12} className='stat'>
        <span className='current_header'>{this.props.title}:</span>
        <div className='odometer-group'>
          <div style={{minWidth: 60, textAlign: 'right'}}>
            {this.props.prefix}
            {this.props.value === 0
              ? <span style={{paddingRight: 5}}>0</span>
              : (<Odometer value={this.props.value} options={{format: this.props.format}} />)}
          </div>
          <div className='emoji'>{this.props.emoji}</div>
        </div>
      </Col>
    )
  }
}
