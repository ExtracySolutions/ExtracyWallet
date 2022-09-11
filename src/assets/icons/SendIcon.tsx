import React, { FC } from 'react'

import Svg, { SvgProps, Path } from 'react-native-svg'
export type SendIconProps = {
  color?: string
  small?: boolean
} & SvgProps
export const SendIcon: FC<SendIconProps> = (props) => {
  const { color, small } = props
  return small ? (
    <Svg
      preserveAspectRatio="xMaxYMid meet"
      viewBox="0 0 30 30"
      width={16}
      height={16}
      fill="none"
      {...props}
    >
      <Path
        d="M14.375 1.625l-12.75 12.75M3.75 1.625h10.625V12.25"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  ) : (
    <Svg
      preserveAspectRatio="xMaxYMid meet"
      viewBox="0 0 30 30"
      width={25}
      height={25}
      fill="none"
      {...props}
    >
      <Path
        d="M9.438 22.563L22.562 9.438M9.438 9.438h13.124v13.124"
        stroke={color}
        strokeWidth={2.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}
