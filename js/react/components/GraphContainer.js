import React from 'react'
import { connect } from 'react-redux'
import { setCurrentSeries } from '../actions'
import { Nav, NavItem, Grid, Col } from 'react-bootstrap'

const GRAPHS = [
  "Viewers",
  "Donations",
  "Donations per minute",
  "Donors",
  "Tweets",
  "Tweets per minute",
  "Twitch Chats",
  "Twitch Chats per minute",
  "Twitch Emotes",
  "Twitch Emotes per minute"
]

class GraphContainer extends React.Component {
  constructor (props) {
    super(props)
    this.onSelect = this.onSelect.bind(this)
  }

  onSelect (idx) {
    this.props.setCurrentSeries(idx)
  }

  render () {
    return (
      <div className="section">
        <h2>Live Stats</h2>
        <Grid>
          <Col sm={4} md={2} className='graph-series-chooser'>
            <Nav bsStyle="pills" stacked activeKey={this.props.activeSeries} onSelect={this.onSelect}>
              {GRAPHS.map((name, idx) => <NavItem eventKey={idx}>{name}</NavItem>)}
            </Nav>
          </Col>
        </Grid>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    activeSeries: state.gdq.series
  }
}

export default connect(mapStateToProps, { setCurrentSeries })(GraphContainer)
