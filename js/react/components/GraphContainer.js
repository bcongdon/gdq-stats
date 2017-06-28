import React from 'react'
import { connect } from 'react-redux'
import { setCurrentSeries } from '../actions'
import { PropTypes } from 'prop-types'
import { Nav, NavItem, Grid, Col, Row, ButtonGroup, Button } from 'react-bootstrap'
import moment from 'moment'
import { LineChart, Line, Tooltip, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import VerticalLabel from './VerticalLabel'
import GamesTooltip from './GamesTooltip'
import { format } from 'd3'
import GRAPHS from '../graph-definitions'
import Select from 'react-select'

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
    const dataFormat = GRAPHS[this.props.activeSeries].format
    const tooltipFormat = GRAPHS[this.props.activeSeries].tooltipFormat || dataFormat

    let series = []
    if (dataKey.indexOf('_') !== -1) {
      series = this.createSyntheticSeries(dataKey, this.props.timeseries)
    } else {
      series = this.props.timeseries
    }

    let resampleSeries = series.filter((d, idx) => idx % rate === 0 && d[dataKey] >= 0)

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
                    axisLine={{stroke: '#ddd'}}
                    tickLine={{stroke: '#ddd'}}
                    tickFormatter={(d) => moment(d).format('ddd, hA')}
                    tick={{fill: '#333', fontWeight: 300, fontSize: 13}}
                    interval='preserveStart'
                    minTickGap={50} />
                  <YAxis
                    dataKey={dataKey}
                    tickFormatter={dataFormat}
                    axisLine={{stroke: '#ddd'}}
                    tickLine={{stroke: '#ddd'}}
                    tick={{fill: '#333', fontWeight: 300, fontSize: 13}}
                    domain={[0, 'dataMax']}
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
            <Col sm={4} style={{fontFamily: 'Open Sans'}}>
              <Select
                className='Select Select--sm'
                name="form-field-name"
                options={selectOptions}
                placeholder='Zoom to Game...'
              />
            </Col>
            <Col sm={4} style={{fontFamily: 'Open Sans'}}>
              <ButtonGroup>
                <Button>1hr</Button>
                <Button>6hr</Button>
                <Button>12hr</Button>
                <Button>1d</Button>
                <Button>3d</Button>
                <Button>All</Button>
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
    schedule: state.gdq.schedule
  }
}

export default connect(mapStateToProps, { setCurrentSeries })(GraphContainer)
