import React, { FC } from 'react'

import Svg, { SvgProps, Path, Circle } from 'react-native-svg'

export const VNDIcon: FC<SvgProps> = (props) => {
  return (
    <Svg width={36} height={36} fill="none" {...props}>
      <Circle cx={18} cy={18} r={18} fill="#EB4545" />
      <Path
        d="M16.599 23.207c2.025 0 2.938-1.204 3.375-2.063h.168V23h2.731V10.336h1.45V8.58h-1.45V7.29H20.09v1.29h-3.114v1.756h3.114v2.83h-.115c-.422-.85-1.289-2.101-3.367-2.101-2.724 0-4.864 2.132-4.864 6.06 0 3.88 2.08 6.082 4.856 6.082Zm.774-2.278c-1.833 0-2.8-1.61-2.8-3.82 0-2.194.952-3.766 2.8-3.766 1.788 0 2.77 1.48 2.77 3.766s-.998 3.82-2.77 3.82ZM10.8 27.341h13.615v1.864H10.8v-1.863Z"
        fill="#FFD264"
      />
    </Svg>
  )
}
