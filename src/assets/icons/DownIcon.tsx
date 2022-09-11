import React, { FC } from 'react'

import Svg, { SvgProps, Path } from 'react-native-svg'

export const DownIcon: FC<SvgProps> = (props) => {
  const { color } = props
  return (
    <Svg width={28} height={28} fill="none" {...props}>
      <Path
        d="M24.5 17.5v4.667a2.333 2.333 0 01-2.333 2.333H5.833A2.333 2.333 0 013.5 22.167V17.5M8.167 11.667L14 17.5l5.833-5.833M14 17.5v-14"
        stroke={color}
        strokeWidth={2.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}
