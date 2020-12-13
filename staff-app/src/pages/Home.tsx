import React from 'react'
import { observer } from 'mobx-react-lite'
import { useQuery } from '../models/reactUtils'
import Error from '../components/Error'

function Home() {
  const { data, error } = useQuery(store => store.queryUsers())
  return (
    <>
      <p>Home</p>
      {error && <Error error={error} />}
      {data && (
        <>
          <p>Users</p>
          {data.users.map(user => (
            <li key={user.id}>
              {user.id} {user.email}
            </li>
          ))}
        </>
      )}
    </>
  )
}

export default observer(Home)
