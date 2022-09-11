import React, { FC } from 'react'

import Svg, { SvgProps, Path, G, Defs, ClipPath } from 'react-native-svg'

export const AuroraIcon: FC<SvgProps> = (props) => {
  const { width, height } = props
  return (
    <Svg
      viewBox="0 0 26 26"
      width={width}
      height={height}
      fill="none"
      {...props}
    >
      <G clipPath="url(#a)">
        <Path
          d="M12 3.528a2.211 2.211 0 0 1 1.988 1.227l6.25 12.5a2.222 2.222 0 0 1-1.988 3.217H5.75a2.223 2.223 0 0 1-1.986-3.217l6.249-12.5A2.212 2.212 0 0 1 12 3.528ZM12 2a3.75 3.75 0 0 0-3.354 2.072l-6.25 12.5A3.75 3.75 0 0 0 5.75 22h12.5a3.75 3.75 0 0 0 3.353-5.428l-6.249-12.5A3.75 3.75 0 0 0 12 2Z"
          fill="#79D15A"
        />
      </G>
      <Defs>
        <ClipPath id="a">
          <Path fill="#fff" transform="translate(2 2)" d="M0 0h20v20H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  )
}
