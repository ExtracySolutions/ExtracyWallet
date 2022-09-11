import React, { FC } from 'react'

import Svg, { SvgProps, Path, Circle } from 'react-native-svg'

export const NewTabIcon: FC<SvgProps> = (props) => {
  return (
    <Svg width={32} height={32} fill="none" {...props}>
      <Circle cx={16} cy={16} r={16} fill={props.color ?? '#556EFA'} />
      <Path
        d="M16 8v16M8 16h16"
        stroke="#fff"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}
