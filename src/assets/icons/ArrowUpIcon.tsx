import React, { FC } from 'react'

import { useAppSelector } from '@hooks'
import { useTheme } from '@themes'
import Svg, { SvgProps, Path } from 'react-native-svg'

export const ArrowUpIcon: FC<SvgProps> = (props) => {
  const themeStore = useAppSelector((state) => state.root.theme.theme)
  const theme = useTheme(themeStore)
  return (
    <Svg
      width={17.774}
      height={9.637}
      viewBox="0 0 17.774 9.637"
      {...props}
      style={{ marginRight: theme.normalize(3)('horizontal') }}
    >
      <Path
        d="M1.061 8.576L8.887.75l7.826 7.826"
        fill="none"
        stroke={theme.colors.primary}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
    </Svg>
  )
}
