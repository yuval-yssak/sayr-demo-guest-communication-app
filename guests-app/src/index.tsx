import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import { createHttpClient } from 'mst-gql'
import { RootStore, StoreContext } from './models'
import { ErrorBoundary, FallbackProps } from 'react-error-boundary'
import onStart from './onStart'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'

serviceWorkerRegistration.register()

const gqlHttpClient = createHttpClient('http://localhost:4000/graphql', {
  credentials: 'include',
  mode: 'cors'
})

console.log('1')
const rootStore = RootStore.create(undefined, {
  gqlHttpClient
})

;(window as any).store = rootStore

onStart(rootStore, gqlHttpClient)

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
