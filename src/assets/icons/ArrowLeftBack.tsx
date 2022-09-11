import React, { FC } from 'react'

import Svg, { SvgProps, Path } from 'react-native-svg'
export const ArrowLeftBack: FC<SvgProps> = (props) => {
  const { color } = props
  return (
    <Svg
      preserveAspectRatio="xMaxYMid meet"
      viewBox="0 0 8 12"
      width={8}
      height={12}
      fill="none"
      {...props}
    >
      <Path
        d="M8 10.58 3.42 6 8 1.41 6.59 0l-6 6 6 6L8 10.58Z"
        fill={color || '#3C3D42'}
      />
    </Svg>
  )
}
