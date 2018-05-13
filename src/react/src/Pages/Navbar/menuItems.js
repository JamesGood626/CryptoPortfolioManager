import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

  
const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  width: 16rem;


  // @media (min-width: 600px) {
  //   background-color: limegreen;
  // }

  // @media (min-width: 900px) {
  //   background-color: purple;
  // }  
`

const NavDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 100%;
  height: 90%;
`

const Span = styled.span`
  display: flex;
  align-items: center;
  margin-left: 2.5rem;
  color: #1C1C1C;
  fill: #1C1C1C;
  font-size: 1.4rem;

  &:hover {
    color: #17CA4A;
    fill: #17CA4A;
  }
`


const menuItems = ({ location, menuItems }) => {
  const activeLink = {
    'color': '#FFA900',
    'fill': '#FFA900'
  }
  // console.log('in navbar')
  // console.log(location)

  return(
    <Nav role="navigation">
      <NavDiv>
        { menuItems.map(menuItem => {
            return (
              <Link key={ menuItem.name } style={{ 'textDecoration': 'none' }} to={ menuItem.path }>
                <Span style={ (menuItem.path === location.pathname) ? activeLink : null }>
                  { <menuItem.icon/> }{ menuItem.name }
                </Span>
              </Link>
            ) 
          }
        )}
      </NavDiv>
    </Nav>
  )
}

export default menuItems