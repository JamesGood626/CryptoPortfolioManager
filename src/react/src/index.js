import React from 'react'
import ReactDOM from 'react-dom'
import registerServiceWorker from './registerServiceWorker'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import reduxThunk from 'redux-thunk'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import App from './App'
import 'normalize.css'
import './index.css'

import Register from './Pages/Register'
import Login from './Pages/Login'

import reducers from './reducers'

const store = createStore(reducers, {}, applyMiddleware(reduxThunk))


ReactDOM.render(
  <Provider store={ store }>
    <BrowserRouter>
      <Switch>
        <Route path="/portfolio/:page" component={ App }/>
        <Route path="/register" component={ Register }/>
        <Route path="/login" component={ Login }/>
      </Switch>
    </BrowserRouter>
  </Provider>
, document.getElementById('root'))
registerServiceWorker()
