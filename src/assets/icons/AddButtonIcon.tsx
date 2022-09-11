import React, { FC } from 'react'

import Svg, { SvgProps, Path, Circle } from 'react-native-svg'

export const AddButtonIcon: FC<SvgProps> = (props) => {
  return (
    <Svg width={45} height={45} fill="none" {...props}>
      <Circle cx={22.5} cy={22.5} r={22.5} fill="#35C4BA" />
      <Path
        d="M22.5 12.188v20.624M12.188 22.5h20.624"
        stroke="#fff"
        strokeWidth={4.18}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}
