import React from 'react'
import styled from 'styled-components'


const Section = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-weight: 300;
`

const Label = styled.label`
  color: #fcfafa;
  position: relative;
  top: 4rem;
`

const StyledInput = styled.input`
  position: relative;
  margin-top: 1.875rem;
  margin-bottom: 1.5rem;
  height: 2.5rem;
  background-color: rgba(0,0,0,0);
  padding: 0.625rem;
  box-sizing: border-box;
  border: 2px solid #fcfafa;
  border-top: none;
  border-right:none;
  border-left: none;
  // box-shadow: 2px #777;
  // transition: border 0.1s;
  border-radius: 0;

  @media (min-width: 500px) {
    width: 16rem;
  }

  &:focus {
    outline: none;
    // border-bottom: solid 1px #35e0f0;
    // border-left: solid 1px #35e0f0;
    // border-right: solid 1px #35e0f0;
    // border-top: solid 1px #35e0f0;
  }
`

const FormError = styled.div`
  color: #fcfafa;
  margin-bottom: 20px;
`


const Input = ({ input, label, name, list, meta: { error, touched } }) => {
  return (
    <Section>
      <Label>{label}</Label>  
      <StyledInput { ...input } list={ list }></StyledInput>
      <FormError>
        { touched && error }
      </FormError> 
    </Section>
  )
}

export default Input