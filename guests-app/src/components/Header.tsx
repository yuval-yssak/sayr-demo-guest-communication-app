import React, { useContext } from 'react'
import { StoreContext } from '../models/reactUtils'
import { observer } from 'mobx-react-lite'

interface Props {}

const Header: React.FC<Props> = () => {
  const store = useContext(StoreContext)

  return (
    <>
      <header>
        <button onClick={() => store.view.openHomePage()}>Home</button>
        <button onClick={() => store.view.openLoginPage()}>
          {store.loggedInUser ? 'Logout' : 'Login'}
        </button>
        {/* {!store.loggedInUser && (
          <button onClick={() => store.view.openRegisterPage()}>
            Register
          </button>
        )} */}
        {store.loggedInUser && (
          <>
            <button onClick={() => store.view.openAnnouncementsPage()}>
              Announcements
            </button>
          </>
        )}
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
