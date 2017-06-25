import React from 'react'
import Stat from './Stat'
import { connect } from 'react-redux'

class GamesTable extends React.Component {
  getHeader() {
    return (
      <thead>
        <tr>
          <th style={{width: 5}}></th>
          <th style={{width: 340}}>Title</th>
          <th style={{width: 340}}>Runner</th>
          <th style={{width: 140}}>Starting Time</th>
          <th>Duration</th>
        </tr>
      </thead>
    )
  }

  endTime (start_time, duration) {
    const split = duration.split(':')
    const hours = split[0]
    const minutes = split[1]
    const seconds = split[2]
    return start_time.add({hours, minutes, seconds})
  }

  toRow (title, runner, start_time, duration, key) {
    const status = this.endTime(start_time, duration).isBefore() ? '✓' : ''
    return (
      <tr className='gameSelector' key={key}>
        <td style={{width: 5}}></td>
        <td style={{width: 340}}>{title}</td>
        <td style={{width: 340}}>{runner}</td>
        <td style={{width: 140}}>{start_time.format('MMM D, h:mm a')} {status}</td>
        <td>{duration}</td>
      </tr>
    )
  }

  getRows() {
    return this.props.schedule.map((game, idx) => {
      return this.toRow(game.name, game.runners, game.start_time, game.duration, idx)
    })
  }

  getGamesCompleted () {
    return this.props.schedule.filter((g) => this.endTime(g.start_time, g.duration).isBefore()).length
  }

  render () {
    return (
      <div className='section'>
        <h2>Games</h2>
        <div className="content" style={{padding: 0}}>
          <div id="game-list">
            <table id="gamesTable">
              {this.getHeader()}
              <tbody>
                {this.getRows()}
              </tbody>
            </table>
          </div>
        </div>
        <div className='current_stats'>
          <Stat title='Games Completed' emoji='🎮' value={this.getGamesCompleted()} />
        </div>
      </div>
    )
  }
}

function mapPropsToState(state) {
  return {
    schedule: state.gdq.schedule
  }
}

export default connect(mapPropsToState)(GamesTable)
