import React, { FC } from 'react'

import Svg, { SvgProps, Path } from 'react-native-svg'

export const AVAXIcon: FC<SvgProps> = (props) => {
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.025 2.923c-.52-.897-1.347-.897-1.866 0L1.722 19.541c-.52.91-.095 1.63.945 1.63h4.736a3 3 0 0 0 2.338-1.37l5.705-9.886a3.104 3.104 0 0 0 0-2.704l-1.7-2.989-.721-1.299Zm6.272 10.937c-.52-.897-1.359-.897-1.878 0l-3.296 5.681c-.507.898-.082 1.63.945 1.63h6.52c1.04 0 1.464-.732.945-1.63l-3.236-5.68Z"
        fill="#E84142"
      />
    </Svg>
  )
}
