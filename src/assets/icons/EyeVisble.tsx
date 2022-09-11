import React, { FC } from 'react'

import Svg, { SvgProps, Path } from 'react-native-svg'

export const EyeVisble: FC<SvgProps> = (props) => {
  const { width, height, color } = props
  return (
    <Svg
      viewBox="0 0 24 24"
      width={width ? width : 24}
      height={height ? height : 24}
      fill="none"
      {...props}
    >
      <Path
        d="M12 6a9.77 9.77 0 0 1 8.82 5.5A9.77 9.77 0 0 1 12 17a9.77 9.77 0 0 1-8.82-5.5A9.77 9.77 0 0 1 12 6Zm0-2C7 4 2.73 7.11 1 11.5 2.73 15.89 7 19 12 19s9.27-3.11 11-7.5C21.27 7.11 17 4 12 4Zm0 5a2.5 2.5 0 0 1 0 5 2.5 2.5 0 0 1 0-5Zm0-2c-2.48 0-4.5 2.02-4.5 4.5S9.52 16 12 16s4.5-2.02 4.5-4.5S14.48 7 12 7Z"
        fill={color ?? '#8FA2B7'}
      />
    </Svg>
  )
}
