import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { StoreContext } from './models/reactUtils'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import Header from './components/Header'
import Secret from './pages/Secret'

function renderPage(view: any) {
  switch (view.page) {
    case '/':
      return <Home />
    case '/register':
      return <Register />
    case '/login':
      return <Login />
    case '/secret':
      return <Secret />
    default:
      return 'Sry, not found'
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
