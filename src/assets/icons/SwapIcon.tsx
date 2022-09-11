import React, { FC } from 'react'

import Svg, { SvgProps, Path, G } from 'react-native-svg'

export const SwapIcon: FC<SvgProps> = (props) => {
  return (
    <Svg
      preserveAspectRatio="xMaxYMid meet"
      viewBox="0 0 25 24"
      width={25}
      height={24}
      fill="none"
      {...props}
    >
      <G fill="none" fillRule="evenodd">
        <Path
          d="m16.5 5 4 4h-11M8.5 19l-4-4h11"
          stroke="#556EFA"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
    </Svg>
  )
}
