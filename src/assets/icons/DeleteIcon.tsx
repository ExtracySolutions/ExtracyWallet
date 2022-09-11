import React, { FC } from 'react'

import Svg, { SvgProps, Path } from 'react-native-svg'

export const DeleteIcon: FC<SvgProps> = (props) => {
  return (
    <Svg width={20} height={20} fill="none" {...props}>
      <Path
        d="M10 0C4.473 0 0 4.473 0 10s4.473 10 10 10 10-4.473 10-10S15.527 0 10 0zm3.66 11.795a1.319 1.319 0 11-1.865 1.865L10 11.865 8.205 13.66a1.315 1.315 0 01-1.865 0 1.319 1.319 0 010-1.865L8.135 10 6.34 8.205A1.319 1.319 0 018.205 6.34L10 8.135l1.795-1.795a1.319 1.319 0 111.865 1.865L11.865 10l1.795 1.795z"
        fill="#BABABA"
      />
    </Svg>
  )
}
