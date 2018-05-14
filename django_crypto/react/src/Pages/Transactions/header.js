import React from 'react'
import styled from 'styled-components'


const Div = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding: 0;
`

const ContainerDiv = Div.extend`
  width: 48rem;
  height: 5.5rem;
  padding: 0;
  color: #011627;
  background-color: #fffbfc;
  font-size: .7rem;
`

const H2 = styled.h2`
  margin: 0;
`

const header = (props) => {
  return (
    <ContainerDiv>
      <H2>{ props.children }</H2>
    </ContainerDiv>
  )
}

export default header