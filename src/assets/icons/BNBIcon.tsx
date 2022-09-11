import React, { FC } from 'react'

import Svg, { SvgProps, Path } from 'react-native-svg'

export const BNBIcon: FC<SvgProps> = (props) => {
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
        d="M15.274 12.728h.002l-2.547-2.547-1.882 1.882-.216.216-.446.446-.004.004.004.003 2.544 2.545 2.547-2.546v-.002l-.001-.001"
        fill="#F3BA2F"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.73 6.644l-4.314 4.313-2.509-2.51 6.822-6.822 6.825 6.824-2.51 2.51-4.315-4.315zM4.134 10.22l-2.51 2.51 2.51 2.51 2.51-2.51-2.51-2.51zm4.281 4.283l4.313 4.312 4.315-4.315 2.511 2.509-.001.001-6.825 6.824-6.822-6.822-.004-.004 2.513-2.506zm12.908-4.281l-2.51 2.51 2.51 2.509 2.51-2.51-2.51-2.51z"
        fill="#F3BA2F"
      />
    </Svg>
  )
}
