import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { StoreContext } from './models/reactUtils'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import Header from './components/Header'
import { IView } from './models/View'
import Announcements from './pages/Announcements'
import CssBaseline from '@material-ui/core/CssBaseline'
import { useMst } from './models/reactHook'

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
      {renderPage(store.view)}
    </>
  )
}

export default observer(App)
