import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

const requireAuth = (WrappedComponent) => {
  class VerifyAuth extends Component {
    render() {
      if(this.props.userAuthenticated) {
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
