import React from 'react'
import { observer } from 'mobx-react-lite'
import { useQuery } from './models/reactUtils'
import Error from './components/Error'

function App() {
  const { data, loading, error } = useQuery(store => store.queryHello())
  return (
    <>
      {error && <Error error={error} />}
      {loading && <p>Loading...</p>}
      {data?.hello}
    </>
  )
}

export default observer(App)
