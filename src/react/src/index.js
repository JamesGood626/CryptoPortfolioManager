import React from 'react'
import ReactDOM from 'react-dom'
import registerServiceWorker from './registerServiceWorker'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import reduxThunk from 'redux-thunk'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { AUTHENTICATE_USER } from './actions/types'

import RequireAuth from './Utils/requireAuth'

import App from './App'
import 'normalize.css'
import './index.css'

import Register from './Pages/Register'
import Login from './Pages/Login'

import reducers from './reducers'

const store = createStore(reducers, {}, applyMiddleware(reduxThunk))

const token = localStorage.getItem('token')
if(token) {
  store.dispatch({ type: AUTHENTICATE_USER, payload: true })
}

ReactDOM.render(
  <Provider store={ store }>
    <BrowserRouter>
      <Switch>
        <Route path="/portfolio/:page" component={ RequireAuth(App) }/>
        <Route path="/register" component={ Register }/>
        <Route path="/login" component={ Login }/>
      </Switch>
    </BrowserRouter>
  </Provider>
, document.getElementById('root'))
registerServiceWorker()
