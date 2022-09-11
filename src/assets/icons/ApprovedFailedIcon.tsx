import React, { FC } from 'react'

import Svg, { SvgProps, Path, Circle } from 'react-native-svg'

export const ApprovedFailedIcon: FC<SvgProps> = (props) => {
  return (
    <Svg width={38} height={38} fill="none" {...props}>
      <Circle opacity={0.1} cx={19} cy={19} r={19} fill="#F15223" />
      <Path
        d="m7.333 20.065 5.655 5.655 1.41-1.42-5.65-5.65-1.415 1.415Zm21.914-7.784-10.599 10.61-4.237-4.247-1.43 1.41 5.667 5.666 12.02-12.019-1.42-1.42ZM25.01 13.7l-1.41-1.42-6.371 6.371 1.42 1.41 6.36-6.36Z"
        fill="#F15223"
      />
    </Svg>
  )
}
