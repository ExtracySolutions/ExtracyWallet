import React, { FC } from 'react'

import Svg, { SvgProps, Path, Circle } from 'react-native-svg'

export const ReceivedFailedIcon: FC<SvgProps> = (props) => {
  return (
    <Svg width={38} height={38} fill="none" {...props}>
      <Circle opacity={0.1} cx={19} cy={19} r={19} fill="#F15223" />
      <Path
        d="M28.25 18.5a.875.875 0 0 0-.875.875V25.5h-15.75v-6.125a.875.875 0 1 0-1.75 0v7a.875.875 0 0 0 .875.875h17.5a.875.875 0 0 0 .875-.875v-7a.875.875 0 0 0-.875-.875Z"
        fill="#F15223"
        stroke="#F15223"
        strokeWidth={0.4}
      />
      <Path
        d="M19.5 9.75a.875.875 0 0 0-.875.875v10.138l-2.006-2.007a.873.873 0 0 0-1.44.277.876.876 0 0 0 .202.96l3.5 3.5a.873.873 0 0 0 .953.19.874.874 0 0 0 .285-.19l3.5-3.5a.875.875 0 0 0-1.238-1.237l-2.006 2.007V10.625a.875.875 0 0 0-.875-.875Z"
        fill="#F15223"
        stroke="#F15223"
        strokeWidth={0.4}
      />
    </Svg>
  )
}
