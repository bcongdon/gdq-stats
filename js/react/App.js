import React from 'react'
import StatsContainer from './components/StatsContainer'
import GamesTable from './components/GamesTable'
import { connect } from 'react-redux'
import { fetchInitialTimeseries, fetchSchedule } from './actions'


class App extends React.Component {
  componentWillMount () {
    this.props.fetchInitialTimeseries()
    this.props.fetchSchedule()
  }

  render () {
    return <div>
      <StatsContainer />
      <GamesTable />
    </div>
  }
}

export default connect(null, { fetchInitialTimeseries, fetchSchedule })(App)
