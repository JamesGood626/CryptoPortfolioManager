import React, { Component } from 'react'


class UpdateIcon extends Component {
  render() {
    const iconPadding = {
      'paddingRight': '.8rem',
      'paddingLeft': '.2rem'
    }
    return (
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="2.2rem"
	         height="2.2rem" style={ iconPadding } viewBox="0 0 256 256">
        <path d="M208,112.002h-64V48.001c0-8.836-7.164-15.998-16-15.998
          s-15.999,7.162-15.999,15.998v64.001H47.999c-8.835,0-15.999,7.163-15.999,15.999C32,136.84,39.164,144,47.999,144h64.002v64.003
          c0,8.836,7.163,15.997,15.999,15.997s16-7.161,16-15.997V144h64c8.838,0,16-7.16,16-15.999
          C224,119.165,216.838,112.002,208,112.002z"/>
      </svg>
    )
  }
}

export default UpdateIcon