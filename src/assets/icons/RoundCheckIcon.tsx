import React, { FC } from 'react'

import Svg, { SvgProps, Path } from 'react-native-svg'

export const RoundCheckIcon: FC<SvgProps> = (props) => {
  return (
    <Svg width={20} height={20} fill="none" {...props}>
      <Path
        d="M10 19a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"
        stroke={props.color ?? '#556EFA'}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="m6.442 10.34 2.168 2.167-.014-.014 4.891-4.891"
        stroke={props.color ?? '#556EFA'}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}
