import React, { Component } from 'react'
import Media from 'react-media'
import styled from 'styled-components'
import MenuItems from './menuItems'
import Overlay from './Overlay'

const Div = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-width: 16rem;
  margin: 0;
  padding: 0;
`

const ContainerDiv = Div.extend`
  position: relative;
  z-index: 10;
  height: 100vh;
  background-color: #fcfafa;
  box-shadow: 2px 2px 3px #ccc;

  @media (max-width: 900px) {
    flex-direction: row;
    height: 5.3rem;
    width: 100vw;
  }
`

const NameDiv = Div.extend`
  width: 100%;
  height: 6rem;
  background: #c21500;  /* fallback for old browsers */
  background: -webkit-linear-gradient(to right, #FFA900, #c21500);  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to right, #FFA900, #c21500); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  
  @media (max-width: 900px) {
    height: 100%;
  }
`

const P = styled.p`
  margin: 0;
  padding: 0;
  color: #fffbfc;
`

class Navbar extends Component {
  constructor(props) {
    super(props)
    this.state = { overlayActive: false }
    this.toggleOverlay = this.toggleOverlay.bind(this)
  }

  toggleOverlay() {
    this.setState({ overlayActive: !this.state.overlayActive })
  }

  // full screen MenuItems component will need react-media to set it to display: none for small screens.
  render() {
    return(
      <ContainerDiv>
        <NameDiv>
          <P onClick={ this.toggleOverlay }>X</P>
        </NameDiv>
        <Media query="(min-width: 900px)">
          { matches =>
            matches 
            ? <MenuItems location={ this.props.location } menuItems={ this.props.menuItems }/>
            : null
          }
        </Media>
        { this.state.overlayActive &&
          <Overlay onClose={this.toggleOverlay}>
            <MenuItems location={ this.props.location } menuItems={ this.props.menuItems }/>
          </Overlay>
        }
      </ContainerDiv>
    )
  }
  
}

export default Navbar