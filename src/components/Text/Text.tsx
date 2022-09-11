import React, { FC } from 'react'

import { useAppSelector } from '@hooks'
import { makeStyles } from '@themes'
import { fontFamily } from 'assets/fonts'
import { Text as RNText, TextProps as RNTextProps } from 'react-native'

export type TextProps = {
  variant?: 'bold' | 'medium' | 'regular' | 'light'
  underline?: boolean
  fontSize?: number
  lineHeight?: number
  isHighlight?: boolean
  textAlign?: 'auto' | 'left' | 'right' | 'center' | 'justify'
  color?: string
} & RNTextProps

export const Text: FC<TextProps> = (props) => {
  const themeStore = useAppSelector((state) => state.root.theme.theme)
  const styles = useStyles(props, themeStore)

  return (
    <RNText {...props} style={[styles.text, props.style]}>
      {props.children}
    </RNText>
  )
}

const useStyles = makeStyles<TextProps>()(({ normalize, colors, font }) => ({
  text: ({ variant, isHighlight, fontSize, lineHeight, color, textAlign }) => ({
    color: color ? color : isHighlight ? colors.primary50 : colors.text,
    fontSize: fontSize ? normalize(fontSize)('moderate') : font.size.s4,
    lineHeight: lineHeight
      ? normalize(lineHeight)('moderate')
      : font.lineHeight.lh4,
    fontFamily:
      variant === 'bold'
        ? fontFamily.bold
        : variant === 'regular'
        ? fontFamily.regular
        : variant === 'light'
        ? fontFamily.light
        : fontFamily.medium, // default is medium
    textAlign: textAlign ? textAlign : 'auto',
  }),
}))
