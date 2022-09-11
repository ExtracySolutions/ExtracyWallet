import React, { FC } from 'react'

import Svg, { SvgProps, Circle, Path } from 'react-native-svg'

export const ToastSubmitIcon: FC<SvgProps> = (props) => {
  const { color } = props
  return (
    <Svg
      preserveAspectRatio="xMaxYMid meet"
      viewBox="0 0 32 32"
      width={32}
      height={32}
      fill="none"
      {...props}
    >
      <Circle
        cx={16}
        cy={16}
        r={12}
        stroke={color || '#29BF6F'}
        strokeWidth={2}
      />
      <Path d="m10 16 4 4 8-8.5" stroke={color || '#29BF6F'} strokeWidth={2} />
    </Svg>
  )
}
