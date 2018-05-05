import React, {Component} from 'react'
import { Redirect } from 'react-router-dom'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { loginUser } from '../../actions'
import { Field, reduxForm } from 'redux-form'
import Input from '../../SharedComponents/FormComponents/input'
import Header from '../../SharedComponents/FormComponents/header'
import SubmitButton from '../../SharedComponents/submitButton'
// import validateEmails from '../../utils/validateEmail'

// import ErrorBoundary from '../ErrorBoundary'



// STILL NEED TO DISPLAY ERROR MESSAGE IF SOMETHING GOES WRONG WHEN USER ATTEMPTS TO LOGIN


const CenteredForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: evenly-space;
  align-items: center;
  font-family: 'Quattrocento', serif;
  width: 20rem;
  height: 20rem;
  color: #c21500;
  background: #c21500;  /* fallback for old browsers */
  background: -webkit-linear-gradient(to right, #FFA900, #c21500);  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to right, #FFA900, #c21500); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  border-bottom-left-radius: 25px;
  border-top-right-radius: 25px;
  box-shadow: 2px 2px 4px #aaa;

  @media (min-width: 900px) {
    width: 24rem;
  }
`

const SuccessDiv = styled.div`
  width: 100vw;
  text-align: center;
  margin: auto;
  font-size: 2rem;
  color: #274156;
`

const FIELDS = [
  { name: 'username', label: 'Username' },
  { name: 'password', label: 'Password' }
]


class Form extends Component {
  renderFields() {
    return FIELDS.map( ({ label, name }) => {
      return (
          <Field
            key={ name }
            label={ label }
            name={ name }
            type="text"
            component={ Input } 
          />
      )
    })
  }
  
  render() {
    const { error, handleSubmit, submitSucceeded, submitting } = this.props
    
    const onSubmit = values => {
      this.props.loginUser(values)
    }

    console.log("USER AUTHENTICATED")
    console.log(this.props.userAuthenticated)

    if(this.props.userAuthenticated) {
      return(
        <Redirect to='/portfolio/update'/>
      )
    }

    else {
      return(
        // <ContainerDiv>
          <CenteredForm onSubmit={ handleSubmit(onSubmit) }>
            { error && <strong>{ error }</strong> }
            <Header>Log In</Header>
            { this.renderFields() }
            <SubmitButton isDisabled={ this.props.isAuthenticating } type="submit">Submit</SubmitButton>
          </CenteredForm>
        // </ContainerDiv>
      )
    }
  }
}

// function validate(values) {
//   const errors = {}

//   errors.email = validateEmails(values.email || '')

//   if(!values.name || values.name.length < 3) {
//     errors.name = 'Enter your Name'
//   }
//   if(!values.email) {
//     errors.email = 'Enter your Email Address'
//   }
//   if(!values.projectInfo) {
//     errors.projectInfo = 'Please provide some information about your project'
//   }
//   return errors
// }


function mapStateToProps({ authentication }) {
  return { 
    isAuthenticating: authentication.isAuthenticating, 
    userAuthenticated: authentication.userAuthenticated,
    authenticationError: authentication.authenticationError
  }
}

export default reduxForm({
  form: 'LoginForm'
})(
  connect(mapStateToProps, { loginUser })(Form)
)