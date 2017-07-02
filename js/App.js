import React from 'react'
import StatsContainer from './components/StatsContainer'
import GamesTable from './components/GamesTable'
import GraphContainer from './components/GraphContainer'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import { fetchInitialTimeseries, fetchSchedule, fetchRecentTimeseries } from './actions'
import moment from 'moment'

class App extends React.PureComponent {
  static propTypes = {
    fetchInitialTimeseries: PropTypes.func.isRequired,
    fetchSchedule: PropTypes.func.isRequired,
    fetchRecentTimeseries: PropTypes.func.isRequired
  }

  componentWillMount () {
    this.props.fetchInitialTimeseries()
    this.props.fetchSchedule()

    setInterval(() => this.props.fetchRecentTimeseries(moment().subtract(1, 'hours').toDate()), 60 * 1000)
  }

  render () {
    return <div>
      <StatsContainer />
      <GraphContainer />
      <GamesTable />
    </div>
  }
}

export default connect(null, { fetchInitialTimeseries, fetchSchedule, fetchRecentTimeseries })(App)
