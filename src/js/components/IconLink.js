import React from 'react'
import Glyphicon from 'react-bootstrap/lib/Glyphicon'
import { PropTypes } from 'prop-types'
import { LIGHT_FILL_COLOR, DARK_FILL_COLOR } from '../constants'

const IconLink = ({ icon, active, ...props }) => {
  const color = active ? DARK_FILL_COLOR : LIGHT_FILL_COLOR
  return (
    <a
      style={{cursor: 'pointer'}}
      {...props}>
      <Glyphicon style={{color: color}} glyph={icon} />
    </a>
  )
}

IconLink.propTypes = {
  icon: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  active: PropTypes.bool
}

export default IconLink
