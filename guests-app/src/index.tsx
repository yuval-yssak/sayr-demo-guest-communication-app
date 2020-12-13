import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import { createHttpClient } from 'mst-gql'
import { RootStore, RootStoreType, StoreContext } from './models'
import { reaction, autorun } from 'mobx'
import { createRouter } from './models/view'
import { ErrorBoundary, FallbackProps } from 'react-error-boundary'

const gqlHttpClient = createHttpClient('http://localhost:4000/graphql', {
  credentials: 'include',
  mode: 'cors'
})
const rootStore = RootStore.create(undefined, {
  gqlHttpClient
})

;(window as any).store = rootStore

const FallBack: React.FC<FallbackProps> = ({ error }) => (
  <p>An Error occured here... {error?.message} </p>
)

function render() {
  ReactDOM.render(
    <React.StrictMode>
      <StoreContext.Provider value={rootStore}>
        <ErrorBoundary FallbackComponent={FallBack} onError={console.error}>
          <App />
        </ErrorBoundary>
      </StoreContext.Provider>
    </React.StrictMode>,
    document.getElementById('root')
  )
}

try {
  render()
} catch (e) {
  console.error(e)
  localStorage.clear()
  render()
}
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

// update authentication header for GraphQL whenever the access token updates.
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

// refresh token whenever it's 5 seconds away from being expired.
autorun(() => {
  if (
    !rootStore.loggedInUser?.isTokenValidWithMargin(5000) &&
    rootStore.loggedInUser?.isOnline
  )
    rootStore.loggedInUser?.refreshToken()
})

// synchronize login and logout on all tabs
// relying on the localStorageMixin to update the "loggedInUser"
window.addEventListener('storage', (e: StorageEvent) => {
  if (e.key === 'mst-gql-rootstore') {
    const storageOldValue: RootStoreType = JSON.parse(e.oldValue || '{}')
    const storageNewValue: RootStoreType = JSON.parse(e.newValue || '{}')

    if (
      (storageOldValue?.loggedInUser &&
        !storageNewValue?.loggedInUser &&
        rootStore.loggedInUser) ||
      (!storageOldValue?.loggedInUser &&
        storageNewValue?.loggedInUser &&
        !rootStore.loggedInUser)
    ) {
      rootStore.setLoggedInUser(storageNewValue.loggedInUser)
    }
  }
})
