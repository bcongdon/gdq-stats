import { format } from 'd3-format'

const fullNumber = format(',.0f')
const fullNumberCurrency = format('$,.0f')

const GRAPHS = [
  {
    name: 'Viewers',
    key: 'v',
    format: fullNumber
  },
  {
    name: 'Donations',
    key: 'm',
    format: format('$,.2s'),
    tooltipFormat: fullNumberCurrency
  },
  {
    name: 'Donations per minute',
    key: 'm_drv',
    format: fullNumberCurrency
  },
  {
    name: 'Donors',
    key: 'd',
    format: fullNumber
  },
  {
    name: 'Tweets',
    key: 't_acc',
    format: format(',.2s'),
    tooltipFormat: fullNumber
  },
  {
    name: 'Tweets per minute',
    key: 't',
    format: fullNumber
  },
  {
    name: 'Twitch Chats',
    key: 'c_acc',
    format: format(',.2s'),
    tooltipFormat: fullNumber
  },
  {
    name: 'Twitch Chats per minute',
    key: 'c',
    format: fullNumber
  },
  {
    name: 'Twitch Emotes',
    key: 'e_acc',
    format: format(',.2s'),
    tooltipFormat: fullNumber
  },
  {
    name: 'Twitch Emotes per minute',
    key: 'e',
    format: fullNumber
  }
]

export default GRAPHS
