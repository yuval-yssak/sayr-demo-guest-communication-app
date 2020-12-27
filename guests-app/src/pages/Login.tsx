import React, { useContext, useState } from 'react'
import { useQuery, StoreContext } from '../models'
import Error from '../components/Error'
import { observer } from 'mobx-react-lite'
import GoogleLogin from '../components/GoogleLogin'
import SignInSide from './SignInSide'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'

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
      <>
        <Grid>
          <GoogleLogin onClick={() => store.loginWithGoogle()} />
          <div style={{ marginTop: '1em', marginBottom: '1em' }}> - or -</div>
        </Grid>
        <SignInSide />
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
      </>
    )
}

export default observer(Login)
