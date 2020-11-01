import React, { useContext, useState } from 'react'
import { StoreContext, useQuery } from '../models/reactUtils'
import Error from '../components/Error'
import { observer } from 'mobx-react-lite'

function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { data, loading, error, setQuery } = useQuery(undefined, {
    fetchPolicy: 'no-cache' // not working for mutations :(
  })

  const store = useContext(StoreContext)

  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        setQuery(store.mutateRegister({ email, password }))
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
      {data && (
        <>
          <p>Registered... {JSON.stringify(data)}</p>
          <p>Check your email to verify the registration.</p>
        </>
      )}
    </form>
  )
}

export default observer(Register)
