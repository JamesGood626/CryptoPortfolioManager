import React, {Component} from 'react'
import { Redirect } from 'react-router-dom'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { loginUser } from '../../actions'
import { Field, reduxForm } from 'redux-form'
import Input from '../../SharedComponents/FormComponents/input'
import PasswordInput from '../../SharedComponents/FormComponents/passwordInput'
import Header from '../../SharedComponents/FormComponents/header'
import SubmitButton from '../../SharedComponents/submitButton'


const CenteredForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  font-family: 'Quattrocento', serif;
  width: 18rem;
  height: 18rem;
  color: #c21500;
  background: #c21500;  /* fallback for old browsers */
  background: -webkit-linear-gradient(to right, #FFA900, #c21500);  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to right, #FFA900, #c21500); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  border-bottom-left-radius: 25px;
  border-top-right-radius: 25px;
  box-shadow: 2px 2px 4px #aaa;

  @media (min-width: 742px) {
    width: 22rem;
    height: 20rem;
  }
  
  @media (min-width: 1024px) {
    width: 24rem;
    height: 22rem;
  }
`

const SuccessDiv = styled.div`
  width: 100vw;
  text-align: center;
  margin: auto;
  font-size: 2rem;
  color: #274156;
`

const AuthenticationError = styled.p`
  color: #1c1c1c;
  font-size: 1.2rem;
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
          component={ name === 'password' ? PasswordInput : Input } 
        />
      )
    })
  }
  
  render() {
    const { 
      error, 
      handleSubmit, 
      submitSucceeded, 
      userAuthenticated, 
      isAuthenticating, 
      authenticationError,
      loginUser
    } = this.props
    
    const onSubmit = values => {
      loginUser(values)
    }

    if(userAuthenticated) {
      return (
        <Redirect to='/portfolio/performance'/>
      )
    }

    else {
      return (
          <CenteredForm onSubmit={ handleSubmit(onSubmit) }>
            { error && <strong>{ error }</strong> }
            <Header>Log In</Header>
            { this.renderFields() }
            <SubmitButton isDisabled={ isAuthenticating } type="submit">Submit</SubmitButton>
            { authenticationError ? <AuthenticationError>{ authenticationError }</AuthenticationError> : null }
          </CenteredForm>
      )
    }
  }
}

function validate(values) {
  const errors = {}

  if(!values.username || values.username.length < 3) {
    errors.username = 'Enter your Username'
  }
  if(!values.password) {
    errors.password = 'Enter your Password'
  }
  return errors
}


function mapStateToProps({ authentication }) {
  return { 
    isAuthenticating: authentication.isAuthenticating, 
    userAuthenticated: authentication.userAuthenticated,
    authenticationError: authentication.authenticationError
  }
}

export default reduxForm({
  validate,
  form: 'LoginForm'
})(
  connect(mapStateToProps, { loginUser })(Form)
)