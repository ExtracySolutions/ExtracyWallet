import React, { FC } from 'react'

import Svg, { SvgProps, Path } from 'react-native-svg'

export const VerticalDotIcon: FC<SvgProps> = (props) => {
  const { color } = props
  return (
    <Svg
      preserveAspectRatio="xMaxYMid meet"
      viewBox="0 0 4 12"
      width={4}
      height={12}
      fill="none"
      {...props}
    >
      <Path
        d="M2 3.083c.801 0 1.458-.656 1.458-1.458C3.458.823 2.8.167 1.999.167S.541.823.541 1.625c0 .802.656 1.458 1.458 1.458Zm0 1.459C1.196 4.542.54 5.198.54 6c0 .802.656 1.458 1.458 1.458.802 0 1.459-.656 1.459-1.458 0-.802-.657-1.458-1.459-1.458Zm0 4.375c-.803 0-1.459.656-1.459 1.458 0 .802.656 1.458 1.458 1.458.802 0 1.459-.656 1.459-1.458 0-.802-.657-1.458-1.459-1.458Z"
        fill={color || '#323232'}
      />
    </Svg>
  )
}
