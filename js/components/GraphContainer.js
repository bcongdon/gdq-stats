import React from 'react'
import { connect } from 'react-redux'
import { setCurrentSeries, setButtonZoom, setGameZoom } from '../actions'
import { PropTypes } from 'prop-types'
import Nav from 'react-bootstrap/lib/Nav'
import NavItem from 'react-bootstrap/lib/NavItem'
import Grid from 'react-bootstrap/lib/Grid'
import Col from 'react-bootstrap/lib/Col'
import Row from 'react-bootstrap/lib/Row'
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup'
import Button from 'react-bootstrap/lib/Button'
import PacmanLoader from 'halogen/PacmanLoader'
import moment from 'moment'
import { LineChart, Line, Tooltip, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import VerticalLabel from './VerticalLabel'
import GamesTooltip from './GamesTooltip'
import GRAPHS from '../graph-definitions'
import Select from 'react-select'
import { movingAverage } from '../utils'

const zoomButtons = [
  { label: '1h', hours: 1 },
  { label: '3h', hours: 3 },
  { label: '6h', hours: 6 },
  { label: '12h', hours: 12 },
  { label: '1d', hours: 24 },
  { label: '3d', hours: 72 }
]

class GraphContainer extends React.PureComponent {
  static propTypes = {
    setCurrentSeries: PropTypes.func.isRequired,
    activeSeries: PropTypes.number.isRequired,
    timeseries: PropTypes.array.isRequired,
    schedule: PropTypes.array.isRequired,
    activeButtonZoomIndex: PropTypes.number,
    activeGameZoom: PropTypes.object,
    setGameZoom: PropTypes.func.isRequired,
    setButtonZoom: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.onSelect = this.onSelect.bind(this)
  }

  onSelect (idx) {
    this.props.setCurrentSeries(idx)
  }

  // Creates "synthetic" series by aggregating a base series
  //  Aggregations are either accumulations or 'derivations'
  //  Accumulate transforms "per minute" series to cumulative
  //  Derive transforms cumulative series to "per minute"
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

  // Returns [min, max] moment times of domain based on current state of graph options
  getDomain () {
    const { activeButtonZoomIndex, activeGameZoom } = this.props
    const maxTime = this.props.timeseries[this.props.timeseries.length - 1].time
    let min = moment.unix(0)
    let max = moment(maxTime).clone()
    if (activeButtonZoomIndex >= 0) {
      const zoomHours = zoomButtons[activeButtonZoomIndex].hours
      min = moment(maxTime).clone().subtract(zoomHours, 'hours')
    } else if (activeGameZoom) {
      const [hours, minutes, seconds] = activeGameZoom.duration.split(':')
      min = activeGameZoom.moment
      max = activeGameZoom.moment.clone()
        .add(hours, 'hours')
        .add(minutes, 'minutes')
        .add(seconds, 'seconds')
    }
    return [min, max]
  }

  getDateFormatter (domain)
  {
    const [min, max] = domain
    const format = min.clone().add(1, 'days').isBefore(max) ? 'ddd, hA' : 'h:mm A'
    return (d) => moment.unix(d).format(format)
  }

  getGraph () {
    if (!this.props.timeseries || !this.props.timeseries.length) {
      return null
    }

    const domain = this.getDomain()

    const activeGraph = GRAPHS[this.props.activeSeries]
    const tooltipFormat = GRAPHS[this.props.activeSeries].tooltipFormat || activeGraph.format
    const dateFormat = this.getDateFormatter(domain)

    let series = this.props.timeseries
    if (activeGraph.key.indexOf('_') !== -1) {
      series = this.createSyntheticSeries(activeGraph.key, this.props.timeseries)
    }

    const trimmedTimeseries = series
      // Filter to correct domain
      .filter((obj) => {
        const objMoment = moment(obj.time)
        return objMoment.isAfter(domain[0]) && objMoment.isBefore(domain[1])
      })

    const rate = Math.ceil(trimmedTimeseries.length / 500)
    let resampleSeries = trimmedTimeseries
      // Resample
      .filter((d, idx) => idx % rate === 0 && d[activeGraph.key] >= 0)
      .map((o) => {
        return { ...o, time: moment(o.time).unix() }
      })
      .sort((a, b) => a.time - b.time)

    if(activeGraph.movingAverage) {
      resampleSeries = movingAverage(resampleSeries, activeGraph.key, Math.ceil(trimmedTimeseries.length / 100))      
    }
      

    const yAxisLabel = (
      <VerticalLabel
        axisType='yAxis'
        fill='#333'
        fontWeight={300}
        fontSize={13}>
        {activeGraph.name}
      </VerticalLabel>
    )

    const selectOptions = this.props.schedule.filter((obj) => obj.moment.isBefore())

    return (
      <Grid>
        <Row>
          <Col sm={4} md={2} className='graph-series-chooser'>
            <Nav bsStyle='pills' stacked activeKey={this.props.activeSeries} onSelect={this.onSelect}>
              {GRAPHS.map((obj, idx) => <NavItem eventKey={idx} key={idx}>{obj.name}</NavItem>)}
            </Nav>
          </Col>
          <hr className='hidden-sm hidden-md hidden-lg' style={{borderTopWidth: 1.5, borderColor: '#ddd'}}/>
          <Col sm={8} md={10} className='graph-container'>
            <ResponsiveContainer width='100%' height={500}>
              <LineChart data={resampleSeries} margin={{top: 20}}>
                <Line
                  type='basis'
                  dataKey={activeGraph.key}
                  name={activeGraph.name}
                  stroke='#00AEEF'
                  strokeWidth={1.5}
                  dot={false}
                  activeDot />
                <Tooltip
                  content={<GamesTooltip schedule={this.props.schedule} format={tooltipFormat} />}
                  animationDuration={250} />
                <XAxis
                  dataKey='time'
                  type='number'
                  scale='time'
                  axisLine={{stroke: '#ddd'}}
                  tickLine={{stroke: '#ddd'}}
                  tickFormatter={dateFormat}
                  tick={{fill: '#333', fontWeight: 300, fontSize: 13}}
                  interval='preserveStart'
                  domain={['dataMin', 'dataMax']}
                  minTickGap={50} />
                <YAxis
                  dataKey={activeGraph.key}
                  tickFormatter={activeGraph.format}
                  axisLine={{stroke: '#ddd'}}
                  tickLine={{stroke: '#ddd'}}
                  tick={{fill: '#333', fontWeight: 300, fontSize: 13}}
                  domain={['dataMin', 'dataMax']}
                  interval='preserveStartEnd'
                  minTickGap={0}
                  label={yAxisLabel}
                  orientation='left' />
              </LineChart>
            </ResponsiveContainer>
          </Col>
        </Row>
        <Row className='series-options'>
          <Col sm={4} style={{height: 32}}>
            <span style={{position: 'relative', top: 8}}>Options</span>
          </Col>
          <Col sm={3} style={{fontFamily: 'Open Sans'}}>
            <Select
              options={selectOptions}
              labelKey='name'
              valueKey='name'
              placeholder='Zoom to Game...'
              value={this.props.activeGameZoom ? this.props.activeGameZoom.name : null}
              onChange={this.props.setGameZoom}
            />
          </Col>
          <Col sm={5} style={{fontFamily: 'Open Sans'}}>
            <ButtonGroup>
              {zoomButtons.map((obj, idx) =>
                <Button
                  key={idx}
                  active={this.props.activeButtonZoomIndex === idx}
                  onClick={() => this.props.setButtonZoom(idx)}>
                  {obj.label}
                </Button>
              )}
            </ButtonGroup>
          </Col>
        </Row>
      </Grid>
    )
  }

  render () {
    const graph = this.getGraph()
    return (
      <div className='section'>
        <h2>Live Stats</h2>
        {graph ? graph : <PacmanLoader color='#00AEEF' className='graph-loader'/>}
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    activeSeries: state.gdq.series,
    timeseries: state.gdq.timeseries,
    schedule: state.gdq.schedule,
    activeButtonZoomIndex: state.gdq.activeButtonZoomIndex,
    activeGameZoom: state.gdq.activeGameZoom
  }
}

export default connect(mapStateToProps, { setCurrentSeries, setButtonZoom, setGameZoom })(GraphContainer)
