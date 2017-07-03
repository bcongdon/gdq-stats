import React from 'react'
import { PropTypes } from 'prop-types'

const VerticalLabel = ({ viewBox, fill, fontWeight, xOffset, fontSize, children }) => {
  const { x } = viewBox
  const cx = x + xOffset
  const cy = 20
  const rot = `270 ${cx} ${cy}`
  return (
    <text
      x={cx}
      y={cy}
      transform={`rotate(${rot})`}
      textAnchor='end'
      fill={fill}
      fontWeight={fontWeight}
      fontSize={fontSize}>
      {children}
    </text>
  )
}

VerticalLabel.propTypes = {
  viewBox: PropTypes.object,
  fill: PropTypes.string,
  fontWeight: PropTypes.number,
  fontSize: PropTypes.number,
  children: PropTypes.any,
  xOffset: PropTypes.number
}

export default VerticalLabel
