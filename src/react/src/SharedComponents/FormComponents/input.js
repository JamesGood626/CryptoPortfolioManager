import React, { Component } from 'react'
import styled from 'styled-components'


const Section = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-weight: 300;
`

const Label = styled.label`
  color: #371732;
  position: relative;
  top: 2rem;
`

const StyledInput = styled.input`
  position: relative;
  text-align: center;
  width: 14rem;
  height: 2.5rem;
  background-color: rgba(0,0,0,0);
  padding: 0.625rem;
  box-sizing: border-box;
  border: 2px solid #371732;
  border-top: none;
  border-right:none;
  border-left: none;
  // box-shadow: 2px #777;
  // transition: border 0.1s;
  border-radius: 0;

  @media (min-width: 900px) {
    width: 16rem;
    margin: 0;
    margin-bottom: 2rem;
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
  color: #d40000;
  margin-top: -20px;
  margin-bottom: 20px;
`


// const Input = ({ input, label, name, list, onFocus, meta: { error, touched } }) => {
//   const focused = false
//   return (
//     <Section>
//       { <Label>{label}</Label>}
//       <StyledInput { ...input } list={ list }></StyledInput>
//       <FormError>
//         { touched && error }
//       </FormError> 
//     </Section>
//   )
// }


// 3/27/18 Also need to account for when the form unmounts between Buy/Sell option
// to clear the values that were entered in the fields of the unmounting form
class Input extends Component {
  constructor(props) {
    super(props)
    
    this.state = {
      focused: false
    }
    console.log(this.props.randomProp)
    this.toggleFocused = this.toggleFocused.bind(this)
  }

  toggleFocused() {
    this.setState((prevState, state) => ({
      focused: !prevState.focused
    }))
  }

  render() {
    const { input, label, list, touched, error } = this.props
    const { focused } = this.state
    const hiddenLabel = {
      'visibility': 'hidden'
    }
    return (
      <Section OnFocus={ this.toggleFocused }>
         <Label style={ focused ? hiddenLabel : null }>{ label }</Label> 
        <StyledInput { ...input } 
                     list={ list }
                     onFocus={ 
                      event => { 
                        input.onFocus(event)
                        if (event.target.value === '') {
                          this.toggleFocused()
                        }
                      } 
                    } 
                     onBlur={ 
                      event => { 
                        input.onBlur(event)
                        if (event.target.value === '') {
                          this.toggleFocused()
                        }
                      }
                    }
        />
        <FormError>
          { touched && error }
        </FormError> 
      </Section>
    )
  }
}

export default Input