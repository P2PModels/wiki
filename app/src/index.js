import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import { AragonApi } from '@aragon/api-react'
import App from './App'
import './i18n'

const reducer = state => {
  if (state === null) {
    return { pages: { Welcome: {} }, history: {}, syncing: true }
  }
  return state
}

ReactDOM.render(
  <Suspense fallback="">
    <AragonApi reducer={reducer}>
      <App />
    </AragonApi>
  </Suspense>,
  document.getElementById('root')
)
