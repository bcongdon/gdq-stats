import React from 'react'
import Stat from './Stat'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import Col from 'react-bootstrap/lib/Col'
import Row from 'react-bootstrap/lib/Row'
import Grid from 'react-bootstrap/lib/Grid'
import { gameEndTime } from '../utils'

class GamesTable extends React.PureComponent {
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

  toRow (game, key) {
    const { name, runners, moment, duration } = game
    const status = gameEndTime(game).isBefore() ? '✓' : ''
    return (
      <Row className='game-list-row' key={key}>
        <Col sm={4} xs={5}>{name}</Col>
        <Col sm={3} xsHidden>{runners}</Col>
        <Col sm={3} xs={4}>{moment.format('MMM D, h:mm a')} {status}</Col>
        <Col sm={2} xs={3}>{duration}</Col>
      </Row>
    )
  }

  getRows () {
    return this.props.schedule.map((game, idx) => {
      return this.toRow(game, idx)
    })
  }

  getGamesCompleted () {
    return this.props.schedule.filter((g) => gameEndTime(g).isBefore()).length
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
