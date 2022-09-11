import React, { FC, useCallback } from 'react'

import { Text, Button } from '@components'
import { useAppSelector } from '@hooks'
import { makeStyles } from '@themes'
import { useNavigation } from 'navigation/NavigationService'
import { View } from 'react-native'

export type SetupPasswordProps = {}

export const SetupPassword: FC<SetupPasswordProps> = (props) => {
  const themeStore = useAppSelector((state) => state.root.theme.theme)
  const styles = useStyles(props, themeStore)
  const navigation = useNavigation()

  const handleSkip = useCallback(() => {
    navigation.navigate('SetupBiometric')
  }, [navigation])

  return (
    <View style={styles.root}>
      <Text>Setup password</Text>
      <Button text="Skip" onPress={handleSkip} />
    </View>
  )
}

const useStyles = makeStyles<SetupPasswordProps>()(({}) => ({
  root: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
}))
