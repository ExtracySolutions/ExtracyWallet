import React, { FC } from 'react'

import Svg, { SvgProps, Path } from 'react-native-svg'

export const DappArrowBackIcon: FC<SvgProps> = (props) => {
  return (
    <Svg width={30} height={30} fill="none" {...props}>
      <Path
        d="m18.75 22.5-7.5-7.5 7.5-7.5"
        stroke={props.color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}
