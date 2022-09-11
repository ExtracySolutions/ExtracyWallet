import React, { FC } from 'react'

import Svg, { SvgProps, Path, Circle } from 'react-native-svg'

export const ClearIcon: FC<SvgProps> = (props) => {
  return (
    <Svg width={16} height={16} fill="none" {...props}>
      <Circle cx={8} cy={8} r={8} fill="#F8F8FA" />
      <Path d="m4 12 8-8M12 12 4 4" stroke="#B9B9BD" />
    </Svg>
  )
}
