import React from 'react'

import { DangerIcon } from 'assets'
import { Text } from 'components/Text'
import { useAppSelector } from 'hooks'
import { StyleProp, TextStyle, View, ViewStyle } from 'react-native'
import { makeStyles, useTheme } from 'themes'

export interface WarningMessageProps {
  type: 'error' | 'info' | 'warning'
  message: string
  style?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
  iconWrapperStyle?: StyleProp<ViewStyle>
}

export const WarningMessage = ({ ...props }: WarningMessageProps) => {
  const themeStore = useAppSelector((state) => state.root.theme.theme)
  const theme = useTheme(themeStore)
  const styles = useStyles()

  return (
    <View
      style={[
        props.type === 'error'
          ? styles.containerError
          : props.type === 'warning'
          ? styles.containerWarning
          : styles.containerInfo,
        props.style,
      ]}
    >
      {props.type.match(/warning|info/) && (
        <View style={[props.iconWrapperStyle]}>
          <DangerIcon
            color={
              props.type === 'warning'
                ? theme.colors.alert
                : theme.colors.primary
            }
          />
        </View>
      )}
      <Text
        variant="light"
        style={[
          props.type === 'error'
            ? styles.textError
            : props.type === 'warning'
            ? styles.textWarning
            : styles.textInfo,
          props.textStyle,
        ]}
      >
        {props.message}
      </Text>
    </View>
  )
}

const useStyles = makeStyles()(({ normalize, font, colors }) => ({
  containerInfo: {
    flexDirection: 'row',
    borderRadius: normalize(8)('moderate'),
    padding: normalize(6)('moderate'),
    backgroundColor: colors.primary0,
  },
  containerError: {
    flexDirection: 'row',
    borderRadius: normalize(8)('moderate'),
    padding: normalize(6)('moderate'),
    marginHorizontal: normalize(8)('horizontal'),
  },
  containerWarning: {
    flexDirection: 'row',
    borderRadius: normalize(8)('moderate'),
    padding: normalize(6)('moderate'),
    backgroundColor: colors.alertBG,
  },
  textInfo: {
    marginHorizontal: normalize(5)('horizontal'),
    fontSize: font.size.s4,
    color: colors.primary,
    flex: 1,
  },
  textError: {
    fontSize: font.size.s4,
    color: colors.alert,
    flex: 1,
  },
  textWarning: {
    marginHorizontal: normalize(5)('horizontal'),
    fontSize: font.size.s4,
    color: colors.alert,
    flex: 1,
  },
}))
