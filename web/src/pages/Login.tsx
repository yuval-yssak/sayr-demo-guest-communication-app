import React, { useContext, useState } from 'react'
import { useQuery, StoreContext } from '../models'
import Error from '../components/Error'
import { observer } from 'mobx-react-lite'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { data, loading, error, setQuery } = useQuery(undefined, {
    fetchPolicy: 'no-cache' // not working for mutations :(
  })

  const store = useContext(StoreContext)

  if (store.loggedInUser)
    return (
      <div>
        <button onClick={() => store.logout()}>Log Out</button>
      </div>
    )
  else
    return (
      <form
        onSubmit={e => {
          e.preventDefault()
          setQuery(store.login({ email, password }))
        }}
      >
        <div>
          <input
            autoFocus
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="email"
          ></input>
        </div>
        <div>
          <input
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="password"
            type="password"
          ></input>
        </div>
        <button type="submit">Login</button>
        {loading && <p>Trying to log in again...</p>}
        {error && <Error error={error} />}
        {data && 'Logged in... ' + JSON.stringify(data)}
      </form>
    )
}

export default observer(Login)
