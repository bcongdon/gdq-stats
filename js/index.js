import ReactDOM from 'react-dom'
import React from 'react'
import App from './App.js'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import reducers from './reducers'
import reduxThunk from 'redux-thunk'
import 'react-select/dist/react-select.css'
import { setCurrentSeries, setButtonZoom, setGameZoom } from './actions'
import { gameForId } from './utils'

const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore)
const store = createStoreWithMiddleware(reducers)

const urlParams = new URLSearchParams(window.location.search)
if (urlParams.get('series')) {
  setCurrentSeries(parseInt(urlParams.get('series')))(store.dispatch)
}
if (urlParams.get('zoom')) {
  setButtonZoom(parseInt(urlParams.get('zoom')))(store.dispatch)
} else if (urlParams.get('game')) {
  setGameZoom(parseInt(urlParams.get('game')))(store.dispatch)
}

store.subscribe(() => {
  const state = store.getState()
  const urlParams = new URLSearchParams(window.location.search)
  urlParams.set('series', state.gdq.series)
  if (state.gdq.activeButtonZoomIndex >= 0) {
    urlParams.set('zoom', state.gdq.activeButtonZoomIndex)
  } else {
    urlParams.delete('zoom')
  }
  if(state.gdq.activeGameZoom) {
    urlParams.set('game', state.gdq.activeGameZoom) 
  } else if(state.gdq.scheduleLoaded) {
    urlParams.delete('game')
  }
  history.replaceState('', '', '?' + urlParams.toString())
})

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('react-root')
)
