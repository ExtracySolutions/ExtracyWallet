import React, { FC } from 'react'

import Svg, { SvgProps, Path } from 'react-native-svg'

export const ArrowIcon: FC<SvgProps> = (props) => {
  return (
    <Svg width={16} height={14} fill="none" {...props}>
      <Path
        d="M1.333 7h13.334M8.833 1.167L14.667 7l-5.834 5.833"
        stroke="#8FA2B7"
        strokeWidth={1.667}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}
