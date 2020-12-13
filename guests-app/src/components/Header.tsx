import React, { useContext } from 'react'
import { StoreContext } from '../models/reactUtils'
import { observer } from 'mobx-react-lite'

interface Props {}

const Header: React.FC<Props> = () => {
  const store = useContext(StoreContext)

  return (
    <>
      <header>
        <button onClick={() => store.view.openHomepage()}>Home</button>
        <button onClick={() => store.view.openLoginPage()}>
          {store.loggedInUser ? 'Logout' : 'Login'}
        </button>
        <button onClick={() => store.view.openRegisterPage()}>Register</button>
        <button onClick={() => store.view.openSecretPage()}>Secret</button>
      </header>
      <div>
        {store.loggedInUser ? (
          <p>You are logged in as: {store.loggedInUser?.email}</p>
        ) : (
          <p>Not logged in</p>
        )}
      </div>
    </>
  )
}

export default observer(Header)
