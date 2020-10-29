import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import { createHttpClient } from 'mst-gql'
import { RootStore, StoreContext } from './models'
import { reaction } from 'mobx'
import { createRouter } from './models/view'

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
  }
)

const router = createRouter(rootStore.view)

window.onpopstate = function historyChange(ev: PopStateEvent) {
  if (ev.type === 'popstate') router(window.location.pathname)
}

router(window.location.pathname)

reaction(
  () => rootStore.view.page,
  page => console.log(page)
)

reaction(
  () => rootStore.loggedInUser?.isTokenValidWithMargin(5000),
  () => {
    if (!rootStore.loggedInUser?.isTokenValidWithMargin(5000))
      rootStore.loggedInUser?.refreshToken()
  }
)
