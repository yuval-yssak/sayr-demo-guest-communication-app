import React, { useContext, useEffect, useState } from 'react'
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

  useEffect(() => {
    if (data) setTimeout(store.view.openHomepage, 5000)
  }, [data, store.view.openHomepage])

  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        setQuery(store.mutateLogin({ email, password }))
        console.log(email, password)
      }}
    >
      <div>
        <input
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
