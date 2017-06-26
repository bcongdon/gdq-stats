import React from 'react'
import { connect } from 'react-redux'
import { setCurrentSeries } from '../actions'
import { PropTypes } from 'prop-types'
import { Nav, NavItem, Grid, Col } from 'react-bootstrap'
import moment from 'moment'
import { LineChart, Line, Tooltip, ResponsiveContainer, XAxis, YAxis } from 'recharts'

const GRAPHS = [
  'Viewers',
  'Donations',
  'Donations per minute',
  'Donors',
  'Tweets',
  'Tweets per minute',
  'Twitch Chats',
  'Twitch Chats per minute',
  'Twitch Emotes',
  'Twitch Emotes per minute'
]

const AxisLabel = ({ axisType, viewBox, fill, fontWeight, fontSize, children }) => {
  const { x, y, width, height } = viewBox
  const isVert = axisType === 'yAxis'
  const cx = isVert ? x + 75 : x + (width / 2)
  const cy = isVert ? 20 : y + height + 10
  const rot = isVert ? `270 ${cx} ${cy}` : 0
  return (
    <text
      x={cx}
      y={cy}
      transform={`rotate(${rot})`}
      textAnchor='end'
      fill={fill}
      fontWeight={fontWeight}
      fontSize={fontSize}>
      {children}
    </text>
  )
}

class GraphContainer extends React.Component {
  static propTypes = {
    setCurrentSeries: PropTypes.func.isRequired,
    activeSeries: PropTypes.number.isRequired
  }

  constructor (props) {
    super(props)
    this.onSelect = this.onSelect.bind(this)
  }

  onSelect (idx) {
    this.props.setCurrentSeries(idx)
  }

  render () {
    const rate = Number.parseInt(this.props.timeseries.length / 500)
    const resampleSeries = this.props.timeseries.filter((d, idx) => idx % rate == 0 && d.v >= 0)
    return (
      <div className='section'>
        <h2>Live Stats</h2>
        <Grid>
          <Col sm={4} md={2} className='graph-series-chooser'>
            <Nav bsStyle='pills' stacked activeKey={this.props.activeSeries} onSelect={this.onSelect}>
              {GRAPHS.map((name, idx) => <NavItem eventKey={idx} key={idx}>{name}</NavItem>)}
            </Nav>
          </Col>
          <Col sm={8} md={10} className='graph-container'>
            <ResponsiveContainer width='100%' height={500}>
              <LineChart data={resampleSeries} margin={{top: 20}}>
                <Line
                  type='basis'
                  dataKey='v'
                  stroke='#00AEEF'
                  strokeWidth={1.5}
                  dot={false}
                  activeDot />
                <Tooltip />
                <XAxis
                  dataKey='time'
                  axisLine={{stroke: '#ddd'}}
                  tickLine={{stroke: '#ddd'}}
                  tickFormatter={(d) => moment(d).format('ddd, hA')}
                  tick={{fill: '#333', fontWeight: 300, fontSize: 13}}
                  interval='preserveStart'
                  minTickGap={50} />
                <YAxis
                  dataKey='v'
                  axisLine={{stroke: '#ddd'}}
                  tickLine={{stroke: '#ddd'}}
                  tick={{fill: '#333', fontWeight: 300, fontSize: 13}}
                  interval='preserveStartEnd'
                  label={<AxisLabel axisType='yAxis' fill='#333' fontWeight={300} fontSize={13}>Viewers</AxisLabel>}
                  orientation='left' />
              </LineChart>
            </ResponsiveContainer>
          </Col>
        </Grid>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    activeSeries: state.gdq.series,
    timeseries: state.gdq.timeseries
  }
}

export default connect(mapStateToProps, { setCurrentSeries })(GraphContainer)
