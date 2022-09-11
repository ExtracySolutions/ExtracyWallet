import React, { FC } from 'react'

import Svg, { SvgProps, Path } from 'react-native-svg'

export const ETHIcon: FC<SvgProps> = (props) => {
  const { width, height } = props
  return (
    <Svg
      viewBox="0 0 26 26"
      width={width}
      height={height}
      fill="none"
      {...props}
    >
      <Path
        d="M11.929 1.5v7.9l6.677 2.983L11.929 1.5Zm0 16.003v5.368l6.681-9.244-6.681 3.876Z"
        fill="#444346"
      />
      <Path
        d="M11.932 1.5v7.9l-6.677 2.983L11.932 1.5Zm0 16.003v5.368L5.25 13.627l6.682 3.876Z"
        fill="#9899A0"
      />
      <Path d="m11.929 16.26 6.677-3.876-6.677-2.982v6.859Z" fill="#09090B" />
      <Path d="m5.25 12.384 6.678 3.877V9.4L5.25 12.385Z" fill="#474749" />
    </Svg>
  )
}
