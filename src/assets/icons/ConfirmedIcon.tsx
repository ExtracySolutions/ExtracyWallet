import React, { FC } from 'react'

import Svg, { SvgProps, Path, Circle } from 'react-native-svg'

export const ConfirmedIcon: FC<SvgProps> = (props) => {
  return (
    <Svg width={38} height={38} fill="none" {...props}>
      <Circle opacity={0.1} cx={19} cy={19} r={19} fill="#35C4BA" />
      <Path
        d="M7.333 20.065l5.655 5.655 1.41-1.42-5.65-5.65-1.415 1.415zm21.914-7.784l-10.599 10.61-4.237-4.247-1.43 1.41 5.667 5.666 12.02-12.019-1.42-1.42zM25.01 13.7l-1.41-1.42-6.371 6.371 1.42 1.41 6.36-6.36z"
        fill="#35C4BA"
      />
    </Svg>
  )
}
