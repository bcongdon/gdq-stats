import React from 'react'
import { connect } from 'react-redux'
import { setCurrentSeries, setButtonZoom } from '../actions'
import { PropTypes } from 'prop-types'
import { Nav, NavItem, Grid, Col, Row, ButtonGroup, Button } from 'react-bootstrap'
import moment from 'moment'
import { LineChart, Line, Tooltip, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import VerticalLabel from './VerticalLabel'
import GamesTooltip from './GamesTooltip'
import { format } from 'd3'
import GRAPHS from '../graph-definitions'
import Select from 'react-select'

const zoomButtons = [
  { label: '1h', hours: 1 },
  { label: '3h', hours: 3 },
  { label: '6h', hours: 6 },
  { label: '12h', hours: 12 },
  { label: '1d', hours: 24 },
  { label: '3d', hours: 72 },
]


class GraphContainer extends React.Component {
  static propTypes = {
    setCurrentSeries: PropTypes.func.isRequired,
    activeSeries: PropTypes.number.isRequired,
    timeseries: PropTypes.array.isRequired,
    schedule: PropTypes.array.isRequired
  }

  constructor (props) {
    super(props)
    this.onSelect = this.onSelect.bind(this)
    this.onZoomButtonClick = this.onZoomButtonClick.bind(this)
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

  onZoomButtonClick (idx) {
    this.props.setButtonZoom(idx)
  }

  getMinTime () {
    const zoomIndex = this.props.activeButtonZoomIndex
    const maxTime = this.props.timeseries[this.props.timeseries.length - 1].time
    let min = moment.unix(0)
    if (zoomIndex >= 0) {
      const zoomHours = zoomButtons[zoomIndex].hours
      min = moment(maxTime).subtract(zoomHours, 'hours')
    }
    return min
  }

  render () {
    if (!this.props.timeseries || !this.props.timeseries.length) {
      return null
    }

    const domainMin = this.getMinTime()
    const trimmedTimeseries = this.props.timeseries.filter((obj) => {
      return moment(obj.time).isAfter(domainMin)
    })

    const rate = Math.ceil(trimmedTimeseries.length / 500)
    const dataKey = GRAPHS[this.props.activeSeries].key
    const dataName = GRAPHS[this.props.activeSeries].name
    const dataFormat = GRAPHS[this.props.activeSeries].format
    const tooltipFormat = GRAPHS[this.props.activeSeries].tooltipFormat || dataFormat

    let series = []
    if (dataKey.indexOf('_') !== -1) {
      series = this.createSyntheticSeries(dataKey, trimmedTimeseries)
    } else {
      series = trimmedTimeseries
    }

    let resampleSeries = series.filter((d, idx) => idx % rate === 0 && d[dataKey] >= 0).map((o) => {
      return {...o, time: moment(o.time).unix() }
    }).sort((a, b) => a.time - b.time)


    const yAxisLabel = (
      <VerticalLabel
        axisType='yAxis'
        fill='#333'
        fontWeight={300}
        fontSize={13}>
        {dataName}
      </VerticalLabel>
    )

    const selectOptions = this.props.schedule.map((g, idx) => { 
      return {
        value: idx,
        label: g.name
      }
    })

    return (
      <div className='section'>
        <h2>Live Stats</h2>
        <Grid>
          <Row>
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
                    name={dataName}
                    stroke='#00AEEF'
                    strokeWidth={1.5}
                    dot={false}
                    activeDot />
                  <Tooltip
                    content={<GamesTooltip schedule={this.props.schedule} format={tooltipFormat}/>}
                    animationDuration={250} />
                  <XAxis
                    dataKey='time'
                    type='number'
                    axisLine={{stroke: '#ddd'}}
                    tickLine={{stroke: '#ddd'}}
                    tickFormatter={(d) => moment(d).format('ddd, hA')}
                    tick={{fill: '#333', fontWeight: 300, fontSize: 13}}
                    interval='preserveStart'
                    domain={['dataMin', 'dataMax']}
                    minTickGap={50}/>
                  <YAxis
                    dataKey={dataKey}
                    tickFormatter={dataFormat}
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
            <Col sm={4}>
              Options
            </Col>
            <Col sm={3} style={{fontFamily: 'Open Sans'}}>
              <Select
                className='Select Select--sm'
                name="form-field-name"
                options={selectOptions}
                placeholder='Zoom to Game...'
              />
            </Col>
            <Col sm={5} style={{fontFamily: 'Open Sans'}}>
              <ButtonGroup>
                {zoomButtons.map((obj, idx) => 
                  <Button
                    key={idx}
                    active={this.props.activeButtonZoomIndex == idx}
                    onClick={() => this.onZoomButtonClick(idx)}>
                    {obj.label}
                  </Button>
                )}
              </ButtonGroup>
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    activeSeries: state.gdq.series,
    timeseries: state.gdq.timeseries,
    schedule: state.gdq.schedule,
    activeButtonZoomIndex: state.gdq.activeButtonZoomIndex
  }
}

export default connect(mapStateToProps, { setCurrentSeries, setButtonZoom })(GraphContainer)
