import * as React from 'react'

import Svg, { SvgProps, Path, Circle } from 'react-native-svg'

export const SearchAddTokenIcon: React.FC<SvgProps> = (props) => (
  <Svg width={24} height={24} fill="none" {...props}>
    <Circle cx={10} cy={10} r={7} stroke="#434343" strokeWidth={2} />
    <Path
      stroke="#434343"
      strokeWidth={2}
      strokeLinecap="round"
      d="M15.414 15 21 20.586"
    />
  </Svg>
)
