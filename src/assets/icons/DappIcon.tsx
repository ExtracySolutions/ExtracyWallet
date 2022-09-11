import React, { FC } from 'react'

import Svg, { SvgProps, Rect } from 'react-native-svg'

export const DappIcon: FC<SvgProps> = (props) => {
  const { color } = props
  return (
    <Svg width={25} height={25} fill="none" {...props}>
      <Rect
        x={3.5}
        y={13.5}
        width={16}
        height={8}
        rx={2}
        stroke={color}
        strokeWidth={2}
      />
      <Rect
        x={15.5}
        y={3.5}
        width={6}
        height={6}
        rx={3}
        stroke={color}
        strokeWidth={2}
      />
      <Rect
        x={3.5}
        y={5.5}
        width={8}
        height={16}
        rx={2}
        stroke={color}
        strokeWidth={2}
      />
    </Svg>
  )
}
