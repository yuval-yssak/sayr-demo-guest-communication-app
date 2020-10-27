import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import { createHttpClient } from 'mst-gql'
import { RootStore, StoreContext } from './models'
import { reaction, when } from 'mobx'
import { routeMap, createRouter } from './models/view'

const gqlHttpClient = createHttpClient('http://localhost:4000/graphql', {
  credentials: 'include',
  mode: 'cors'
})
const rootStore = RootStore.create(undefined, {
  gqlHttpClient
})

;(window as any).store = rootStore

ReactDOM.render(
  <React.StrictMode>
    <StoreContext.Provider value={rootStore}>
      <App />
    </StoreContext.Provider>
  </React.StrictMode>,
  document.getElementById('root')
)

/**
 * Routing
 */

reaction(
  () => rootStore.view.currentURL,
  path => {
    if (window.location.pathname !== path)
      window.history.pushState(null, '', path)
  }
)

reaction(
  () => rootStore.loggedInUser?.accessToken,
  accessToken => {
    gqlHttpClient.setHeaders({
      authentication: accessToken ? `bearer ${accessToken}` : ''
    })
    if (accessToken) rootStore.view.openHomepage()
  }
)

const router = createRouter(routeMap(rootStore.view))

window.onpopstate = function historyChange(ev: PopStateEvent) {
  if (ev.type === 'popstate') router(window.location.pathname)
}

router(window.location.pathname)

when(
  () => !!rootStore.loggedInUser,
  () => {
    // runs once after full page refresh, once the logged in user is retreived from local storage
    if (rootStore.loggedInUser)
      fetch('http://localhost:4000/refresh-token', {
        method: 'POST',
        credentials: 'include'
      })
        .then(response => response.json())
        .then(json => rootStore.loggedInUser?.setAccessToken(json.accessToken))
  }
)
