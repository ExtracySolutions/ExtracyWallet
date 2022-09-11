import React, { FC } from 'react'

import Svg, { SvgProps, Path } from 'react-native-svg'

export const ArrowRight: FC<SvgProps> = (props) => {
  return (
    <Svg width={24} height={24} fill="none" {...props}>
      <Path
        d="M9 18l6-6-6-6"
        stroke="#333"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}
