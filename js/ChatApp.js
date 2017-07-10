import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import { GDQ_STORAGE_ENDPOINT, PRIMARY_COLOR } from './constants'
import { BarChart, Bar, Tooltip, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from 'recharts'
import PacmanLoader from 'halogen/PacmanLoader'
import VerticalLabel from './components/VerticalLabel'
import ReturnHome from './components/ReturnHome'

const GRAPH_MARGINS = {top: 25, left: 100, bottom: 24, right: 24}

class ChatApp extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {}
  }

  componentWillMount () {
    // Fetch chat users
    axios.get(GDQ_STORAGE_ENDPOINT + '/chat_users.json')
      .then((response) => this.setState({ chatUsers: response.data }))

    // Fetch chat words
    axios.get(GDQ_STORAGE_ENDPOINT + '/chat_words.json')
      .then((response) => this.setState({ chatWords: response.data }))
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

  getWordGraph () {
    if (!this.state.chatWords) {
      return this.getLoader()
    }
    const yAxisLabel = (
      <VerticalLabel
        axisType='yAxis'
        xOffset={-40}
        yOffset={275}
        className='recharts-label'>
        Word
      </VerticalLabel>
    )
    return (
      <ResponsiveContainer width='100%' minHeight={600}>
        <BarChart margin={GRAPH_MARGINS} barGap={150} layout='vertical' data={this.state.chatWords}>
          <Tooltip formatter={(val) => `${val} uses`} />
          <CartesianGrid horizontal={false} />
          <XAxis label={'Number of Uses in Chat'} orientation='top' type='number' />
          <YAxis label={yAxisLabel} interval={0} type='category' dataKey='word' />
          <Bar dataKey='count' fill={PRIMARY_COLOR} />
        </BarChart>
      </ResponsiveContainer>
    )
  }

  render () {
    return (
      <div>
        <ReturnHome />
        <div className='section'>
          <h2>Most Active Chat Users</h2>
          {this.getUserGraph()}
        </div>

        <div className='section'>
          <h2>Most Used "Words" in Chat</h2>
          {this.getWordGraph()}
        </div>
      </div>
    )
  }
}

ReactDOM.render(
  <ChatApp />,
  document.getElementById('react-root')
)
