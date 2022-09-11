import React, { FC } from 'react'

import Svg, { SvgProps, Path } from 'react-native-svg'

export const WalletIcon: FC<SvgProps> = (props) => {
  const { color } = props
  return (
    <Svg width={25} height={25} fill="none" {...props}>
      <Path fill="#fff" d="M.5.5h24v24H.5z" />
      <Path
        d="M22.5 19.5v-10a2 2 0 0 0-2-2h-16a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2ZM4.5 6.5v-1a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1M12.5 11.5v6M11.5 17.5h2M11.5 11.5h1"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path opacity={0.3} fill={color} d="M5 4.5h15v2H5z" />
    </Svg>
  )
}
