import React, { FC } from 'react'

import Svg, { SvgProps, Path, Rect, G, Defs } from 'react-native-svg'

export const ActionButtonIcon: FC<SvgProps> = (props) => {
  const { width, height } = props
  return width ? (
    <Svg
      preserveAspectRatio="xMaxYMid meet"
      viewBox="0 0 70 70"
      width={width}
      height={height}
      fill="none"
      {...props}
    >
      <G>
        <Rect x={12} y={10} width={44} height={44} rx={12} fill="#556EFA" />
        <Path
          d="M34 24v16M26 32h16"
          stroke="#fff"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
      <Defs />
    </Svg>
  ) : (
    <Svg width={68} height={68} fill="none" {...props}>
      <G>
        <Rect x={12} y={10} width={44} height={44} rx={12} fill="#556EFA" />
        <Path
          d="M34 24v16M26 32h16"
          stroke="#fff"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
      <Defs />
    </Svg>
  )
}
