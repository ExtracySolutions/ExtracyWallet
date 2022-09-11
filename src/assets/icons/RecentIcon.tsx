import React, { FC } from 'react'

import Svg, { SvgProps, Path, G, Defs, ClipPath } from 'react-native-svg'

export const RecentIcon: FC<SvgProps> = (props) => {
  const { color } = props
  return (
    <Svg
      preserveAspectRatio="xMaxYMid meet"
      viewBox="0 0 16 16"
      width={16}
      height={16}
      fill="none"
      {...props}
    >
      <G clipPath="url(#a)" fill={color || '#556EFA'}>
        <Path d="M11.667 4.667h-10C.746 4.667 0 5.413 0 6.333v8C0 15.254.746 16 1.667 16h10c.92 0 1.666-.746 1.666-1.667v-8c0-.92-.746-1.666-1.666-1.666Zm-.334 10H2A.667.667 0 0 1 1.333 14V8H12v6c0 .368-.3.667-.667.667Z" />
        <Path d="M14.334 0h-10c-.92 0-1.667.747-1.667 1.667v1.666h12V11.3A1.667 1.667 0 0 0 16 9.667v-8C16 .747 15.254 0 14.334 0Z" />
      </G>
      <Defs>
        <ClipPath id="a">
          <Path fill="#fff" d="M0 0h16v16H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  )
}
