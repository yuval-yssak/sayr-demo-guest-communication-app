import React, { useContext, useEffect, useState } from 'react'
import { StoreContext, useQuery } from '../models/reactUtils'
import Error from '../components/Error'
import { observer } from 'mobx-react-lite'

function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { data, loading, error, setQuery } = useQuery()

  const store = useContext(StoreContext)

  useEffect(() => {
    console.log(data, loading, error)
  }, [data, loading, error])

  useEffect(() => {
    if (data) setTimeout(store.view.openHomepage, 1000)
  }, [data])

  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        setQuery(store.mutateRegister({ email, password }))
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
      <button type="submit">Register</button>
      {loading && <p>Registering...</p>}
      {error && <Error error={error} />}
      {data && 'Registered... ' && JSON.stringify(data)}
    </form>
  )
}

export default observer(Register)
