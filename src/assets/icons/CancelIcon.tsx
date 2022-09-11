import React, { FC } from 'react'

import Svg, { SvgProps, Path } from 'react-native-svg'

export const CancelIcon: FC<SvgProps> = (props) => {
  const { color, width, height } = props
  return width ? (
    <Svg
      viewBox="0 0 14 14"
      width={width}
      height={height}
      fill="none"
      {...props}
    >
      <Path
        d="m8.41 7 4.3-4.29a1.004 1.004 0 1 0-1.42-1.42L7 5.59l-4.29-4.3a1.004 1.004 0 0 0-1.42 1.42L5.59 7l-4.3 4.29a1 1 0 0 0 .325 1.639 1 1 0 0 0 1.095-.219L7 8.41l4.29 4.3a1.001 1.001 0 0 0 1.639-.325 1 1 0 0 0-.22-1.095L8.41 7Z"
        fill={color ? color : '#000'}
      />
    </Svg>
  ) : (
    <Svg width={14} height={14} fill="none" {...props}>
      <Path
        d="m8.41 7 4.3-4.29a1.004 1.004 0 1 0-1.42-1.42L7 5.59l-4.29-4.3a1.004 1.004 0 0 0-1.42 1.42L5.59 7l-4.3 4.29a1 1 0 0 0 .325 1.639 1 1 0 0 0 1.095-.219L7 8.41l4.29 4.3a1.001 1.001 0 0 0 1.639-.325 1 1 0 0 0-.22-1.095L8.41 7Z"
        fill={color ? color : '#000'}
      />
    </Svg>
  )
}
