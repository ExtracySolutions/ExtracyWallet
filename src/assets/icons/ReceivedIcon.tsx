import React, { FC } from 'react'

import Svg, { SvgProps, Path } from 'react-native-svg'

export const ReceivedIcon: FC<SvgProps> = (props) => {
  return (
    <Svg
      preserveAspectRatio="xMaxYMid meet"
      viewBox="0 0 25 25"
      width={25}
      height={25}
      fill="none"
      {...props}
    >
      <Path
        d="m6.5 18 12-12M15.5 18h-9V9"
        stroke="#556EFA"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}
