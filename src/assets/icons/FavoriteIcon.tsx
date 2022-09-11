import React, { FC } from 'react'

import Svg, { SvgProps, Path, Rect } from 'react-native-svg'

export const FavoriteIcon: FC<SvgProps> = (props) => {
  return (
    <Svg width={32} height={32} fill="none" {...props}>
      <Rect x={0.5} y={0.5} width={31} height={31} rx={3.5} fill="#C6CFFE" />
      <Path fill="#94A4FF" d="M0 28h32v4H0z" />
      <Path fill="#94A4FF" d="M28 0h4v32h-4z" />
      <Path
        d="m15.37 20.984-.001-.001c-1.727-1.566-3.12-2.83-4.086-4.012-.962-1.175-1.45-2.209-1.45-3.304A3.131 3.131 0 0 1 13 10.5c1.008 0 1.984.472 2.619 1.217l.38.447.381-.447A3.493 3.493 0 0 1 19 10.5a3.131 3.131 0 0 1 3.166 3.167c0 1.095-.488 2.129-1.45 3.305-.966 1.183-2.359 2.448-4.085 4.017v.001l-.63.568-.631-.574Z"
        fill="#fff"
        stroke="#4C63E1"
      />
      <Path fill="#7388FF" d="M28 28h4v4h-4z" />
      <Rect x={0.5} y={0.5} width={31} height={31} rx={3.5} stroke="#7388FF" />
    </Svg>
  )
}
