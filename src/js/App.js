import React from 'react'
import StatsContainer from './components/StatsContainer'
import GamesTable from './components/GamesTable'
import GraphContainer from './components/GraphContainer'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import { fetchInitialTimeseries,
  fetchSchedule,
  fetchRecentTimeseries } from './actions'
import moment from 'moment'
import Visibility from 'visibilityjs'
import { OFFLINE_MODE } from './constants'

class App extends React.PureComponent {
  static propTypes = {
    fetchInitialTimeseries: PropTypes.func.isRequired,
    fetchSchedule: PropTypes.func.isRequired,
    fetchRecentTimeseries: PropTypes.func.isRequired
  }

  componentWillMount () {
    this.props.fetchInitialTimeseries()
    this.props.fetchSchedule()

    // Refresh every minute when page is active, every 5 minutes when not active
    // Only set timeseries to refresh when we're not in offline mode
    if (!OFFLINE_MODE) {
      const minute = 60 * 1000
      Visibility.every(minute, 5 * minute, () => {
        this.props.fetchRecentTimeseries(moment().subtract(1, 'hours').toDate())
      })
    }
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
