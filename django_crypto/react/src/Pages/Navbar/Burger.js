import React, { Component } from 'react'
import { TimelineMax } from 'gsap'

class Burger extends Component {
  state = { tlX: new TimelineMax() }

  componentDidMount = () => {
    const { tlX } = this.state
    tlX.set(this.leftBurger, {transformOrigin:'center'})
    tlX.set(this.rightBurger, {transformOrigin:'center'})
    tlX.to(this.leftBurger, 0.25, {y:"16.67px"})
    tlX.to(this.rightBurger, 0.25, {y:"-16.67px"}, "-=0.25")
    tlX.to(this.leftBurger, 0.25, {rotation:"-45deg"})
    tlX.to(this.rightBurger, 0.25, {rotation:"45deg"}, "-=0.25")
    tlX.pause()
  }

  animateBurgerToX = () => {
    this.state.tlX.play()
  }

  animateBurgerToFlat = () => {
    this.state.tlX.reverse()
  }

  animateAndToggle = () => {
    const { active } = this.props
    this.props.toggle()
    if(!active) {
      this.animateBurgerToX()
    } else {
      this.animateBurgerToFlat()
    }
  }

  render() {
    return (
      <svg id="burger" className="hidden-768up" xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 125.56 53.33" onClick={ this.animateAndToggle }>
        <rect ref={x => this.leftBurger = x} width="125.56" height="16.67" rx="8.33" ry="8.33"/>
        <rect ref={x => this.rightBurger = x} y="36.67" width="125.56" height="16.67" rx="8.33" ry="8.33"/>
      </svg>
    )
  }
}

export default Burger