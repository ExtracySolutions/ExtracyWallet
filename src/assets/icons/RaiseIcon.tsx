import React, { FC } from 'react'

import Svg, { SvgProps, Path } from 'react-native-svg'
export const RaiseIcon: FC<SvgProps> = (props) => {
  return (
    <Svg width={10} height={5} fill="none" {...props}>
      <Path
        d="M4.646.349.854 4.142a.5.5 0 0 0 .353.853h7.586a.5.5 0 0 0 .353-.853L5.354.349a.5.5 0 0 0-.708 0Z"
        fill="#29BF6F"
      />
    </Svg>
  )
}
