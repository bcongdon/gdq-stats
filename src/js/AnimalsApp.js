import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import { GDQ_STORAGE_ENDPOINT,
  PRIMARY_COLOR,
  SECONDARY_COLOR } from './constants'
import { BarChart,
  Bar,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid } from 'recharts'
import PacmanLoader from 'halogen/PacmanLoader'
import VerticalLabel from './components/VerticalLabel'
import ReturnHome from './components/ReturnHome'
import Grid from 'react-bootstrap/lib/Grid'
import Col from 'react-bootstrap/lib/Col'
import Stat from './components/Stat'
import C3Chart from 'react-c3js'
import 'c3/c3.css'
import dayjs from 'dayjs'
import { format } from 'd3-format'

const GRAPH_MARGINS = {top: 25, left: 100, bottom: 24, right: 24}

class AnimalsApp extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {}
  }

  componentWillMount () {
    // Fetch bid series data
    axios.get(GDQ_STORAGE_ENDPOINT + '/kill_save_animals.json')
      .then((response) => this.setState({ bidData: response.data }))
  }

  getLoader () {
    return <PacmanLoader color={PRIMARY_COLOR} className='gdq-loader' />
  }

  getUserGraph () {
    if (!this.state.chatUsers) {
      return this.getLoader()
    }
    const yAxisLabel = (
      <VerticalLabel
        axisType='yAxis'
        xOffset={-70}
        yOffset={275}
        className='recharts-label'>
        Username
      </VerticalLabel>
    )
    return (
      <ResponsiveContainer width='100%' minHeight={600}>
        <BarChart margin={GRAPH_MARGINS} barGap={150} layout='vertical' data={this.state.chatUsers}>
          <Tooltip labelFormater={() => 'foo'}formatter={(val) => `${val} messages sent`} />
          <CartesianGrid horizontal={false} />
          <XAxis label='Number of Messages Sent' orientation='top' type='number' />
          <YAxis label={yAxisLabel} className='chat-y-axis' interval={0} type='category' dataKey='user' />
          <Bar dataKey='count' fill={PRIMARY_COLOR} />
        </BarChart>
      </ResponsiveContainer>
    )
  }

  getBidStats () {
    if (!this.state.bidData) {
      return []
    }
    const latest = this.state.bidData[this.state.bidData.length - 1]
    const stats = [
      { title: 'Kill the Animals', emoji: '🔪', value: latest.save },
      { title: 'Save the Animals', emoji: '👼', value: latest.kill }
    ]
    const bidStats = stats.map((props, idx) => {
      return <Stat key={idx} {...props} prefix='$' value={+(props.value.toFixed(2))} format='(,ddd).dd' />
    })

    return (
      <Grid className='current_stats content' style={{fontSize: 20, fontWeight: 'bold'}}>
        <Col lg={1} md={0} />
        {bidStats[0]}
        <Col lg={2} md={0} />
        {bidStats[1]}
      </Grid>
    )
  }

  getAnimalsTimeseries () {
    const kill = ['kill']
    const save = ['save']
    const time = ['time']
    this.state.bidData.filter((obj, idx) => idx % 10 === 0)
      .forEach((obj) => {
        time.push(dayjs(obj.time).toDate())
        kill.push(obj.kill)
        save.push(obj.save)
      })
    const data = {
      x: 'time',
      columns: [ kill, save, time ],
      names: {
        kill: 'Kill the Animals',
        save: 'Save the Animals'
      },
      colors: {
        save: PRIMARY_COLOR,
        kill: SECONDARY_COLOR
      }

    }
    const axis = {
      x: {
        type: 'timeseries',
        tick: {
          count: 5,
          format: '%Y-%m-%d %H:%M'
        }
      },
      y: {
        tick: {
          format: format('$,.2s')
        }
      }
    }
    const point = { show: false }
    return <C3Chart data={data} axis={axis} point={point} zoom={{enabled: true}} />
  }

  getAnimalsDiffTimeseries () {
    const diff = ['diff']
    const time = ['time']
    this.state.bidData.filter((obj, idx) => idx % 10 === 0)
      .forEach((obj) => {
        time.push(dayjs(obj.time).toDate())
        console.log(obj)
        diff.push(obj.save - obj.kill)
      })
    const data = {
      x: 'time',
      columns: [ diff, time ],
      names: {
        diff: 'Kill the Animals'
      },
      color: (c, obj) => obj.value < 0 ? PRIMARY_COLOR : SECONDARY_COLOR

    }
    const axis = {
      x: {
        type: 'timeseries',
        tick: {
          count: 5,
          format: '%Y-%m-%d %H:%M'
        }
      },
      y: {
        tick: {
          format: format('$,.2s')
        }
      }
    }
    const point = { show: false }
    return <C3Chart data={data} axis={axis} point={point} zoom={{enabled: true}} />
  }

  render () {
    return (
      <div>
        <ReturnHome />
        <div className='section'>
          <h2>Animal Bid Series Totals</h2>
          {this.state.bidData ? this.getBidStats() : this.getLoader()}
        </div>
        <div className='section'>
          <h2>Animal Bid Series Over Time</h2>
          {this.state.bidData ? this.getAnimalsTimeseries() : this.getLoader()}
        </div>
        <div className='section'>
          <h2>Animal Bid Series Winner Over Time</h2>
          {this.state.bidData ? this.getAnimalsDiffTimeseries() : this.getLoader()}
        </div>
      </div>
    )
  }
}

ReactDOM.render(
  <AnimalsApp />,
  document.getElementById('react-root')
)
