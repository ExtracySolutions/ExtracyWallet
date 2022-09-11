import React, { FC } from 'react'

import Svg, { SvgProps, Path } from 'react-native-svg'

export const NextIcon: FC<SvgProps> = (props) => {
  const { color } = props
  return (
    <Svg width={10.07} height={16.454} viewBox="0 0 10.07 16.454" {...props}>
      <Path
        d="M1.058 15.396L9.32 8.227 1.058 1.058"
        fill="none"
        stroke={color ? color : '#BABABA'}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        data-name="icon/arrow-right"
      />
    </Svg>
  )
}
