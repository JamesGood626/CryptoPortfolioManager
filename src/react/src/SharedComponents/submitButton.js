import React from 'react'
import styled from 'styled-components'


const Button = styled.button`
  margin-bottom: 1.4rem;
  margin-top: 2rem;
  height: 3.4rem;
  padding: 0;
  // padding: 1.2rem;
  width: 8rem;
  background-color: rgba(0,0,0,0);
  border: solid #371732 .1rem;
  color: #371732;
  // box-shadow: inset 0 0 0 0 #35e0f0;
  // transition: .8s ease-out;


  @media (min-width: 900px) {
    height: 5.2rem;
    width: 10rem;
  }
  
  &:hover {
    color: #fcfafa;
    background-color: #4eb089;
    border: solid #fcfafa .1rem;
  }

  &:hover {
    // box-shadow: inset 0 0 3.125rem 3.125rem #35e0f0; 
  }
`

const SubmitButton = (props) => {
  return <Button type="submit">{ props.children }</Button>
}

export default SubmitButton