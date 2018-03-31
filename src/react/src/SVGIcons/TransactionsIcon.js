import React, { Component } from 'react'


class TransactionsIcon extends Component {
  render() {
    const iconPadding = {
      'paddingRight': '.8rem',
      'paddingLeft': '.2rem'
    }
    return (
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="2.2rem"
           height="2.2rem" style={ iconPadding } viewBox="0 0 256 256">
        <path d="M251.764,60.803L195.197,4.234c-6.25-6.248-16.381-6.248-22.629,0
          l-67.881,67.883c-6.249,6.247-6.249,16.378,0,22.628L116,106.059l67.882-67.882l33.939,33.94l-67.881,67.882l11.313,11.313
          c6.25,6.251,16.379,6.251,22.629,0l67.881-67.88C258.014,77.181,258.014,67.05,251.764,60.803z M140.451,149.49l-67.882,67.882
          l-33.941-33.939l67.883-67.883l-11.314-11.315c-6.248-6.247-16.379-6.247-22.627,0L4.686,172.118
          c-6.248,6.247-6.248,16.378,0,22.625l56.568,56.569c6.249,6.25,16.38,6.25,22.628,0l67.881-67.88
          c6.25-6.251,6.25-16.382,0-22.629L140.451,149.49z M77.253,179.316c6.249,6.247,16.38,6.247,22.628,0l79.88-80.287
          c6.248-6.25,6.248-16.381,0-22.628c-6.248-6.248-16.379-6.248-22.627,0l-79.881,80.287
          C71.005,162.937,71.005,173.066,77.253,179.316z"/>
      </svg>
    )
  }
}

export default TransactionsIcon