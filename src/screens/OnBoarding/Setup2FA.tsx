import React, { FC, useCallback } from 'react'

import { Text, Button } from '@components'
import { useAppSelector } from '@hooks'
import { makeStyles } from '@themes'
import { useNavigation } from 'navigation/NavigationService'
import { View } from 'react-native'

export type Setup2FAProps = {}

export const Setup2FA: FC<Setup2FAProps> = (props) => {
  const themeStore = useAppSelector((state) => state.root.theme.theme)
  const styles = useStyles(props, themeStore)
  const navigation = useNavigation()

  const handleSkip = useCallback(() => {
    navigation.navigate('SetupPassword')
  }, [navigation])

  return (
    <View style={styles.root}>
      <Text>Setup2FA</Text>
      <Button text="Skip" onPress={handleSkip} />
    </View>
  )
}

const useStyles = makeStyles<Setup2FAProps>()(({}) => ({
  root: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
}))
