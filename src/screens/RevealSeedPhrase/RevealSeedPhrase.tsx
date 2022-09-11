import React, { useCallback, useEffect, useState } from 'react'

import { Header, Container, TextInput, Button, Text } from '@components'
import { useAppSelector, useBiometry } from '@hooks'
import Clipboard from '@react-native-clipboard/clipboard'
import AsyncStorage from '@react-native-community/async-storage'
import { StackActions } from '@react-navigation/native'
import { makeStyles, useTheme } from '@themes'
import { CopyIcon, DangerIcon, EyeClose, EyeVisble } from 'assets'
import Engine from 'core/Engine'
import { isEmpty, delay } from 'lodash'
import { useNavigation } from 'navigation/NavigationService'
import {
  View,
  Keyboard,
  TouchableOpacity,
  TouchableWithoutFeedback,
  BackHandler,
} from 'react-native'
import Snackbar from 'react-native-snackbar'
import { AsyncStorageKeys } from 'ultils'

export const RevealSeedPhrase = () => {
  const themeStore = useAppSelector((state) => state.root.theme.theme)
  const styles = useStyles({}, themeStore)
  const theme = useTheme(themeStore)
  const navigation = useNavigation()
  const {
    getKeychainPassword,
    biometryConfig,
    passwordConfig,
    BIOMETRY_KEYCHAIN_NAME,
    PASSWORD_KEYCHAIN_NAME,
  } = useBiometry()

  const [keychainPassword, setKeychainPassword] = useState('')
  const [seedPhrase, setSeedPhrase] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  const cleanUp = useCallback(() => {
    setKeychainPassword('')
    setPassword('')
    setSeedPhrase('')
  }, [])

  const handleClose = useCallback(() => {
    cleanUp()
    navigation.dispatch(StackActions.pop())
  }, [cleanUp, navigation])

  const handleCopyToClipBoard = useCallback((value: string) => {
    Clipboard.setString(value)
    Snackbar.show({
      text: 'Coppied!',
      duration: Snackbar.LENGTH_SHORT,
    })
  }, [])

  const handleCheckPassword = useCallback(() => {
    if (password === keychainPassword) {
      const seedPhrase =
        Engine.context.KeyringController?.exportSeedPhrase(password)
      if (seedPhrase) {
        setSeedPhrase(seedPhrase)
      }
    } else {
      setError(true)
      setTimeout(() => setError(false), 200)
    }
  }, [keychainPassword, password])

  const initiate = useCallback(async () => {
    const value = await AsyncStorage.getItem(AsyncStorageKeys.biometryEnabled)
    if (value && value === 'true') {
      const config = {
        ...biometryConfig,
        authenticationPrompt: {
          title: 'Authenticate to reveal seed phrase',
        },
      }
      const password = await getKeychainPassword(config, BIOMETRY_KEYCHAIN_NAME)
      console.log('Is password revealed:', password !== undefined)
      if (password) {
        const seedPhrase =
          Engine.context.KeyringController?.exportSeedPhrase(password)
        console.log('Is seedPhrase revealed:', seedPhrase !== undefined)
        if (seedPhrase) {
          setSeedPhrase(seedPhrase)
        }
      }
    } else {
      const password = await getKeychainPassword(
        passwordConfig,
        PASSWORD_KEYCHAIN_NAME,
      )
      if (password) {
        setKeychainPassword(password)
      }
    }
  }, [
    BIOMETRY_KEYCHAIN_NAME,
    PASSWORD_KEYCHAIN_NAME,
    biometryConfig,
    getKeychainPassword,
    passwordConfig,
  ])

  useEffect(() => {
    delay(() => initiate(), 200)
    BackHandler.addEventListener('hardwareBackPress', () => {
      handleClose()
      return true
    })

    return () => {
      cleanUp()
      BackHandler.removeEventListener('hardwareBackPress', () => undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Container>
      <Header title="Reveal Seed Phrase" />
      <View style={styles.container} onTouchStart={() => Keyboard.dismiss()}>
        {seedPhrase.length === 0 && (
          <>
            <TextInput
              labelText="Password"
              placeholder="Enter your password"
              selectionColor={theme.colors.primary}
              secureTextEntry={!showPassword}
              onChangeText={setPassword}
              suffixItem={
                <>
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.suffixWrapper}
                  >
                    <>
                      {showPassword && <EyeVisble />}
                      {!showPassword && <EyeClose />}
                    </>
                  </TouchableOpacity>
                </>
              }
              containerStyle={styles.textInput}
            />
            {error ? (
              <View style={styles.errorWrapper}>
                <DangerIcon />
                <Text style={styles.errorText}>
                  Password is not correct, please try again
                </Text>
              </View>
            ) : (
              <View style={styles.errorText} />
            )}
            <View style={styles.seedPhraseDescriptionWrapper}>
              <View style={styles.seedPhraseDescriptionIcon}>
                <DangerIcon
                  color={theme.colors.primary}
                  width={20}
                  height={20}
                />
              </View>
              <Text style={styles.seedPhraseDescription}>
                If you ever change browsers or move computers, you will need
                this Secret Recovery Phrase to access your accounts. Save them
                somewhere safe and secret.
              </Text>
            </View>
            <Button
              text="Continue"
              onPress={handleCheckPassword}
              containerStyle={
                isEmpty(password) ? styles.buttonDisabled : styles.button
              }
              textStyle={
                isEmpty(password) ? styles.buttonText : styles.buttonTextEnabled
              }
              disabled={isEmpty(password)}
            />
          </>
        )}
        {seedPhrase.length > 0 && (
          <>
            <View style={styles.seedPhraseWrapper}>
              <Text style={styles.seedPhraseText}>{seedPhrase}</Text>
              <TouchableWithoutFeedback
                onPress={() => handleCopyToClipBoard(seedPhrase)}
              >
                <View style={styles.seedPhraseCopyButton}>
                  <CopyIcon color={theme.colors.primary} />
                  <Text
                    variant="medium"
                    fontSize={theme.font.size.s4}
                    style={styles.seedPhraseCopyText}
                  >
                    Copy
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
            <View style={styles.warningWrapper}>
              <DangerIcon />
              <Text style={styles.warningText}>
                DO NOT share this phrase with anyone! These words can be used to
                steal all your accounts
              </Text>
            </View>
            <Button
              text="Done"
              onPress={handleClose}
              textStyle={styles.buttonTextEnabled}
              containerStyle={styles.button}
            />
          </>
        )}
      </View>
    </Container>
  )
}

const useStyles = makeStyles()(({ normalize, font, colors }) => ({
  errorWrapper: {
    marginTop: normalize(5)('vertical'),
    paddingLeft: normalize(5)('horizontal'),
    borderRadius: normalize(8)('moderate'),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.alertBG,
  },
  errorText: {
    color: colors.alert,
    marginLeft: normalize(5)('horizontal'),
    fontSize: font.size.s4,
  },
  container: {
    flex: 1,
    paddingHorizontal: normalize(16)('horizontal'),
    paddingTop: normalize(24)('vertical'),
  },
  warningWrapper: {
    flexDirection: 'row',
    paddingHorizontal: normalize(12)('horizontal'),
    paddingVertical: normalize(12)('vertical'),
    borderRadius: normalize(8)('moderate'),
    marginTop: normalize(10)('vertical'),
    backgroundColor: colors.alertBG,
    marginBottom: 'auto',
  },
  warningText: {
    marginHorizontal: normalize(7)('horizontal'),
    color: colors.alert,
    fontSize: font.size.s4,
    lineHeight: normalize(18)('vertical'),
  },
  suffixWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: normalize(20)('horizontal'),
  },
  seedPhraseText: {
    lineHeight: normalize(20)('vertical'),
    fontSize: font.size.s3,
    color: colors.grey4,
    alignSelf: 'flex-start',
  },
  seedPhraseWrapper: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    borderRadius: normalize(8)('moderate'),
    paddingHorizontal: normalize(12)('vertical'),
    paddingTop: normalize(16)('vertical'),
    paddingBottom: normalize(8)('vertical'),
    backgroundColor: colors.primary0,
    borderColor: colors.primary15,
    borderWidth: 1,
  },
  seedPhraseCopyButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: normalize(48)('vertical'),
  },
  seedPhraseCopyText: {
    color: colors.primary,
    marginLeft: normalize(4)('horizontal'),
  },
  seedPhraseDescriptionWrapper: {
    flexDirection: 'row',
    marginTop: 'auto',
    marginBottom: normalize(16)('vertical'),
    paddingHorizontal: normalize(6)('horizontal'),
    paddingVertical: normalize(7)('vertical'),
    backgroundColor: colors.primary0,
    borderRadius: normalize(8)('moderate'),
  },
  seedPhraseDescription: {
    flexDirection: 'row',
    lineHeight: normalize(18)('vertical'),
    fontSize: font.size.s4,
    color: colors.primary,
    paddingRight: normalize(20)('horizontal'),
  },
  seedPhraseDescriptionIcon: {
    marginRight: normalize(3)('horizontal'),
    alignItems: 'center',
  },
  buttonText: {
    fontSize: font.size.s3,
    color: colors.grey10,
  },
  buttonTextEnabled: {
    fontSize: font.size.s3,
    color: colors.white,
  },
  button: {
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: normalize(45)('vertical'),
    borderRadius: normalize(10)('moderate'),
    marginBottom: 0,
  },
  buttonDisabled: {
    backgroundColor: colors.grey12,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: normalize(45)('vertical'),
    borderRadius: normalize(10)('moderate'),
    marginBottom: 0,
  },
  textInput: {
    marginBottom: normalize(10)('vertical'),
    marginTop: normalize(16)('vertical'),
  },
}))
