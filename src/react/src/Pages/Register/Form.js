import React, {Component} from 'react'
import { Redirect } from 'react-router-dom'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { registerUser } from '../../actions'
import { Field, reduxForm } from 'redux-form'
import Input from '../../SharedComponents/FormComponents/input'
import Header from '../../SharedComponents/FormComponents/header'
import SubmitButton from '../../SharedComponents/submitButton'
import validateEmails from '../../Utils/validateEmail'

// import ErrorBoundary from '../ErrorBoundary'


// UTILIZE THE COMMENTED OUT VALIDATE REDUX FORM - AFTER IMPLEMENTING REGISTRATION SPECIFIC LOGIC/FILTRATION

const CenteredForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: 'Quattrocento', serif;
  width: 20rem;
  height: 25rem;
  color: #fcfafa;
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
  { name: 'email', label: 'Email' },
  { name: 'password', label: 'Password' },
  { name: 'confirmPassword', label: 'Confirm Password' }
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

  componentDidMount() {
    const { userRegistered, isRegistering, registrationError } = this.props
    console.log("userRegistered")
    console.log(userRegistered)
    console.log("isRegistering")
    console.log(isRegistering)
    console.log("registrationError")
    console.log(registrationError)
  }
  
  render() {
    const { handleSubmit, submitSucceeded, isRegistering } = this.props
    const onSubmit = values => { this.props.registerUser(values) }
    
    if(this.props.userRegistered) {
      return (
        <Redirect to='/login'/>
      )
    }
    return (
        <CenteredForm onSubmit={ handleSubmit(onSubmit) }>
          <Header>Register</Header>
          { this.renderFields() } 
          <SubmitButton idDisabled={ isRegistering } type="submit">Submit</SubmitButton>
          {/* Style this, it correctly notifies a user if the username is already taken */}
          { this.props.registrationError ? <h1>{ this.props.registrationError }</h1>  : null }
        </CenteredForm>
    )
  }
}

function validate(values) {
  const errors = {}

  errors.email = validateEmails(values.email || '')

  if(!values.username || values.username.length < 3) {
    errors.username = 'Enter a Username'
  }
  if(!values.email) {
    errors.email = 'Enter your Email Address'
  }
  if(!values.password) {
    errors.password = 'Enter a password'
  }
  if(!values.confirmPassword) {
    errors.confirmPassword = 'Confirm password'
  }
  if(values.password !== values.confirmPassword) {
    errors.confirmPassword = "Passwords do not match" 
  }
  return errors
}

function mapStateToProps({ registration }) {
  return { 
    isRegistering: registration.isRegistering,
    userRegistered: registration.userRegistered,
    registrationError: registration.registrationError
  }
}

export default reduxForm({
  validate,
  form: 'RegisterForm'
})(
  connect(mapStateToProps, { registerUser })(Form)
)