import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { Route, Switch  } from 'react-router-dom'

import { TransitionGroup, Transition } from 'react-transition-group'
import { TweenMax } from 'gsap'
import styled from 'styled-components'

import RequireAuth from './Utils/requireAuth'
import PieChart from './SharedComponents/D3Components/PieChart'

import Navbar from './Pages/Navbar'
import CurrencyDropDown from './SharedComponents/FormComponents/currencyDropDown'
import PortfolioPerformance from './Pages/PortfolioPerformance'
import Update from './Pages/Update'
import Transactions from './Pages/Transactions'
import Account from './Pages/Account'
import Settings from './Pages/Settings'
import LogOut from './Pages/LogOut'

import PerformanceIcon from './SVGIcons/PerformanceIcon'
import UpdateIcon from './SVGIcons/UpdateIcon'
import TransactionsIcon from './SVGIcons/TransactionsIcon'
import AccountIcon from './SVGIcons/AccountIcon'
import SettingsIcon from './SVGIcons/SettingsIcon'
import LogOutIcon from './SVGIcons/LogOutIcon'


const Section = styled.section`
  position: relative;
  height: 100vh;
  width: 100vw;
  padding-bottom: 2rem;
  margin: 0;
  padding: 0;
  

  // @media (min-width: 600px) {
  //   background-color: limegreen;
  // }
  
  @media (min-width: 900px) {
    // compensates for navbar width
    max-width: calc(100vw - 16rem);
  }
`

const Div = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: none;

  @media (max-width: 900px) {
    flex-direction: column;
  }
`


// Okay, so this.props.history.length is a reliable source for determining the
// size of the routing stack
// As well as this.props.history.action giving PUSH or POP on each page navigation
// Either of those could feasibly be used for manipulating the transition animation
// On second consideration, length isn't declining on each POP action, so perhaps just make use 
// of action to determine whether navigation is forwards or backwards
class App extends Component {
  constructor(props) {
    super(props)
    console.log("App's props")
    console.log(this.props.location)
    this.enterTransition = this.enterTransition.bind(this)
    this.leaveTransition = this.leaveTransition.bind(this)
  }

  // action ftw, successfully manages forward and backward routing navigation animations.
  enterTransition(node) {
    let { action } = this.props.history
    console.log(node)

    if (action === 'PUSH') {
      TweenMax.fromTo(node, 0.5, {x: -100, opacity: 0}, {x: 0, opacity: 1})
    }
    else {
      TweenMax.fromTo(node, 0.5, {x: 100, opacity: 0}, {x: 0, opacity: 1})
    }
  }

  leaveTransition(node) {
    let { action } = this.props.history

    if (action === 'PUSH') {
      TweenMax.fromTo(node, .3, {x: 0, opacity: 1}, {x: 100, opacity: 0})
    }
    else {
      TweenMax.fromTo(node, .3, {x: 0, opacity: 1}, {x: -100, opacity: 0})
    }
  }


  // The { ...route } object spread is an interesting use case
  // Slightly resembles the example in react-router's docs for Route's render prop
  // Annnd as of right now, wrapping Switch in a transition group doesn't trigger
  // componentWillAppear at all for the routes
  // The github example is making use of CSSTransitionGroup
  render() {
    // More than likely going to have to move this to redux store to keep track of active link
    // Or handle this by using App component's state.
    let { location } = this.props
    const navItems = [
                        { name: 'Performance', icon: PerformanceIcon, path: '/portfolio/performance' },
                        { name: 'Update', icon: UpdateIcon, path: '/portfolio/update' },
                        { name: 'Transactions', icon: TransactionsIcon, path: '/portfolio/transactions' },
                        { name: 'Account', icon: AccountIcon, path: '/portfolio/account' },
                        { name: 'Settings', icon: SettingsIcon, path: '/portfolio/settings' },
                        { name: 'Log Out', icon: LogOutIcon, path: '/portfolio/log-out' },
                      ]
    return (
      <Div>
        <Navbar location={ location } menuItems={ navItems }/>
        {/* <CurrencyDropDown/> */}
        <TransitionGroup>
          <Transition
            in={ this.props.in }
            key={ location.pathname }
            timeout={ 500 }
            mountOnEnter={ true }
            unountOnExit={ true } 
            onEnter={ this.enterTransition }
            onExit={ this.leaveTransition }  
          >
            <Section>
              <Switch location={ location }>
                <Route exact path="/portfolio/performance" component={ PortfolioPerformance }/>
                <Route exact path="/portfolio/update" component={ Update }/>
                <Route exact path="/portfolio/transactions" component={ Transactions }/>
                <Route exact path="/portfolio/account" component={ Account }/>
                <Route exact path="/portfolio/settings" component={ Settings }/>
                <Route exact path="/portfolio/log-out" component={ LogOut }/>
              </Switch>
            </Section> 
          </Transition>
        </TransitionGroup> 
      </Div> 
    )
  }
}

export default withRouter(App)