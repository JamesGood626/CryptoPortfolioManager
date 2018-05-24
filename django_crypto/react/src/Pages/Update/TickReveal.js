import React, { Component } from 'react'
import bodymovin from 'bodymovin'
import { TimelineMax } from 'gsap'
import tickRevealAnim from '../../Resources/tick_reveal.json'

class TickReveal extends Component {
  componentDidMount = () => {
    const animationWindow = this.tickReveal
    const animData = {
      wrapper: animationWindow,
      animType: 'svg',
      loop: true,
      prerender: true,
      autoplay: true,
      animationData: tickRevealAnim
    }

    const anim = bodymovin.loadAnimation(animData)
    anim.addEventListener('DOMLoaded', onDOMLoaded)
    anim.setSpeed(1)

    function onDOMLoaded(e){
      const tl = new TimelineMax({})
      tl.to({frame: 0}, 2, {
        frame: anim.totalFrames - 1,
        onUpdate: function() {
          anim.goToAndStop(Math.round(this.target.frame), true)
        },
        repeat: 1,
        yoyo: true
      })
    }
  }

  render() {
    return (
      <div className="tickRevealContainer">
        <div ref={x => this.tickReveal = x}/>
      </div>
    )
  }
}

export default TickReveal