import ReactDOM from 'react-dom'
import React from 'react'
import App from './App.js'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import reducers from './reducers'
import reduxThunk from 'redux-thunk'
import 'react-select/dist/react-select.css'
import { setCurrentSeries, setButtonZoom } from './actions'

const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore)
const store = createStoreWithMiddleware(reducers)

store.subscribe(() => {
  const state = store.getState()
  const urlParams = new URLSearchParams(window.location.search)
  urlParams.set('series', state.gdq.series)
  if (state.gdq.activeButtonZoomIndex >= 0) {
    urlParams.set('zoom', state.gdq.activeButtonZoomIndex)
  } else {
    urlParams.delete('zoom')
  }
  // if(state.gdq.activeGameZoom) {
  //   urlParams.set('game', state.gdq.activeGameZoom.name)
  // }
  history.replaceState('', '', '?' + urlParams.toString())
})

const urlParams = new URLSearchParams(window.location.search)
if (urlParams.has('series')) {
  setCurrentSeries(parseInt(urlParams.get('series')))(store.dispatch)
}
if (urlParams.has('zoom')) {
  setButtonZoom(parseInt(urlParams.get('zoom')))(store.dispatch)
}
if (urlParams.has('game')) {

}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('react-root')
)
