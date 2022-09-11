import React, { FC, ReactNode, useCallback } from 'react'

import { ArrowLeftBack, Scan } from '@assets/icons'
import { useAppSelector } from '@hooks'
import { useNavigation } from '@react-navigation/native'
import { makeStyles, useTheme } from '@themes'
import {
  View,
  TouchableOpacity,
  Dimensions,
  GestureResponderEvent,
} from 'react-native'

import { Text } from '../Text'

export type HeaderProps = {
  title?: string
  headerComponent?: ReactNode
  rightComponent?: ReactNode
  disableBack?: boolean
  handleScan?: (event: GestureResponderEvent) => void
  handleBack?: (event: GestureResponderEvent) => void
}
const { width } = Dimensions.get('screen')
export const Header: FC<HeaderProps> = (props) => {
  const themeStore = useAppSelector((state) => state.root.theme.theme)
  const styles = useStyles(props, themeStore)
  const navigation = useNavigation()
  const { title, headerComponent, handleScan, disableBack, handleBack } = props
  const theme = useTheme(themeStore)
  const handleGoBack = useCallback(() => navigation.goBack(), [navigation])

  return (
    <View style={styles.root}>
      <TouchableOpacity
        style={styles.arrowLeftBack}
        onPress={handleBack ? handleBack : handleGoBack}
      >
        {disableBack ? null : (
          <ArrowLeftBack height={12} width={8} color={theme.colors.text} />
        )}
      </TouchableOpacity>
      {headerComponent
        ? headerComponent
        : title && (
            <Text
              variant="bold"
              style={styles.text}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {title}
            </Text>
          )}
      {handleScan ? (
        <TouchableOpacity style={styles.arrowRight} onPress={handleScan}>
          <Scan color={theme.colors.grey10} />
        </TouchableOpacity>
      ) : props.rightComponent ? (
        <View style={styles.rightComponent}>{props.rightComponent}</View>
      ) : (
        <View style={styles.arrowLeftBack} />
      )}
    </View>
  )
}

const useStyles = makeStyles<HeaderProps>()(({ colors, font, normalize }) => ({
  root: {
    width: width,
    height: normalize(50)('vertical'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background,
    zIndex: 100,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.separator,
  },
  arrowLeftBack: {
    width: normalize(50)('horizontal'),
    height: normalize(65)('horizontal'),
    paddingHorizontal: normalize(25)('horizontal'),
    alignSelf: 'center',
    justifyContent: 'center',
  },
  arrowRight: {
    right: normalize(20)('horizontal'),
    padding: normalize(20)('horizontal'),
    width: 30,
  },
  text: {
    textAlign: 'center',
    fontSize: font.size.title1,
    flex: 1,
  },
  rightComponent: {
    right: normalize(15)('horizontal'),
  },
  boxEmty: {
    height: normalize(20)('horizontal'),
    width: normalize(20)('horizontal'),
  },
}))
