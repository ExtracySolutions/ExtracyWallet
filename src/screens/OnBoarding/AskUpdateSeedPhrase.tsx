import React, { FC, useCallback, useState } from 'react'

import { TextInput, Text, Button } from '@components'
import { useAppSelector, useBiometry, useAppDispatch } from '@hooks'
import { makeStyles } from '@themes'
import { clearAll } from '@ultils'
import Engine from 'core/Engine'
import Tkey, { TYPEOFLOGIN } from 'core/TKey'
import { useNavigation } from 'navigation/NavigationService'
import { useProvider } from 'provider'
import { View, TouchableOpacity } from 'react-native'
import { setProcessOnBoarding, setNotLogin } from 'reduxs/reducers'

export type AskUpdateSeedPhraseProps = {}

export const AskUpdateSeedPhrase: FC<AskUpdateSeedPhraseProps> = (props) => {
  const themeStore = useAppSelector((state) => state.root.theme.theme)
  const styles = useStyles(props, themeStore)
  const navigation = useNavigation()
  const dispatch = useAppDispatch()
  const [mnemonic, setMnemonic] = useState<string>('')
  const { handleCreateWallet, handleShowLockScreen, handleRemoveWallet } =
    useProvider()
  const {
    deleteKeychainPassword,
    biometryConfig,
    passwordConfig,
    BIOMETRY_KEYCHAIN_NAME,
    PASSWORD_KEYCHAIN_NAME,
  } = useBiometry()

  const [loading, setLoading] = useState<boolean>(false)

  const handleClearWallet = useCallback(async () => {
    handleRemoveWallet()
    await deleteKeychainPassword(biometryConfig, BIOMETRY_KEYCHAIN_NAME)
    await deleteKeychainPassword(passwordConfig, PASSWORD_KEYCHAIN_NAME)
    await Engine.resetState()
  }, [
    BIOMETRY_KEYCHAIN_NAME,
    PASSWORD_KEYCHAIN_NAME,
    biometryConfig,
    deleteKeychainPassword,
    handleRemoveWallet,
    passwordConfig,
  ])

  const handleImportMnemonic = useCallback(async () => {
    try {
      if (mnemonic) {
        console.log('mnemonic', mnemonic)

        setLoading(true)
        // user import seedphrase vào rồi mình update lại seedphrase ví
        await Tkey.context.importSeedPhraseTkey(mnemonic)

        console.log('[11]')

        // clear wallet cũ đi => tạo mới
        // await handleClearWallet()
        console.log('[21]')
        // tạo wallet mới
        await handleCreateWallet(String(mnemonic).toLowerCase(), '')
        console.log('[31]')

        dispatch(setNotLogin(false))
        await Tkey.context.setActiveUser()

        setLoading(false)
        navigation.navigate('Setup2FA')
      }
    } catch (error) {
      console.log('[handleImportMnemonic error]', error)
    }
  }, [dispatch, handleCreateWallet, mnemonic, navigation])

  const handleSkip = useCallback(async () => {
    setLoading(true)
    const mnemonic = await Tkey.context.getSeedPhrase()
    console.log('[2]', mnemonic)
    await handleCreateWallet(String(mnemonic).toLowerCase(), '')
    await Tkey.context.setActiveUser()
    dispatch(setNotLogin(false))
    setLoading(false)
    navigation.navigate('Setup2FA')
  }, [dispatch, handleCreateWallet, navigation])

  return (
    <View style={styles.root}>
      <Text>You have not registered on our system yet</Text>
      <Text>Import your seed phrase</Text>
      <TextInput
        value={mnemonic}
        onChangeText={setMnemonic}
        autoCapitalize={'none'}
        keyboardType="ascii-capable"
      />

      <Button
        loading={loading}
        variant="fulfill"
        text="Import"
        containerStyle={styles.btn}
        onPress={handleImportMnemonic}
      />
      <Text>
        Press skip if you dont have seedphrase, wallet will ramdom your
        seedphrase
      </Text>
      <Button
        loading={loading}
        variant="fulfill"
        text="Skip"
        containerStyle={styles.btn}
        onPress={handleSkip}
      />
    </View>
  )
}

const useStyles = makeStyles<AskUpdateSeedPhraseProps>()(({ normalize }) => ({
  root: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    paddingHorizontal: normalize(10)('moderate'),
  },
}))
