import React, { FC } from 'react'

import { useAppSelector } from '@hooks'
import { makeStyles } from '@themes'
import { DisconnectIcon } from 'assets'
import { Button, Container, Screen } from 'components'
import { useProvider } from 'provider'
import { View } from 'react-native'

export const Disconnection: FC = (props) => {
  const themeStore = useAppSelector((state) => state.root.theme.theme)

  const styles = useStyles(props, themeStore)
  const { handleNoInternet } = useProvider()
  return (
    <Container style={styles.rootBackup}>
      <Screen
        title={'No Internet Connection'}
        text={`You are not connected to the internet.\nMake sure Wi-Fi is on, Airplane Mode is off\n and try again.`}
        image={<DisconnectIcon />}
      />
      <View style={styles.bottom}>
        <Button
          round
          text="Retry"
          fontWeight={'medium'}
          variant="fulfill"
          onPress={handleNoInternet}
        />
      </View>
    </Container>
  )
}

const useStyles = makeStyles()(({ normalize, font, colors }) => ({
  root: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyWrapper: {
    marginVertical: normalize(25)('vertical'),
  },
  emptyText: {
    fontSize: font.size.button,
    color: colors.gray,
  },
  rootBackup: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.white,
  },

  bottom: {
    paddingHorizontal: normalize(15)('horizontal'),
  },
}))
