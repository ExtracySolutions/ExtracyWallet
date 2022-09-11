import React, { FC } from 'react'

import Svg, { SvgProps, Path } from 'react-native-svg'

export const SwapIcon1: FC<SvgProps> = (props) => {
  const { color } = props
  return (
    <Svg
      preserveAspectRatio="xMaxYMid meet"
      viewBox="0 0 14 16"
      width={14}
      height={16}
      fill="none"
      {...props}
    >
      <Path
        d="M.513 8.315h1.62a.218.218 0 0 0 .217-.217V5.576c0-.63.508-1.137 1.135-1.137h6.574v1.706c0 .182.208.282.348.17l3.487-2.74a.216.216 0 0 0 0-.341L10.407.494a.215.215 0 0 0-.348.17v1.707H3.482A3.192 3.192 0 0 0 .295 5.57v2.522c0 .127.096.223.218.223Zm-.135 4.312 3.487 2.739c.14.111.348.01.348-.17V13.49h6.574a3.192 3.192 0 0 0 3.187-3.199V7.77a.218.218 0 0 0-.217-.218h-1.62a.218.218 0 0 0-.218.218v2.521c0 .63-.508 1.138-1.135 1.138h-6.57V9.722a.215.215 0 0 0-.349-.17L.378 12.291a.21.21 0 0 0 0 .336Z"
        fill={color || '#556EFA'}
      />
    </Svg>
  )
}
