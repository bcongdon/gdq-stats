import Glyphicon from 'react-bootstrap/lib/Glyphicon'
import React from 'react'
import { PANEL_BACKGROUND_COLOR } from '../constants'

const style = {
  border: '1px solid #ddd',
  padding: 5,
  paddingRight: 8,
  display: 'inline-flex',
  backgroundColor: PANEL_BACKGROUND_COLOR
}

const ReturnHome = () => {
  return (
    <h3>
      <a style={style} href='/'>
        <Glyphicon style={{paddingRight: 8}} glyph='chevron-left' /> <span>Return Home</span>
      </a>
    </h3>
  )
}

export default ReturnHome
