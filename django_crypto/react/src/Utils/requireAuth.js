import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

const requireAuth = (WrappedComponent) => {
  class VerifyAuth extends Component {
    render() {
      console.log("USER AUTHENTICATED FROM WITHIN REQUIRE AUTH")
      console.log(this.props.userAuthenticated)
      if(this.props.userAuthenticated) {
        console.log(this.props.userAuthenticated)
        return <WrappedComponent {...this.props} />
      }
      else {
        return <Redirect to="/login"/>
      }
    }
  }
  return connect(mapStateToProps)(VerifyAuth)
}

function mapStateToProps({ authentication }) {
  return  {
    userAuthenticated: authentication.userAuthenticated
  }
}

export default requireAuth
