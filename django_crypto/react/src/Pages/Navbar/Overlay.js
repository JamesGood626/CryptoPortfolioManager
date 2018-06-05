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
  z-index: 9000;
  display: flex;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  padding-top: 20%;
  background-color: #fcfafa;
  overflow: hidden;

  @media (min-width: 400px) {
    padding-top: 10%;
  }

  @media (min-width: 900px) {
    display: none;
  }
`

// createPortal for Modal Overlay is overkill

class Overlay extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <OverlayDiv className="overlay">
        { this.props.children }
      </OverlayDiv>
    )
  }
}

export default Overlay