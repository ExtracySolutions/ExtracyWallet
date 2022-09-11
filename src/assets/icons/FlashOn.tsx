import React, { FC } from 'react'

import Svg, { Path, SvgProps } from 'react-native-svg'

export const FlashOn: FC<SvgProps> = (props) => {
  return (
    <Svg width={24} height={24} fill="none" {...props}>
      <Path d="M7 2v11h3v9l7-12h-4l4-8H7Z" fill="#fff" />
    </Svg>
  )
}
