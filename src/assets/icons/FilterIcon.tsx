import React, { FC } from 'react'

import Svg, { SvgProps, Path } from 'react-native-svg'

export const FilterIcon: FC<SvgProps> = (props) => {
  return (
    <Svg width={32} height={32} fill="none" {...props}>
      <Path
        d="M25.333 12a4 4 0 0 0-3.76 2.667H4a1.333 1.333 0 1 0 0 2.666h17.573A4 4 0 1 0 25.333 12Zm0 5.333a1.333 1.333 0 1 1 0-2.666 1.333 1.333 0 0 1 0 2.666ZM4 9.333h1.573a4 4 0 0 0 7.52 0H28a1.333 1.333 0 1 0 0-2.666H13.093a4 4 0 0 0-7.52 0H4a1.333 1.333 0 1 0 0 2.666Zm5.333-2.666a1.333 1.333 0 1 1 0 2.666 1.333 1.333 0 0 1 0-2.666Zm18.667 16h-9.573a4 4 0 0 0-7.52 0H4a1.333 1.333 0 1 0 0 2.666h6.907a4 4 0 0 0 7.52 0H28a1.333 1.333 0 0 0 0-2.666Zm-13.333 2.666a1.334 1.334 0 1 1 0-2.667 1.334 1.334 0 0 1 0 2.667Z"
        fill="#35C4BA"
      />
    </Svg>
  )
}