import React, { Component } from 'react'
import styled from 'styled-components'
import Form from './Form'

const ContainerDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
`

class Login extends Component {
  render() {
    return (
      <ContainerDiv>
         <Form/>
      </ContainerDiv>
    )
  }
}

export default Login