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
  color: #371732;
  fill: #371732;
  font-size: 1.4rem;

  &:hover {
    color: #d0ccd0;
    fill: #d0ccd0;
  }
`


const menuItems = ({ location, menuItems }) => {
  const activeLink = {
    'color': '#4eb089',
    'fill': '#4eb089'
  }
  // console.log('in navbar')
  // console.log(location)

  return(
    <Nav role="navigation">
      <NavDiv>
        { menuItems.map(menuItem => {
            return  <Link key={ menuItem.name } style={{ 'textDecoration': 'none' }} to={ menuItem.path }>
                      <Span style={ (menuItem.path === location.pathname) ? activeLink : null }>
                        { <menuItem.icon active={menuItem.path === location.pathname ? true : false}/> }{ menuItem.name }
                      </Span>
                    </Link>
          }
        )}
      </NavDiv>
    </Nav>
  )
}

export default menuItems