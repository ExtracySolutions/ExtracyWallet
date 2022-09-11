import React, { FC } from 'react'

import Svg, { SvgProps, G, Path } from 'react-native-svg'

export const ToastCancelIcon: FC<SvgProps> = (props) => {
  const { color } = props
  return (
    <Svg
      preserveAspectRatio="xMaxYMid meet"
      viewBox="0 0 37 37"
      data-name="list/mb-list-item/item-left"
      width={37}
      height={37}
      {...props}
    >
      <G data-name="icon/icon-wrapper">
        <G
          data-name="icon/error"
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
        >
          <Path d="M20 5A15 15 0 119.393 9.393 15 15 0 0120 5z" />
          <Path
            data-name="Vector"
            d="M20 20.833V12.5M19.998 26.667a.415.415 0 10.16.031.417.417 0 00-.16-.031z"
          />
        </G>
      </G>
    </Svg>
  )
}
