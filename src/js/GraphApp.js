import React from 'react'
import GraphContainer from './components/GraphContainer'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import { fetchInitialTimeseries,
  fetchSchedule,
  fetchRecentTimeseries } from './actions'
import dayjs from 'dayjs'
import Grid from 'react-bootstrap/lib/Grid'
import Col from 'react-bootstrap/lib/Col'
import ReturnHome from './components/ReturnHome'
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
      Visibility.every(minute, minute, () => {
        this.props.fetchRecentTimeseries(dayjs().subtract(1, 'hours').toDate())
      })
    }
  }

  render () {
    return (
      <Grid>
        <ReturnHome />
        <Col xsHidden smHidden>
          <GraphContainer fullscreen />
        </Col>
        <Col lgHidden mdHidden className='section'>
          <h2>Oops!</h2>
          <div className='content'>
            <h3>Currently, advanced graphs are only supported on desktop. <a href='/'>Return Home</a></h3>
          </div>
        </Col>
      </Grid>
    )
  }
}

export default connect(null, { fetchInitialTimeseries, fetchSchedule, fetchRecentTimeseries })(App)
