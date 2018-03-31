import React, {Component} from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { loginUser } from '../../actions'
import { Field, reduxForm } from 'redux-form'
import Input from '../../SharedComponents/FormComponents/input'
import Header from '../../SharedComponents/FormComponents/header'
import SubmitButton from '../../SharedComponents/submitButton'
// import validateEmails from '../../utils/validateEmail'

// import ErrorBoundary from '../ErrorBoundary'

// const ContainerDiv = styled.div`
//   width: 60%;
//   height: 40%;
//   transform: translate(45%, 45%);
// `

const CenteredForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: 'Quattrocento', serif;
  width: 30%;
  height: 60%;
  color: #371732;
  background-color: #fcfafa;
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
    const { handleSubmit, submitSucceeded } = this.props
    
    const onSubmit = (values) => {this.props.loginUser(values)}
    
    if(submitSucceeded) {
      return(
        <SuccessDiv>Success!</SuccessDiv>
      )
    }

    else {  
      return(
        // <ContainerDiv>
          <CenteredForm onSubmit={ handleSubmit(onSubmit) }>
            <Header>Log In</Header>
            { this.renderFields() }
            <SubmitButton type="submit">Submit</SubmitButton>
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


// function mapStateToProps({ symbolList }) {
//   return { symbolList }
// }

export default reduxForm({
  form: 'LoginForm'
})(
  connect(null, { loginUser })(Form)
)