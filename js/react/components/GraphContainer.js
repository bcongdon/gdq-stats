import React from 'react'
import { connect } from 'react-redux'
import { setCurrentSeries } from '../actions'
import { PropTypes } from 'prop-types'
import { Nav, NavItem, Grid, Col } from 'react-bootstrap'
import moment from 'moment'
import { LineChart, Line, Tooltip, ResponsiveContainer, XAxis, YAxis, Brush } from 'recharts'

const GRAPHS = [
  { name: 'Viewers', key: 'v' },
  { name: 'Donations', key: 'm' },
  { name: 'Donations per minute', key: 'm_drv' },
  { name: 'Donors', key: 'd' },
  { name: 'Tweets', key: 't_acc' },
  { name: 'Tweets per minute', key: 't' },
  { name: 'Twitch Chats', key: 'c_acc' },
  { name: 'Twitch Chats per minute', key: 'c' },
  { name: 'Twitch Emotes', key: 'e_acc' },
  { name: 'Twitch Emotes per minute', key: 'e' }
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

  createSyntheticSeries (key, series) {
    const baseKey = key.slice(0, key.indexOf('_'))
    const accumulate = (acc, val) => {
      const newVal = val[baseKey] + (acc.length ? acc[acc.length - 1][key] : 0)
      let newObj = {time: val.time}
      newObj[key] = newVal
      acc.push(newObj)
      return acc
    }
    const derive = (acc, val) => {
      const newVal = acc.length ? (val[baseKey] - acc[acc.length - 1][baseKey]) : 0
      let newObj = {time: val.time}
      newObj[key] = newVal
      newObj[baseKey] = val[baseKey]
      acc.push(newObj)
      return acc
    }
    const reduceFunc = key.slice(baseKey.length + 1) === 'acc' ? accumulate : derive
    return series.reduce(reduceFunc, [])
  }

  render () {
    const rate = Number.parseInt(this.props.timeseries.length / 500)
    const dataKey = GRAPHS[this.props.activeSeries].key
    const dataName = GRAPHS[this.props.activeSeries].name
    
    let series = []
    if(dataKey.indexOf('_') !== -1) {
      series = this.createSyntheticSeries(dataKey, this.props.timeseries)
    } else {
      series = this.props.timeseries
    }

    let resampleSeries = series.filter((d, idx) => idx % rate == 0 && d[dataKey] >= 0)

    return (
      <div className='section'>
        <h2>Live Stats</h2>
        <Grid>
          <Col sm={4} md={2} className='graph-series-chooser'>
            <Nav bsStyle='pills' stacked activeKey={this.props.activeSeries} onSelect={this.onSelect}>
              {GRAPHS.map((obj, idx) => <NavItem eventKey={idx} key={idx}>{obj.name}</NavItem>)}
            </Nav>
          </Col>
          <Col sm={8} md={10} className='graph-container'>
            <ResponsiveContainer width='100%' height={500}>
              <LineChart data={resampleSeries} margin={{top: 20}}>
                <Line
                  type='basis'
                  dataKey={dataKey}
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
                  dataKey={dataKey}
                  axisLine={{stroke: '#ddd'}}
                  tickLine={{stroke: '#ddd'}}
                  tick={{fill: '#333', fontWeight: 300, fontSize: 13}}
                  domain={[0, 'dataMax']}
                  interval='preserveStartEnd'
                  label={<AxisLabel axisType='yAxis' fill='#333' fontWeight={300} fontSize={13}>{dataName}</AxisLabel>}
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
