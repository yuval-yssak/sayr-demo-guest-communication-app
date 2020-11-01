import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { useQuery } from '../models/reactUtils'
import Error from '../components/Error'
import { StoreContext } from '../models/reactUtils'

function Secret() {
  const store = useContext(StoreContext)
  const { error, loading, data } = useQuery(store =>
    store.queryTellASecret({}, { fetchPolicy: 'network-only' })
  )

  if (!store.loggedInUser) return <p>Cannot show secret while not logged in</p>
  return (
    <>
      <p>the secret...</p>
      {error && <Error error={error} />}
      {loading && <p>Loading...</p>}
      {data && <p>{data.tellASecret}</p>}
    </>
  )
}

export default observer(Secret)
