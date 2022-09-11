import React, { FC } from 'react'

import { useAppSelector } from '@hooks'
import { makeStyles, useTheme } from '@themes'
import { View, StatusBar as RNStatusBar } from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'

export type StatusBarProps = {
  statusColor?: string
}

export const StatusBar: FC<StatusBarProps> = (props) => {
  const { theme: themeStore } = useAppSelector((state) => state.root.theme)
  const styles = useStyles(props, themeStore)
  const theme = useTheme(themeStore)
  const { statusColor, children } = props

  return (
    <View
      {...children}
      style={[
        styles.root,
        {
          backgroundColor: statusColor || theme.colors.background,
        },
      ]}
    >
      <RNStatusBar
        translucent
        animated
        barStyle={themeStore === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={statusColor || theme.colors.background}
      />
    </View>
  )
}

const useStyles = makeStyles<StatusBarProps>()(({}) => ({
  root: {
    height: getStatusBarHeight(),
  },
}))
