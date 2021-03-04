import React, { useContext } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
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
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      {console.log(process.env.PUBLIC_URL)}
      <Switch>
        <Route render={props => <AppRouter {...props} />} />
      </Switch>
    </BrowserRouter>
  )
}

export default App
