import React, { FC } from 'react'

import { Text } from '@components'
import { useAppSelector } from '@hooks'
import { makeStyles } from '@themes'
import { View, ViewStyle } from 'react-native'

export type ScreenProps = {
  titleSub?: string
  title?: string
  text?: string
  image?: React.ReactNode
  titleStyle?: ViewStyle
  textStyle?: ViewStyle
  boxTitleStyle?: ViewStyle
  groupTextStyle?: ViewStyle
  imageStyle?: ViewStyle
}

export const Screen: FC<ScreenProps> = (props) => {
  const {
    title,
    text,
    image,
    titleSub,
    titleStyle,
    textStyle,
    boxTitleStyle,
    groupTextStyle,
    imageStyle,
  } = props

  const themeStore = useAppSelector((state) => state.root.theme.theme)
  const styles = useStyles(props, themeStore)

  return (
    <View style={styles.container}>
      {title && (
        <View style={[styles.boxTitle, boxTitleStyle && boxTitleStyle]}>
          <Text
            style={[styles.title, titleStyle ? titleStyle : null]}
            variant="bold"
          >
            {title}
          </Text>
        </View>
      )}
      <View style={[styles.body, imageStyle && imageStyle]}>{image}</View>
      <View style={[styles.groupText, groupTextStyle && groupTextStyle]}>
        {titleSub && (
          <Text
            style={[styles.title, titleStyle ? titleStyle : null]}
            variant="bold"
          >
            {titleSub}
          </Text>
        )}
        {text && (
          <Text style={[styles.text, textStyle ? textStyle : null]}>
            {text}
          </Text>
        )}
      </View>
    </View>
  )
}
const useStyles = makeStyles<ScreenProps>()(({ normalize, font }) => ({
  root: {
    flex: 1,
  },
  container: {
    flex: 3,
    marginHorizontal: normalize(20)('horizontal'),
  },
  title: {
    textAlign: 'center',
    fontSize: font.size.s1,
    lineHeight: font.lineHeight.lh1,
  },
  text: {
    marginTop: normalize(5)('vertical'),
    textAlign: 'center',
  },
  body: {
    width: '100%',
    paddingRight: normalize(10)('horizontal'),
    alignItems: 'center',
  },
  boxText: {
    flex: 1,
  },
  groupText: {
    flex: 1,
  },
  boxTitle: {
    flex: 1,
  },
}))
