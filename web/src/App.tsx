import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { StoreContext } from './models/reactUtils'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import Header from './components/Header'

function renderPage(view: any) {
  console.log('rendering', view.page)
  switch (view.page) {
    case '/':
      return <Home />
    case '/register':
      return <Register />
    case '/login':
      return <Login />
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
