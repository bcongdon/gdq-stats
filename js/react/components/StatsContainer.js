import React from 'react'
import Stat from './Stat'
import { PropTypes } from 'prop-types'
import { connect } from 'react-redux'

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
    var c_acc = 0,
        e_acc = 0,
        t_acc = 0;
    for (var i = 0; i < this.props.timeseries.length; i++) {
        c_acc += this.props.timeseries[i].c;
        e_acc += this.props.timeseries[i].e;
        t_acc += this.props.timeseries[i].t;
    }
    return {
        c: c_acc,
        e: e_acc,
        t: t_acc
    }
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
        <div className='current_stats'>{stats}</div>
        <div className='gdq-links'>
          <div><a href='https://www.twitch.tv/gamesdonequick'>Livestream</a></div>
          <div><a href='https://gamesdonequick.com/tracker/index/agdq2017'>Donation Tracker</a></div>
          <div><a href='https://gamesdonequick.com/schedule'>Schedule</a></div>
        </div>
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
