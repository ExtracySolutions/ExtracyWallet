import React, { FC, useCallback } from 'react'

import { Text, Button } from '@components'
import { useAppSelector, useAppDispatch } from '@hooks'
import { makeStyles } from '@themes'
import { View } from 'react-native'
import { setProcessOnBoarding } from 'reduxs/reducers'

export type SetupBiometricProps = {}

export const SetupBiometric: FC<SetupBiometricProps> = (props) => {
  const themeStore = useAppSelector((state) => state.root.theme.theme)
  const styles = useStyles(props, themeStore)
  const dispatch = useAppDispatch()

  const handleSkip = useCallback(() => {
    dispatch(setProcessOnBoarding(false))
  }, [dispatch])
  return (
    <View style={styles.root}>
      <Text>Setup biomereic</Text>
      <Button text="Skip" onPress={handleSkip} />
    </View>
  )
}

const useStyles = makeStyles<SetupBiometricProps>()(({}) => ({
  root: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
}))
