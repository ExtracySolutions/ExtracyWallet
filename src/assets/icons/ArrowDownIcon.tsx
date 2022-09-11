import React, { FC } from 'react'

import { useAppSelector } from '@hooks'
import { useTheme } from '@themes'
import Svg, { SvgProps, Path } from 'react-native-svg'

export const ArrowDownIcon: FC<SvgProps> = (props) => {
  const themeStore = useAppSelector((state) => state.root.theme.theme)
  const theme = useTheme(themeStore)
  return (
    <Svg
      width={17.773}
      height={9.645}
      viewBox="0 0 17.773 9.645"
      {...props}
      style={{ marginRight: theme.normalize(3)('horizontal') }}
    >
      <Path
        d="M1.061 1.061l3.261 3.261 3.587 3.587.978.978 7.826-7.826"
        fill="none"
        stroke={props.color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
    </Svg>
  )
}
