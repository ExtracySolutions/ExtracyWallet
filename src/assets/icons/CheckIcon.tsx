import React, { FC } from 'react'

import Svg, { SvgProps, Path } from 'react-native-svg'

export const CheckIcon: FC<SvgProps> = (props) => {
  const { width, height } = props
  return (
    <Svg
      viewBox="0 0 18 18"
      width={width ? width : 18}
      height={height ? height : 13}
      fill="none"
      {...props}
    >
      <Path
        d="M6 10.2L2.5 6.7a.984.984 0 00-1.4 0 .984.984 0 000 1.4l4.19 4.19c.39.39 1.02.39 1.41 0L17.3 1.7a.985.985 0 000-1.4.983.983 0 00-1.4 0L6 10.2z"
        fill={props.color ?? '#35C4BA'}
      />
    </Svg>
  )
}
