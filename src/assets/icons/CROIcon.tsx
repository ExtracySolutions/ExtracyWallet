import React, { FC } from 'react'

import Svg, { SvgProps, Path } from 'react-native-svg'

export const CROIcon: FC<SvgProps> = (props) => {
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
        d="M17.016 21.97h-1.988l-2.38-2.297v-1.178l2.464-2.474v-3.918l3.22-2.209L22 12.81l-4.984 9.16Zm-8.232-6.185.364-3.682-1.204-3.299h7.112l-1.176 3.3.336 3.681H8.784Zm1.624 3.888L8.028 22H6.012L1 12.81l3.696-2.887 3.248 2.18v3.918l2.464 2.474v1.178ZM5.984 2h11.004l1.316 5.891H4.696L5.984 2Z"
        fill="#03316C"
      />
    </Svg>
  )
}
