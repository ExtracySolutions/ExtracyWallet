import React, { FC } from 'react'

import Svg, { SvgProps, Path } from 'react-native-svg'
export const ReduceIcon: FC<SvgProps> = (props) => {
  return (
    <Svg width={10} height={6} fill="none" {...props}>
      <Path
        d="M4.646 5.642.854 1.849a.5.5 0 0 1 .353-.854h7.586a.5.5 0 0 1 .353.854L5.354 5.642a.5.5 0 0 1-.708 0Z"
        fill="#DF554A"
      />
    </Svg>
  )
}
