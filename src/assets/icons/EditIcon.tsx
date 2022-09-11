import React, { FC } from 'react'

import Svg, { SvgProps, Path } from 'react-native-svg'

export const EditIcon: FC<SvgProps> = (props) => {
  const { color } = props
  return (
    <Svg width={24} height={24} fill="none" {...props}>
      <Path
        d="m14.414 8.646-.354-.354-.354.355-9.06 9.08-.146.146V19.5h1.627l.146-.146 9.08-9.06.354-.354-.353-.354-.94-.94Zm5.942-2.662.01.009c.177.168.19.493-.01.693L18.88 8.163 15.837 5.12l1.477-1.476a.5.5 0 0 1 .702 0l2.34 2.34ZM3.5 17.457l10.56-10.56 3.043 3.043L6.543 20.5H3.5v-3.043Z"
        fill={color ? color : '#ACADB0'}
        stroke={color ? color : '#ACADB0'}
      />
    </Svg>
  )
}
