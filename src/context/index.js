import React, { useReducer, useMemo } from 'react'
import reducer from './reducer'
import initialState from './state'
import src from './cacheApp'
import { useStore } from './getters/useStore'

if (initialState.auth.token === null && src.sessionApp()) initialState.auth = src.sessionApp()

const Context = React.createContext(initialState)

const ContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const store = useMemo(() => [state, dispatch], [state])

  return <Context.Provider value={store}>{children}</Context.Provider>
}

export { Context, ContextProvider, useStore }
