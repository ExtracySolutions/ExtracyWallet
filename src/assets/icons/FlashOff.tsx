import React, { FC } from 'react'

import Svg, { Path, SvgProps } from 'react-native-svg'

export const FlashOff: FC<SvgProps> = (props) => {
  return (
    <Svg width={24} height={24} fill="none" {...props}>
      <Path
        d="M17 10h-4l4-8H7v2.18l8.46 8.46M3.27 3 2 4.27l5 5V13h3v9l3.58-6.14L17.73 20 19 18.73 3.27 3Z"
        fill="#fff"
      />
    </Svg>
  )
}
