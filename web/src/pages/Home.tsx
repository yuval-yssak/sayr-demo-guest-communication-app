import React from 'react'
import { useQuery } from '../models/reactUtils'
import { observer } from 'mobx-react-lite'
function Home() {
  const { data } = useQuery(store => store.queryUsers())
  return (
    <>
      <p>Home</p>
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
