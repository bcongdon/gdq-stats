import React from 'react'
import Stat from './Stat'
import { PropTypes } from 'prop-types'
import { connect } from 'react-redux'
import Grid from 'react-bootstrap/lib/Grid'
import Col from 'react-bootstrap/lib/Col'

const STATS = [
  {
    title: 'Viewers',
    emoji: '📺',
    key: 'viewers'
  },
  {
    title: 'Donations',
    emoji: '💸',
    key: 'donations'
  },
  {
    title: 'Number of Donations',
    emoji: '🙌',
    key: 'donors'
  },
  {
    title: 'Twitch Chats',
    emoji: '💬',
    key: 'chats'
  },
  {
    title: 'Twitch Emotes',
    emoji: <img src='img/kappa.png' width='22' alt='kappa' />,
    key: 'emotes'
  },
  {
    title: 'Tweets Tweeted',
    emoji: '🐦',
    key: 'tweets'
  }
]

class StatsContainer extends React.Component {
  static propTypes = {
    timeseries: PropTypes.array.isRequired
  }

  accumulateStats () {
    return this.props.timeseries.reduce((prev, curr) => {
      return {
        c: prev.c + curr.c,
        e: prev.e + curr.e,
        t: prev.t + curr.t
      }
    }, { c: 0, e: 0, t: 0 })
  }

  render () {
    const accumulated = this.accumulateStats()
    const latest = this.props.timeseries[this.props.timeseries.length - 1] || {v: 0, m: 0, d: 0}
    const values = {
      viewers: latest.v,
      donations: latest.m,
      donors: latest.d,
      chats: accumulated.c,
      emotes: accumulated.e,
      tweets: accumulated.t
    }

    const stats = STATS.map((s, idx) =>
      <Stat title={s.title} emoji={s.emoji} value={values[s.key] || 0} key={idx} />
    )
    return (
      <div className='section'>
        <h2>Event Stats</h2>
        <Grid className='current_stats content'>{stats}</Grid>
        <Grid className='gdq-links'>
          <Col xs={12} sm={4}><a href='https://www.twitch.tv/gamesdonequick'>Livestream</a></Col>
          <Col xs={12} sm={4}><a href='https://gamesdonequick.com/tracker/index/agdq2017'>Donation Tracker</a></Col>
          <Col xs={12} sm={4}><a href='https://gamesdonequick.com/schedule'>Schedule</a></Col>
        </Grid>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    timeseries: state.gdq.timeseries
  }
}

export default connect(mapStateToProps)(StatsContainer)
