import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { StoreContext, useQuery } from './models/reactUtils'
import Error from './components/Error'

const SimpleQuery = observer(function SimpleQuery() {
  const { data, loading, error } = useQuery(store => store.queryHello())
  return (
    <>
      {error && <Error error={error} />}
      {data?.hello}
      {loading && <p>Loading...</p>}
    </>
  )
})

const SomethingElse = () => <p>something else</p>

function renderPage(view: any) {
  console.log('rendering', view.page)
  switch (view.page) {
    case '/something-else':
      return <SomethingElse />
    case '/':
      return <SimpleQuery />
    default:
      return 'Sry, not found'
  }
}

function App() {
  const store = useContext(StoreContext)
  return <>{renderPage(store.view)}</>
}

export default observer(App)
