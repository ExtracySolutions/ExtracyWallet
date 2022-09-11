import React, { FC } from 'react'

import Svg, { SvgProps, Path, Circle } from 'react-native-svg'

export const CustomIcon: FC<SvgProps> = (props) => {
  return (
    <Svg width={16} height={16} fill="none" {...props}>
      <Path
        d="M4 1.5v5M4 12.5v2M12 1.5v2M12 9.5v5"
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx={4} cy={9.5} r={2.5} stroke="#fff" />
      <Circle cx={12} cy={6.5} r={2.5} stroke="#fff" />
    </Svg>
  )
}
