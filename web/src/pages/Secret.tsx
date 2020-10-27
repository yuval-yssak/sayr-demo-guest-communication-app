import React from 'react'
import { observer } from 'mobx-react-lite'
import { useQuery } from '../models/reactUtils'
import Error from '../components/Error'

function Secret() {
  const { error, loading, data } = useQuery(store =>
    store.queryTellASecret({}, { fetchPolicy: 'network-only' })
  )

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
