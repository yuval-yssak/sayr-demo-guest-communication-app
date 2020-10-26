import React, { useContext } from 'react'
import { StoreContext } from '../models/reactUtils'

interface Props {}

const Header: React.FC<Props> = () => {
  const store = useContext(StoreContext)

  return (
    <>
      <button onClick={() => store.view.openHomepage()}>Home</button>
      <button onClick={() => store.view.openLoginPage()}>Login</button>
      <button onClick={() => store.view.openRegisterPage()}>Register</button>
    </>
  )
}

export default Header
