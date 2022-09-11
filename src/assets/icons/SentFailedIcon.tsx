import React, { FC } from 'react'

import Svg, { SvgProps, Path, Circle } from 'react-native-svg'

export const SentFailedIcon: FC<SvgProps> = (props) => {
  return (
    <Svg
      preserveAspectRatio="xMaxYMid meet"
      viewBox="0 0 38 38"
      width={38}
      height={38}
      fill="none"
      {...props}
    >
      <Circle opacity={0.1} cx={19} cy={19} r={19} fill="#F15223" />
      <Path
        d="M27.247 9.833a.916.916 0 0 0-.285.049l-16.5 5.495a.917.917 0 0 0-.122 1.69L17.4 20.6l3.532 7.058a.917.917 0 0 0 1.693-.122L28.12 11.04a.917.917 0 0 0-.873-1.206Zm-1.45 2.369-4.215 12.655-2.383-4.759 3.202-3.2a.917.917 0 0 0-.67-1.577.917.917 0 0 0-.63.278L17.9 18.8l-4.76-2.381 12.657-4.217Z"
        fill="#F15223"
        stroke="#F15223"
        strokeWidth={0.1}
      />
    </Svg>
  )
}
