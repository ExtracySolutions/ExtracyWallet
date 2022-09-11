import React, { FC, useCallback, useState } from 'react'

import { BackupIcon } from '@assets/icons'
import {
  Button,
  CheckboxComponent,
  Container,
  Header,
  Screen,
} from '@components'
import { useAppSelector } from '@hooks'
import { makeStyles, useTheme } from '@themes'
import { useNavigation } from 'navigation/NavigationService'
import { View } from 'react-native'

type BackupProps = {}

export const Backup: FC<BackupProps> = ({ props, route }: any) => {
  const { routeName } = route.params

  const themeStore = useAppSelector((state) => state.root.theme.theme)
  const styles = useStyles(props, themeStore)
  const theme = useTheme(themeStore)
  const navigation = useNavigation()

  const [isCheck, setCheckBox] = useState<boolean>(false)

  const handleNavigateToImportWallet = useCallback(() => {
    navigation.navigate(routeName)
  }, [navigation, routeName])

  const handleToggleCheckBox = useCallback(
    () => setCheckBox(!isCheck),
    [isCheck],
  )

  return (
    <Container style={styles.rootBackup}>
      <Header title={'Backup Wallet'} />
      <View style={styles.bodyBackup}>
        <View style={styles.screen}>
          <Screen
            text={
              'In the next step you will see 12 words that will allow you to recover your wallet.'
            }
            image={<BackupIcon />}
          />
        </View>
        <CheckboxComponent
          containStyle={styles.bottomLayout}
          handleToggleCheckBox={handleToggleCheckBox}
          isCheck={isCheck}
          backgroundBox={theme.colors.primary}
          text="I understand that if I lose my recovery phrase, I will not be
        able to access my wallet."
        />

        <View style={styles.bottom}>
          <Button
            round
            disabled={!isCheck}
            text="Continue"
            fontWeight={'medium'}
            variant="fulfill"
            onPress={handleNavigateToImportWallet}
          />
        </View>
      </View>
    </Container>
  )
}

const useStyles = makeStyles<BackupProps>()(({ normalize, colors }) => ({
  rootBackup: {
    flex: 1,
    flexDirection: 'column',
  },
  bodyBackup: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.white,
  },
  bottomLayout: {
    flex: 0.8,
    justifyContent: 'flex-end',
    paddingHorizontal: normalize(15)('horizontal'),
  },
  screen: {
    flex: 4,
  },
  bottom: {
    paddingHorizontal: normalize(15)('horizontal'),
  },
}))
