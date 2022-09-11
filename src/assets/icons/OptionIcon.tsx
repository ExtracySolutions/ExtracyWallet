import React, { FC } from 'react'

import Svg, { SvgProps, Circle } from 'react-native-svg'

export const OptionIcon: FC<SvgProps> = (props) => {
  return (
    <Svg width={4} height={17} fill="none" {...props}>
      <Circle cx={2} cy={2} r={2} fill={props.color ?? '#C2C2C2'} />
      <Circle cx={2} cy={9} r={2} fill={props.color ?? '#C2C2C2'} />
      <Circle cx={2} cy={15} r={2} fill={props.color ?? '#C2C2C2'} />
    </Svg>
  )
}
