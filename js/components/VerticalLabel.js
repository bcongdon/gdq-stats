import React from 'react'
import { PropTypes } from 'prop-types'

const VerticalLabel = ({ viewBox, fill, fontWeight, xOffset, yOffset, fontSize, children, ...props }) => {
  const { x } = viewBox
  const cx = x + xOffset
  const cy = 20 + yOffset
  const rot = `270 ${cx} ${cy}`
  return (
    <text
      x={cx}
      y={cy}
      transform={`rotate(${rot})`}
      textAnchor='end'
      fill={fill}
      fontWeight={fontWeight}
      fontSize={fontSize}
      {...props}>
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
  xOffset: PropTypes.number,
  yOffset: PropTypes.number
}

VerticalLabel.defaultProps = {
  xOffset: 0,
  yOffset: 0
}

export default VerticalLabel
