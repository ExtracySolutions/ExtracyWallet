import React, { FC } from 'react'

import Svg, { SvgProps, Path } from 'react-native-svg'

export const CopyIcon: FC<SvgProps> = (props) => {
  const { color } = props
  return (
    <Svg width={24} height={24} fill="none" {...props}>
      <Path
        d="M17.75 19H9.5V8.5h8.25V19Zm0-12H9.5A1.5 1.5 0 0 0 8 8.5V19a1.5 1.5 0 0 0 1.5 1.5h8.25a1.5 1.5 0 0 0 1.5-1.5V8.5a1.5 1.5 0 0 0-1.5-1.5ZM15.5 4h-9A1.5 1.5 0 0 0 5 5.5V16h1.5V5.5h9V4Z"
        fill={color}
      />
    </Svg>
  )
}
