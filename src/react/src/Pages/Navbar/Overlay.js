import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'

const Span = styled.span`
  position: relative;
  top: 2rem;
  left: 2rem;
  font-size: 1rem;
  color: #371732;
`

const OverlayDiv = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  background-color: #fcfafa;
  overflow: hidden;

  @media (min-width: 900px) {
    display: none;
  }
`

class Overlay extends Component {
  constructor(props) {
    super(props)
    this.overlayContainer = document.createElement('div')
    document.body.appendChild(this.overlayContainer)
  }

  componentWillUnmount() {
    document.body.removeChild(this.overlayContainer)
  }

  render() {
    return ReactDOM.createPortal(
      <OverlayDiv className="overlay">
        <Span onClick={this.props.onClose}>X</Span>
        {this.props.children}
      </OverlayDiv>, this.overlayContainer
    )
  }
}

export default Overlay