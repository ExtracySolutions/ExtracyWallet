import React, { FC } from 'react'

import Svg, { SvgProps, Path } from 'react-native-svg'
export const BookmarkIcon: FC<SvgProps> = (props) => {
  const { color } = props
  return (
    <Svg width={18} height={24} fill="none" {...props}>
      <Path
        d="M2.42 24a2.15 2.15 0 0 1-2.152-2.153V2.103C.267.943 1.21 0 2.37 0h13.26c1.16 0 2.103.943 2.103 2.103v19.744a2.15 2.15 0 0 1-.953 1.787 2.15 2.15 0 0 1-2.016.205l-5.443-2.23a.841.841 0 0 0-.642 0l-5.443 2.23c-.264.108-.54.161-.817.161Zm12.878-1.465c.233.096.487.07.697-.07.209-.141.329-.366.329-.618V2.103a.694.694 0 0 0-.694-.694H2.37a.694.694 0 0 0-.694.694v19.744c0 .252.12.477.33.617.209.14.463.167.696.071l5.443-2.23a2.242 2.242 0 0 1 1.71 0l5.443 2.23Z"
        fill={color}
      />
    </Svg>
  )
}