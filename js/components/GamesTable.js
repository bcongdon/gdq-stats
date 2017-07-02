import React from 'react'
import Stat from './Stat'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import Col from 'react-bootstrap/lib/Col'
import Row from 'react-bootstrap/lib/Row'
import Grid from 'react-bootstrap/lib/Grid'

class GamesTable extends React.Component {
  static propTypes = {
    schedule: PropTypes.array.isRequired
  }

  getHeader () {
    return (
      <Row className='games-list-head'>
        <Col sm={4} xs={5}>Title</Col>
        <Col sm={3} xsHidden>Runner</Col>
        <Col sm={3} xs={4}>Starting Time</Col>
        <Col sm={2} xs={3}>Duration</Col>
      </Row>
    )
  }

  endTime (startTime, duration) {
    const split = duration.split(':')
    const hours = split[0]
    const minutes = split[1]
    const seconds = split[2]
    return startTime.clone().add({hours, minutes, seconds})
  }

  toRow (title, runner, startTime, duration, key) {
    const status = this.endTime(startTime, duration).isBefore() ? '✓' : ''
    return (
      <Row className='game-list-row' key={key}>
        <Col sm={4} xs={5}>{title}</Col>
        <Col sm={3} xsHidden>{runner}</Col>
        <Col sm={3} xs={4}>{startTime.format('MMM D, h:mm a')} {status}</Col>
        <Col sm={2} xs={3}>{duration}</Col>
      </Row>
    )
  }

  getRows () {
    return this.props.schedule.map((game, idx) => {
      return this.toRow(game.name, game.runners, game.moment, game.duration, idx)
    })
  }

  getGamesCompleted () {
    return this.props.schedule.filter((g) => this.endTime(g.moment, g.duration).isBefore()).length
  }

  render () {
    return (
      <div className='section'>
        <h2>Games</h2>
        <div className='table-content'>
          <div id='game-list'>
            <Grid id='gamesTable'>
              {this.getHeader()}
              <div className='games-list-body'>
                {this.getRows()}
              </div>
            </Grid>
          </div>
        </div>
        <div className='current_stats container' style={{padding: 5}}>
          <Stat title='Games Completed' emoji='🎮' value={this.getGamesCompleted()} />
        </div>
      </div>
    )
  }
}

function mapPropsToState (state) {
  return {
    schedule: state.gdq.schedule
  }
}

export default connect(mapPropsToState)(GamesTable)
