import React, { FC } from 'react'

import Svg, { SvgProps, Rect } from 'react-native-svg'

export const Contacts: FC<SvgProps> = (props) => {
  return (
    <Svg width={24} height={24} fill="none" {...props}>
      <Rect
        x={3}
        y={2}
        width={18}
        height={20}
        rx={3}
        stroke="#ACADB0"
        strokeWidth={2}
      />
      <Rect
        x={3}
        y={16}
        width={18}
        height={6}
        rx={3}
        stroke="#ACADB0"
        strokeWidth={2}
      />
      <Rect
        x={9}
        y={6}
        width={6}
        height={6}
        rx={3}
        stroke="#ACADB0"
        strokeWidth={2}
      />
    </Svg>
  )
}
