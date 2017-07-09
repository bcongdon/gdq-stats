import React from 'react'
import GraphContainer from './components/GraphContainer'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import { fetchInitialTimeseries, fetchSchedule, fetchRecentTimeseries } from './actions'
import moment from 'moment'
import Grid from 'react-bootstrap/lib/Grid'
import Col from 'react-bootstrap/lib/Col'
import ReturnHome from './components/ReturnHome'

class App extends React.PureComponent {
  static propTypes = {
    fetchInitialTimeseries: PropTypes.func.isRequired,
    fetchSchedule: PropTypes.func.isRequired,
    fetchRecentTimeseries: PropTypes.func.isRequired
  }

  componentWillMount () {
    this.props.fetchInitialTimeseries()
    this.props.fetchSchedule()

    // setInterval(() => this.props.fetchRecentTimeseries(moment().subtract(1, 'hours').toDate()), 60 * 1000)
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
