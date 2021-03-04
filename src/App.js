import React, { useContext } from 'react'
import { Router, Switch, Route } from 'react-router-dom'
import './index.css'
import { createBrowserHistory } from 'history'
import AppRouter from './Router'
import Login from './pages/login/Login'
import { Context } from './context'

const history = createBrowserHistory()

function App() {
  const [{ auth }] = useContext(Context)

  if (!auth.token) {
    history.push('/')
    return <Login />
  }

  return (
    <Router basename={process.env.PUBLIC_URL} history={history}>
      <Switch>
        <Route render={props => <AppRouter {...props} />} />
      </Switch>
    </Router>
  )
}

export default App
