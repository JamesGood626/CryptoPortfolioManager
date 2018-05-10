import React from 'react'
import styled from 'styled-components'


const Button = styled.button`
  width: 5rem;
  height: 2rem;
  line-height: 2rem;
  margin: 0;
  margin-bottom: 1rem;
  font-size: 1rem;
  text-align: center;
  color: #c15200;
  background: #fcfafa;
  border-top-left-radius: 14px;
  border-bottom-right-radius: 14px;
  box-shadow: 2px 2px 3px #ccc;

  @media (min-width: 900px) {
    width: 7rem;
    height: 2.8rem;
    line-height: 2.8rem;
  }
  &:hover {
    color: #fcfafa;
    background: #17CA4A;
  }
  &:focus {
    outline: 0;
  }
`

const SubmitButton = ({ children, isDisabled }) => {
  return <Button type="submit" disabled={ isDisabled }>{ children }</Button>
}

export default SubmitButton