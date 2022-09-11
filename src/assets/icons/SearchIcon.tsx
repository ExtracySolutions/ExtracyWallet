import React, { FC } from 'react'

import Svg, { SvgProps, Path } from 'react-native-svg'

export const SearchIcon: FC<SvgProps> = (props) => {
  return (
    <Svg width={20} height={20} fill="none" {...props}>
      <Path
        d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16ZM19 19l-4.35-4.35"
        stroke={props.color ?? '#ACADB0'}
        strokeWidth={1.44}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}
