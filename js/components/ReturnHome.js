import Glyphicon from 'react-bootstrap/lib/Glyphicon'
import React from 'react'

const ReturnHome = () => {
  return (
    <h3>
      <a style={{border: '1px solid #ddd', padding: 5, paddingRight: 8, display: 'inline-flex', backgroundColor: '#eee'}} href='/'>
        <Glyphicon style={{paddingRight: 8}} glyph='chevron-left'/> <span>Return Home</span>
      </a>
    </h3>
  )
}

export default ReturnHome
