import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { StoreContext } from './models/reactUtils'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import Header from './components/Header'
import Secret from './pages/Secret'
import Guests from './pages/Guests'
import { IView } from './models/View'
import Announcements from './pages/Announcements'

function renderPage(view: IView) {
  switch (view.page) {
    case '/':
      return <Home />
    case '/register':
      return <Register />
    case '/login':
      return <Login />
    case '/secret':
      return <Secret />
    case '/guests':
      return <Guests />
    case '/announcements':
      return <Announcements />
    default:
      return 'Sorry, not found'
  }
}

function App() {
  const store = useContext(StoreContext)
  return (
    <>
      <Header />
      {renderPage(store.view)}
    </>
  )
}

export default observer(App)
