import React, { FC } from 'react'

import Svg, { SvgProps, Path } from 'react-native-svg'

export const ApprovedIcon: FC<SvgProps> = (props) => {
  const { color } = props
  return (
    <Svg
      preserveAspectRatio="xMaxYMid meet"
      viewBox="0 0 20 12"
      width={20}
      height={12}
      fill="none"
      {...props}
    >
      <Path
        d="m.175 6.897 4.762 4.762 1.188-1.196-4.759-4.758L.175 6.897ZM18.629.342 9.703 9.276 6.136 5.699 4.93 6.887l4.772 4.772L19.825 1.537 18.629.342Zm-3.57 1.194L13.874.34 8.508 5.705l1.195 1.188 5.357-5.357Z"
        fill={color || '#556EFA'}
      />
    </Svg>
  )
}
