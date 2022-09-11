import React, { FC } from 'react'

import Svg, { SvgProps, Path } from 'react-native-svg'

export const CELOIcon: FC<SvgProps> = (props) => {
  const { width, height } = props
  return (
    <Svg
      viewBox="0 0 26 26"
      width={width}
      height={height}
      fill="none"
      {...props}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.667 10.035a7.369 7.369 0 1 1 14.737 0 7.369 7.369 0 0 1-14.737 0Zm12.772 0a5.403 5.403 0 1 0-10.807 0 5.403 5.403 0 1 0 10.807 0Z"
        fill="#FBCC5C"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.597 13.965a7.369 7.369 0 1 1 14.737 0 7.369 7.369 0 0 1-14.737 0Zm12.773 0a5.403 5.403 0 1 0-10.807 0 5.403 5.403 0 1 0 10.807 0Z"
        fill="#35D07F"
      />
    </Svg>
  )
}
