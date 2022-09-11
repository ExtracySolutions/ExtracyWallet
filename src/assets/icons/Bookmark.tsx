import React, { FC } from 'react'

import Svg, { SvgProps, Path, ClipPath, Defs, G } from 'react-native-svg'
export const Bookmarks: FC<SvgProps> = (props) => {
  const { color } = props
  return (
    <Svg width={16} height={16} fill="none" {...props}>
      <G clipPath="url(#a)">
        <Path
          d="M15.958 6.137a.849.849 0 0 0-.732-.584l-4.618-.42L8.782.86A.85.85 0 0 0 7.218.86L5.392 5.133l-4.619.42A.85.85 0 0 0 .291 7.04l3.49 3.061-1.03 4.534a.85.85 0 0 0 1.266.92L8 13.173l3.982 2.381a.85.85 0 0 0 1.265-.919l-1.029-4.534 3.49-3.06a.85.85 0 0 0 .25-.905Z"
          fill={color}
        />
      </G>
      <Defs>
        <ClipPath id="a">
          <Path fill="#fff" d="M0 0h16v16H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  )
}
