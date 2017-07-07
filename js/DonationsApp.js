import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import { GDQ_STORAGE_ENDPOINT, PRIMARY_COLOR, SECONDARY_COLOR } from './constants'
import { BarChart, Bar, LineChart, Line, Tooltip, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from 'recharts'
import C3Chart from 'react-c3js'
import 'c3/c3.css'
import PacmanLoader from 'halogen/PacmanLoader'
import VerticalLabel from './components/VerticalLabel'
import ReturnHome from './components/ReturnHome'
import { format } from 'd3-format'
import Grid from 'react-bootstrap/lib/Grid'
import Col from 'react-bootstrap/lib/Col'
import Stat from './components/Stat'
import moment from 'moment'

class DonationsApp extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {}
  }

  componentWillMount () {
    // Fetch donation stats
    axios.get(GDQ_STORAGE_ENDPOINT + '/donation_stats.json')
      .then((response) => this.setState({ donationStats: response.data }))

    // Fetch donation words
    axios.get(GDQ_STORAGE_ENDPOINT + '/donation_words.json')
      .then((response) => this.setState({ donationWords: response.data }))

    // Fetch top donors
    axios.get(GDQ_STORAGE_ENDPOINT + '/top_donors.json')
      .then((response) => this.setState({ topDonors: response.data }))
  }

  getLoader () {
    return <PacmanLoader color={PRIMARY_COLOR} className='graph-loader' />
  }

  getCommentCountPieChart () {
    if (!this.state.donationStats) {
      return this.getLoader()
    }
    let columns = []
    this.state.donationStats.comment_stats.forEach((stat) => {
      const columnArr = [stat.has_comment ? 'commented' : 'uncommented']
      columnArr.push(stat.count)
      columns.push(columnArr)
    })
    const c3Data = {
      columns: columns,
      type: 'donut',
      names: {
        commented: 'Has Comment',
        uncommented: 'No Comment'
      },
      colors: {
        commented: PRIMARY_COLOR,
        uncommented: SECONDARY_COLOR
      }
    }
    const c3Donut = {
      label: {
        format: (value) => format(',.0f')(value)
      },
      width: 60,
      title: 'Number of Donations'
    }
    return (
      <C3Chart data={c3Data} donut={c3Donut} />
    )
  }

  getCommentSumPieChart () {
    if (!this.state.donationStats) {
      return this.getLoader()
    }
    let columns = []
    this.state.donationStats.comment_stats.forEach((stat) => {
      const columnArr = [stat.has_comment ? 'commented' : 'uncommented']
      columnArr.push(stat.sum)
      columns.push(columnArr)
    })
    const c3Data = {
      columns: columns,
      type: 'donut',
      names: {
        commented: 'Has Comment',
        uncommented: 'No Comment'
      },
      colors: {
        commented: PRIMARY_COLOR,
        uncommented: SECONDARY_COLOR
      }
    }
    const c3Donut = {
      label: {
        format: (value) => format('$,.2s')(value)
      },
      width: 60,
      title: 'Total Donations'
    }
    return (
      <C3Chart data={c3Data} donut={c3Donut} />
    )
  }

  getDonationStatContainer () {
    if (!this.state.donationStats) {
      return this.getLoader()
    }
    const [ commented, uncommented ] = this.state.donationStats.comment_stats
    const overall = this.state.donationStats.overall[0]
    const stats = [
      { title: 'Median Donation - Overall', emoji: '💸', value: overall.median },
      { title: 'Median Donation w/ Comment', emoji: '🗣', value: commented.median },
      { title: 'Median Donation w/o Comment', emoji: '🙊', value: uncommented.median },
      { title: 'Average Donation - Overall', emoji: '💸', value: overall.avg },
      { title: 'Average Donation w/ Comment', emoji: '🗣', value: commented.avg },
      { title: 'Average Donation w/o Comment', emoji: '🙊', value: uncommented.avg }
    ]
    return stats.map((props, idx) => {
      return <Stat key={idx} {...props} prefix='$' value={+(props.value.toFixed(2))} format='(,ddd).dd' />
    })
  }

  getMediansChart () {
    if (!this.state.donationStats) {
      return this.getLoader()
    }
    const medians = this.state.donationStats.medians.map((obj) => {
      return {...obj, time: moment(obj.time).unix()}
    })
    return (
      <ResponsiveContainer width='100%' height={500}>
        <LineChart data={medians} margin={{top: 20}}>
          <Line
            type='basis'
            dataKey='median'
            name='Median Donation Amount'
            stroke={PRIMARY_COLOR}
            strokeWidth={1.5}
            dot={false}
            activeDot />
          <YAxis
            dataKey='median'
            tickFormatter={format('$,')}
            axisLine={{stroke: '#ddd'}}
            tickLine={{stroke: '#ddd'}}
            tick={{fill: '#333', fontWeight: 300, fontSize: 13}}
            domain={[0, 'dataMax']}
            interval='preserveStartEnd'
            minTickGap={0} />
          <Tooltip
            formatter={format('$,.2f')}
            labelFormatter={(d) => moment.unix(d).format('ddd, MMM Do YYYY, h:mm a')} />
          <XAxis
            dataKey='time'
            type='number'
            scale='time'
            axisLine={{stroke: '#ddd'}}
            tickLine={{stroke: '#ddd'}}
            tickFormatter={(d) => moment.unix(d).format('ddd, hA')}
            tick={{fill: '#333', fontWeight: 300, fontSize: 13}}
            interval='preserveStart'
            domain={['dataMin', 'dataMax']}
            minTickGap={50} />
        </LineChart>
      </ResponsiveContainer>
    )
  }

  getDonationWordsChart () {
    if (!this.state.donationWords) {
      return this.getLoader()
    }
    const yAxisLabel = (
      <VerticalLabel
        axisType='yAxis'
        xOffset={0}
        yOffset={275}
        className='recharts-label'>
        Word
      </VerticalLabel>
    )
    return (
      <ResponsiveContainer width='100%' minHeight={800}>
        <BarChart
          margin={{top: 25, left: 50, bottom: 24, right: 24}}
          barSize={10}
          barCategoryGap={2}
          layout='vertical'
          data={this.state.donationWords}>
          <Tooltip />
          <CartesianGrid horizontal={false} />
          <XAxis label={'Number of Uses in Donation Comments'} orientation='top' type='number' />
          <YAxis label={yAxisLabel} interval={0} type='category' dataKey='word' />
          <Bar name='Uses' dataKey='entries' fill={PRIMARY_COLOR} />
        </BarChart>
      </ResponsiveContainer>
    )
  }

  getFrequentDonorsChart () {
    if (!this.state.topDonors) {
      return this.getLoader()
    }
    const yAxisLabel = (
      <VerticalLabel
        axisType='yAxis'
        xOffset={-30}
        yOffset={275}
        className='recharts-label'>
        Donor
      </VerticalLabel>
    )
    return (
      <ResponsiveContainer width='100%' height={800}>
        <BarChart
          margin={{top: 25, left: 60, bottom: 24, right: 24}}
          barSize={10}
          barCategoryGap={2}
          layout='vertical'
          data={this.state.topDonors.frequent}>
          <Tooltip />
          <CartesianGrid horizontal={false} />
          <XAxis label={'Most Frequent Donors'} orientation='top' type='number' />
          <YAxis
            tickFormatter={(t) => t.length < 11 ? t : (t.substring(0, 8) + '...')}
            label={yAxisLabel}
            interval={0}
            type='category'
            dataKey='name' />
          <Bar dataKey='count' name='Number of Donations' fill={PRIMARY_COLOR} />
        </BarChart>
      </ResponsiveContainer>
    )
  }

  getGenerousDonorsChart () {
    if (!this.state.topDonors) {
      return this.getLoader()
    }
    const yAxisLabel = (
      <VerticalLabel
        axisType='yAxis'
        xOffset={-30}
        yOffset={275}
        className='recharts-label'>
        Donor
      </VerticalLabel>
    )
    return (
      <ResponsiveContainer width='100%' height={800}>
        <BarChart
          margin={{top: 25, left: 60, bottom: 24, right: 24}}
          barSize={10}
          barCategoryGap={2}
          layout='vertical'
          data={this.state.topDonors.generous}>
          <Tooltip formatter={format('$,.2f')} />
          <CartesianGrid horizontal={false} />
          <XAxis
            label={'Most Generous Donors'}
            orientation='top'
            type='number'
            tickFormatter={format('$,.2f')} />
          <YAxis
            tickFormatter={(t) => t.length < 11 ? t : (t.substring(0, 8) + '...')}
            label={yAxisLabel}
            interval={0}
            type='category'
            dataKey='name' />
          <Bar name='Donation Total' dataKey='total' fill={PRIMARY_COLOR} />
        </BarChart>
      </ResponsiveContainer>
    )
  }

  render () {
    return (
      <div>
        <ReturnHome />
        <div className='section'>
          <h2>Donation Distribution Stats</h2>
          <Grid className='current_stats content'>{this.getDonationStatContainer()}</Grid>
        </div>
        <div className='section'>
          <h2>Donation Comment Stats</h2>
          <Grid>
            <Col md={6} xs={12}>{this.getCommentCountPieChart()}</Col>
            <Col md={6} xs={12}>{this.getCommentSumPieChart()}</Col>
          </Grid>
        </div>
        <div className='section'>
          <h2>Most Commonly Used Words in Donation Comments</h2>
          {this.getDonationWordsChart()}
        </div>
        <div className='section'>
          <h2>Most Frequent Donors</h2>
          {this.getFrequentDonorsChart()}
        </div>
        <div className='section'>
          <h2>Most Generous Donors</h2>
          {this.getGenerousDonorsChart()}
        </div>
        <div className='section'>
          <h2>Median Donation Over Time</h2>
          <Grid>
            <Col md={12} >{this.getMediansChart()}</Col>
          </Grid>
        </div>
      </div>
    )
  }
}

ReactDOM.render(
  <DonationsApp />,
  document.getElementById('react-root')
)
