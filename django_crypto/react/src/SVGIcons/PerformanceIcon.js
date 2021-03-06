import React, { Component } from 'react'


class PerformanceIcon extends Component {
  render() {
    const iconPadding = {
      'paddingRight': '.8rem',
      'paddingLeft': '.2rem',
    }
    return (
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="2.2rem"
	         height="2.2rem" style={ iconPadding } viewBox="0 0 256 256">
              <path d="M239.999,208H32V32c0-8.836-7.163-16-16-16C7.164,16,0,23.164,0,32v191.999
                c0,8.837,7.164,16,16,16h223.999c8.838,0,16.002-7.163,16.002-16C256.001,215.163,248.837,208,239.999,208z M55.999,192.001
                h32.002c4.418,0,7.998-3.581,7.998-8.001v-64c0-4.417-3.58-7.998-7.998-7.998H55.999c-4.418,0-7.999,3.581-7.999,7.998v64
                C48,188.42,51.581,192.001,55.999,192.001z M120.001,192.001h32c4.418,0,7.998-3.581,7.998-8.001V56
                c0-4.417-3.58-7.998-7.998-7.998h-32c-4.418,0-8.002,3.581-8.002,7.998v128C111.999,188.42,115.583,192.001,120.001,192.001z
                M184,192.001h32c4.418,0,7.999-3.581,7.999-8.001v-80c0-4.419-3.581-8-7.999-8h-32c-4.417,0-8.001,3.581-8.001,8v80
                C175.999,188.42,179.583,192.001,184,192.001z"/>
      </svg>
    )
  }
}

export default PerformanceIcon