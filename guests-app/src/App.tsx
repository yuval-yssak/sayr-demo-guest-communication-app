import React from 'react'
import { observer } from 'mobx-react-lite'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import { IView } from './models/View'
import Announcements from './pages/Announcements'
import CssBaseline from '@material-ui/core/CssBaseline'
import { useMst } from './models/reactHook'
import styled from 'styled-components'

const StyledRoot = styled.div`
  text-align: center;
  background-image: url('./media/Yoga-Class-Beach-Platform-Sivananda-Bahamas.jpg');
  background-repeat: no-repeat;
  height: 100vh;
  padding-top: 10px;
`

const StyledApp = styled.div`
  height: 100%;
  width: 100%;
`

function renderPage(view: IView) {
  switch (view.page) {
    case '/':
      return <Home />
    case '/register':
      return <Register />
    case '/login':
      return <Login />
    case '/announcements':
      return <Announcements />
    default:
      return 'Sorry, not found'
  }
}

function App() {
  const store = useMst()
  return (
    <>
      <CssBaseline />
      <StyledRoot>
        <StyledApp>{renderPage(store.view)}</StyledApp>
      </StyledRoot>
    </>
  )
}

export default observer(App)
