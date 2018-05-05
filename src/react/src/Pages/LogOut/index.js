import React, { Component } from 'react'
import { connect } from 'react-redux'
import { signOutUser } from '../../actions'

class LogOut extends Component {
  componentDidMount() {
    localStorage.removeItem('token')
    this.props.signOutUser()
  }

  render() {
    return (
      <div> You've successfully signed out</div>
    )
  }
}


export default connect(null,  { signOutUser })(LogOut)