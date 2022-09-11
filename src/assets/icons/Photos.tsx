import React, { FC } from 'react'

import Svg, { Path, SvgProps } from 'react-native-svg'

export const Photos: FC<SvgProps> = (props) => {
  return (
    <Svg width={24} height={24} fill="none" {...props}>
      <Path
        d="m8.5 13.5 2.5 3 3.5-4.5 4.5 6H5m16 1V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2Z"
        fill="#fff"
      />
    </Svg>
  )
}
