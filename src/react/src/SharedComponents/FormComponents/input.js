import React, { Component } from 'react'
import styled from 'styled-components'


const Section = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-weight: 300;
  margin-top: -0.7rem;
`

const Label = styled.label`
  color: #fcfafa;
  position: relative;
  top: 1.2rem;

  @media (min-width: 900px) {
    top: 1.6rem;
  }
`

const StyledInput = styled.input`
  position: relative;
  text-align: center;
  width: 12rem;
  height: 1.8rem;
  margin-top: -0.4rem;
  background-color: rgba(0,0,0,0);
  padding: 0.625rem;
  box-sizing: border-box;
  border-bottom: 2px solid #fcfafa;
  border-top: none;
  border-right: none;
  border-left: none;
  border-radius: 0;

  @media (min-width: 900px) {
    width: 16rem;
    height: 2rem;
    margin: 0 0 0.5rem 0;
  }

  &:focus {
    outline: none;
  }
`

const FormError = styled.div`
  color: #1c1c1c;
  margin-top: 0.2rem;

  @media (min-width: 900px) {
    margin-top: -0.2rem;
  }
`

const focused = {
  'borderBottom': '2px solid #17CA4A'
}

const hidden = {
  'visibility': 'hidden'
}

const Input = ({ input, label, name, meta: { error, touched, active, pristine } }) => {
  return (
    <Section>
      <Label style={ (active || !pristine) ? hidden : null }>{ label }</Label>  
      <StyledInput style={ active ? focused : null } {...input}></StyledInput>
      <FormError>
        { touched && error }
      </FormError> 
    </Section>
  )
}

export default Input