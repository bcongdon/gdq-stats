import React from 'react'
import Stat from './Stat'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import Col from 'react-bootstrap/lib/Col'
import Row from 'react-bootstrap/lib/Row'
import Grid from 'react-bootstrap/lib/Grid'
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger'
import Tooltip from 'react-bootstrap/lib/Tooltip'
import { gameEndTime, gameForId } from '../utils'
import IconLink from './IconLink'
import { toggleNotificationGame, notifyGame } from '../actions'
import ReactDOM from 'react-dom'
import dayjs from 'dayjs'

class GamesTable extends React.Component {
  static propTypes = {
    schedule: PropTypes.array.isRequired,
    notificationGames: PropTypes.array,
    toggleNotificationGame: PropTypes.func,
    notifyGame: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.rows = []
    this.initialScroll = false
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
    const { id, name, runners, startTime, duration } = game
    const notificationActive = this.props.notificationGames.includes(id)
    const notificationIcon = (
      <IconLink
        icon='glyphicon glyphicon-bell'
        active={notificationActive}
        onClick={() => this.props.toggleNotificationGame(id)} />
    )

    const notificationTooltip = (
      <Tooltip
        id='notification-tooltip'
        style={{color: 'red'}}>
        Click to be notified right before<br />'<b>{game.name}</b>'<br /> starts!
      </Tooltip>
    )

    const tooltipAppliedNotification = notificationActive ? notificationIcon : (
      <OverlayTrigger placement='top' overlay={notificationTooltip}>
        {notificationIcon}
      </OverlayTrigger>
    )

    let status
    if (gameEndTime(game).isBefore(dayjs())) {
      status = '✓'
    } else if (game.startTime.isBefore(dayjs())) {
      status = '🎮'
    } else {
      status = tooltipAppliedNotification
    }

    const statusNode = <span className='hidden-xs game-table-status'>{status}</span>

    const row = (
      <Row className='game-list-row' key={key} ref={(e) => { this.rows[key] = e }}>
        <Col sm={4} xs={5}>{name}</Col>
        <Col sm={3} xsHidden>{runners}</Col>
        <Col sm={3} xs={4}>{startTime.format('MMM D, h:mma')} {statusNode}</Col>
        <Col sm={2} xs={3}>{duration}</Col>
      </Row>
    )

    return row
  }

  getRows () {
    return this.props.schedule.map((game, idx) => {
      return this.toRow(game, idx)
    })
  }

  getGamesCompleted () {
    return this.props.schedule.filter((g) => gameEndTime(g).isBefore(dayjs())).length
  }

  getActiveGame () {
    for (let i = 0; i < this.props.schedule.length; i++) {
      const game = this.props.schedule[i]
      if (game.startTime.isAfter(dayjs())) {
        return i - 1
      }
    }
    return 0
  }

  render () {
    const table = (
      <div className='section'>
        <h2>Games</h2>
        <div className='table-content'>
          <div id='game-list'>
            <Grid id='gamesTable'>
              {this.getHeader()}
              <div className='games-list-body' ref={(e) => { this.body = e }}>
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
    return table
  }

  componentDidUpdate () {
    const activeRow = ReactDOM.findDOMNode(this.rows[this.getActiveGame()])
    if (activeRow && !this.initialScroll) {
      this.initialScroll = true
      this.body.scrollTop = activeRow.offsetTop - this.body.offsetTop
    }
  }

  componentWillMount () {
    const checkNotifications = () => {
      this.props.notificationGames.map((id) => {
        const game = gameForId(id, this.props.schedule)
        if (!game) {
          return
        }
        // Notify if game starts within 5 minutes
        if (game.startTime.clone().subtract(5, 'minutes').isBefore(dayjs())) {
          this.props.notifyGame(id)
        }
      })
      // Force update to catch when a game change occurs
      this.forceUpdate()
    }
    checkNotifications()
    setInterval(checkNotifications, 5 * 1000)
  }
}

function mapPropsToState (state) {
  return {
    schedule: state.gdq.schedule,
    notificationGames: state.gdq.notificationGames
  }
}

export default connect(mapPropsToState, { toggleNotificationGame, notifyGame })(GamesTable)
