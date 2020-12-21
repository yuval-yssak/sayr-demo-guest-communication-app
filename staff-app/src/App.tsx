import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { StoreContext } from './models/reactUtils'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import Header from './components/Header'
import Guests from './pages/Guests'
import { IView } from './models/View'
import Announcements from './pages/Announcements'
import Activities from './pages/Activities'
import Activitiy from './pages/Activitiy'

function renderPage(view: IView) {
  switch (view.page) {
    case '/':
      return <Home />
    case '/register':
      return <Register />
    case '/login':
      return <Login />
    case '/guests':
      return <Guests />
    case '/announcements':
      return <Announcements />
    case '/activities':
      return <Activities />
    case '/activityDay':
      return <Activities />
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
