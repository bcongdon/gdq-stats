import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import { GDQ_STORAGE_ENDPOINT,
  PRIMARY_COLOR } from './constants'
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
import { format } from 'd3-format'

class GamesApp extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {}
  }

  componentWillMount () {
    axios.get(GDQ_STORAGE_ENDPOINT + '/games_stats.json')
      .then((response) => this.setState({ gameStats: response.data }))
  }

  getLoader () {
    return <PacmanLoader color={PRIMARY_COLOR} className='gdq-loader' />
  }

  getGameDonationsChart () {
    if (!this.state.gameStats) {
      return this.getLoader()
    }
    const yAxisLabel = (
      <VerticalLabel
        axisType='yAxis'
        xOffset={-30}
        yOffset={275}
        className='recharts-label'>
        Game
      </VerticalLabel>
    )

    const sorted = this.state.gameStats.slice(0)
    sorted.sort((a, b) => b.total_donations - a.total_donations)

    return (
      <ResponsiveContainer height={900}>
        <BarChart
          margin={{top: 25, left: 60, bottom: 24, right: 24}}
          barSize={10}
          barCategoryGap={2}
          layout='vertical'
          data={sorted.slice(0, 75)}>
          <Tooltip formatter={format('$,.2f')} />
          <CartesianGrid horizontal={false} />
          <XAxis
            label={'Donations Raised'}
            orientation='top'
            type='number'
            tickFormatter={format('$,.2f')} />
          <YAxis
            tickFormatter={(t) => t.length < 22 ? t : (t.substring(0, 19) + '...')}
            label={yAxisLabel}
            interval={0}
            width={120}
            type='category'
            dataKey='name' />
          <Bar name='Donation Total' dataKey='total_donations' fill={PRIMARY_COLOR} />
        </BarChart>
      </ResponsiveContainer>
    )
  }

  getDonationsPerMinuteChart () {
    if (!this.state.gameStats) {
      return this.getLoader()
    }
    const yAxisLabel = (
      <VerticalLabel
        axisType='yAxis'
        xOffset={-30}
        yOffset={275}
        className='recharts-label'>
        Game
      </VerticalLabel>
    )

    const sorted = this.state.gameStats.slice(0)
    sorted.sort((a, b) => b.donations_per_min - a.donations_per_min)

    return (
      <ResponsiveContainer height={900}>
        <BarChart
          margin={{top: 25, left: 60, bottom: 24, right: 24}}
          barSize={10}
          barCategoryGap={2}
          layout='vertical'
          data={sorted.slice(0, 75)}>
          <Tooltip formatter={format('$,.2f')} />
          <CartesianGrid horizontal={false} />
          <XAxis
            label={'Average Donations Per Minute'}
            orientation='top'
            type='number'
            tickFormatter={format('$,.2f')} />
          <YAxis
            tickFormatter={(t) => t.length < 22 ? t : (t.substring(0, 19) + '...')}
            label={yAxisLabel}
            interval={0}
            width={120}
            type='category'
            dataKey='name' />
          <Bar name='Donations per Minute' dataKey='donations_per_min' fill={PRIMARY_COLOR} />
        </BarChart>
      </ResponsiveContainer>
    )
  }

  getDonationsMedian () {
    if (!this.state.gameStats) {
      return this.getLoader()
    }
    const yAxisLabel = (
      <VerticalLabel
        axisType='yAxis'
        xOffset={-30}
        yOffset={275}
        className='recharts-label'>
        Game
      </VerticalLabel>
    )

    const sorted = this.state.gameStats.slice(0)
    sorted.sort((a, b) => b.median_donation - a.median_donation)

    return (
      <ResponsiveContainer height={900}>
        <BarChart
          margin={{top: 25, left: 60, bottom: 24, right: 24}}
          barSize={10}
          barCategoryGap={2}
          layout='vertical'
          data={sorted.slice(0, 75)}>
          <Tooltip formatter={format('$,.2f')} />
          <CartesianGrid horizontal={false} />
          <XAxis
            label={'Median Donation During Run'}
            orientation='top'
            type='number'
            tickFormatter={format('$,.2f')} />
          <YAxis
            tickFormatter={(t) => t.length < 22 ? t : (t.substring(0, 19) + '...')}
            label={yAxisLabel}
            interval={0}
            width={120}
            type='category'
            dataKey='name' />
          <Bar name='Median Donation Amount' dataKey='median_donation' fill={PRIMARY_COLOR} />
        </BarChart>
      </ResponsiveContainer>
    )
  }

  getViewersChart () {
    if (!this.state.gameStats) {
      return this.getLoader()
    }
    const yAxisLabel = (
      <VerticalLabel
        axisType='yAxis'
        xOffset={-30}
        yOffset={275}
        className='recharts-label'>
        Game
      </VerticalLabel>
    )

    const sorted = this.state.gameStats.slice(0)
    sorted.sort((a, b) => b.max_viewers - a.max_viewers)

    return (
      <ResponsiveContainer height={900}>
        <BarChart
          margin={{top: 25, left: 60, bottom: 24, right: 24}}
          barSize={10}
          barCategoryGap={2}
          layout='vertical'
          data={sorted.slice(0, 75)}>
          <Tooltip formatter={format(',')} />
          <CartesianGrid horizontal={false} />
          <XAxis
            label={'Maximum Viewers During Game'}
            orientation='top'
            type='number'
            tickFormatter={format(',')} />
          <YAxis
            tickFormatter={(t) => t.length < 22 ? t : (t.substring(0, 19) + '...')}
            label={yAxisLabel}
            interval={0}
            width={120}
            type='category'
            dataKey='name' />
          <Bar name='Maximum Viewers' dataKey='max_viewers' fill={PRIMARY_COLOR} />
        </BarChart>
      </ResponsiveContainer>
    )
  }

  render () {
    return (
      <div>
        <ReturnHome />
        <div className='section'>
          <h2>Top Games by Total Donations</h2>
          {this.getGameDonationsChart()}
        </div>
        <div className='section'>
          <h2>Top Games by Donations per Minute</h2>
          {this.getDonationsPerMinuteChart()}
        </div>
        <div className='section'>
          <h2>Top Games by Median Donation During Run</h2>
          {this.getDonationsMedian()}
        </div>
        <div className='section'>
          <h2>Top Games by Maximum Viewership</h2>
          {this.getViewersChart()}
        </div>
      </div>
    )
  }
}

ReactDOM.render(
  <GamesApp />,
  document.getElementById('react-root')
)
