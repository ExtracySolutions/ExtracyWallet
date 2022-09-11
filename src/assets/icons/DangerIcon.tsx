import React, { FC } from 'react'

import Svg, { SvgProps, Path } from 'react-native-svg'

export const DangerIcon: FC<SvgProps> = (props) => {
  return (
    <Svg
      width={18}
      height={18}
      fill="none"
      viewBox={`0 0 ${props.width ?? 18} ${props.height ?? 18}`}
      {...props}
    >
      <Path
        d="M8.965 1.5C4.849 1.5 1.5 4.864 1.5 9c0 4.135 3.364 7.5 7.5 7.5s7.5-3.365 7.5-7.5c0-4.136-3.38-7.5-7.535-7.5zM9 15c-3.308 0-6-2.692-6-6s2.675-6 5.965-6C12.293 3 15 5.692 15 9s-2.692 6-6 6z"
        fill={props.color ?? '#F15223'}
      />
      <Path
        d="M8.25 5.25h1.5v5.25h-1.5V5.25zm0 6h1.5v1.5h-1.5v-1.5z"
        fill={props.color ?? '#F15223'}
      />
    </Svg>
  )
}
