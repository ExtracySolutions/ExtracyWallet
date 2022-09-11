import * as React from 'react'

import Svg, { SvgProps, Path } from 'react-native-svg'

export const QRIcon: React.FC<SvgProps> = (props) => (
  <Svg width={24} height={24} fill="none" {...props}>
    <Path
      d="M3 7V5a2 2 0 0 1 2-2h5M3 17v2a2 2 0 0 0 2 2h5M3 12h19M22 7V5a2 2 0 0 0-2-2h-5M22 17v2a2 2 0 0 1-2 2h-5"
      stroke="#ACADB0"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
)
