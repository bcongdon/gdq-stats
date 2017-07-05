import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import moment from 'moment'
import axios from 'axios'
import { GDQ_API_ENDPOINT, GDQ_STORAGE_ENDPOINT, PRIMARY_COLOR } from './constants'
import { BarChart, Bar, Tooltip, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Text } from 'recharts'
import PacmanLoader from 'halogen/PacmanLoader'
import VerticalLabel from './components/VerticalLabel'

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

  getLoader() {
    return <PacmanLoader color={PRIMARY_COLOR} className='graph-loader'/>
  }

  getUserGraph() {
    if(!this.state.chatUsers) {
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
          <Tooltip labelFormater={() => "foo"}formatter={(val) => `${val} messages sent`}/>
          <CartesianGrid style={{strokeWidth: 0.25}}/>
          <XAxis label='Number of Messages Sent' orientation='top' type="number"/>
          <YAxis label={yAxisLabel} className="chat-y-axis" interval={0} type="category" dataKey="user" />
          <Bar dataKey="count" fill={PRIMARY_COLOR} />
        </BarChart>
      </ResponsiveContainer>
    )
  }

  getWordGraph() {
    if(!this.state.chatWords) {
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
          <Tooltip formatter={(val) => `${val} uses`}/>
          <CartesianGrid style={{strokeWidth: 0.25}}/>
          <XAxis label={'Number of Uses in Chat'} orientation='top' type="number"/>
          <YAxis label={yAxisLabel} interval={0} type="category" dataKey="word" />
          <Bar dataKey="count" fill={PRIMARY_COLOR} />
        </BarChart>
      </ResponsiveContainer>
    )
  }

  render () {
    return (
      <div>
        <h3><a style={{border: '1.5px solid #ccc', padding: 5, backgroundColor: '#ddd'}} href='/'>Return Home</a></h3>
        <div className="section">
          <h2>Most Active Chat Users</h2>
          {this.getUserGraph()}
        </div>

        <div className="section">
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

