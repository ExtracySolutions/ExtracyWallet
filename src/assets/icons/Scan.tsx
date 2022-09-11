import React, { FC } from 'react'

// import { useAppSelector } from '@hooks'
// import { useTheme } from '@themes'
import Svg, { SvgProps, Path } from 'react-native-svg'

export const Scan: FC<SvgProps> = (props) => {
  // const themeStore = useAppSelector((state) => state.root.theme.theme)
  // const theme = useTheme(themeStore)
  const { color, width, height } = props
  const w = width ? width : 26
  const h = height ? height : 26
  return (
    <Svg width={w} height={h} fill="none" {...props}>
      <Path
        d="M22.75 8.667v-3.25a2.167 2.167 0 00-2.167-2.167h-3.25M8.667 3.25h-3.25A2.167 2.167 0 003.25 5.417v3.25M3.25 17.333v3.25a2.167 2.167 0 002.167 2.167h3.25M17.333 22.75h3.25a2.167 2.167 0 002.167-2.167v-3.25M3.25 13h19.5"
        stroke={color ? color : '#BABABA'}
        strokeWidth={2.167}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}
