import ReactDOM from 'react-dom'
import React from 'react'
import GraphApp from './GraphApp.js'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import reducers from './reducers'
import reduxThunk from 'redux-thunk'
import 'react-select/dist/react-select.css'

const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore)
const store = createStoreWithMiddleware(reducers)

ReactDOM.render(
  <Provider store={store}>
    <GraphApp />
  </Provider>,
  document.getElementById('react-root')
)
