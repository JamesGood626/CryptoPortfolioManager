import React from 'react'
import styled from 'styled-components'

const ContainerDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding: 0;
  height: 4.5rem;
  width: 20rem;
  background-color: #fffbfc;
  font-size: .7rem;
  color: #c21500;
  border-top-right-radius: 25px;
  box-shadow: 2px 2px 3px #ccc;

  @media (min-width: 900px) {
    height: 5.5rem;
    width: 24rem;
  }
`


const header = (props) => {
  return (
    <ContainerDiv>
      <h2>{ props.children }</h2>
    </ContainerDiv>
  )
}

export default header