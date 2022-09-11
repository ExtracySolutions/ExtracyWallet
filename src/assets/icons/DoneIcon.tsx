import React, { FC } from 'react'

import Svg, { SvgProps, Path, Circle } from 'react-native-svg'

export const DoneIcon: FC<SvgProps> = (props) => {
  return (
    <Svg width={42} height={42} fill="none" {...props}>
      <Circle
        cx={21}
        cy={21}
        r={19.929}
        fill="#fff"
        stroke="#35C4BA"
        strokeWidth={2.141}
      />
      <Path
        d="m17.595 27.13-4.636-4.635a1.303 1.303 0 0 0-1.854 0 1.304 1.304 0 0 0 0 1.854l5.55 5.549c.516.516 1.35.516 1.867 0l14.037-14.025a1.304 1.304 0 0 0 0-1.854 1.303 1.303 0 0 0-1.854 0l-13.11 13.11Z"
        fill="#35C4BA"
      />
    </Svg>
  )
}
