import React, { useCallback, useEffect, useState } from 'react'

import AsyncStorage from '@react-native-community/async-storage'
import {
  AppLogoWithTextIcon,
  DangerIcon,
  EyeClose,
  EyeVisble,
  FaceIdIcon,
  FingerprintIcon,
} from 'assets'
import { Container, TextInput } from 'components'
import Engine from 'core/Engine'
import { useAppDispatch, useAppSelector, useBiometry } from 'hooks'
import { isEmpty, delay } from 'lodash'
import { useProvider } from 'provider'
import { Keyboard, Modal, Text, View, TouchableOpacity } from 'react-native'
import { BIOMETRY_TYPE } from 'react-native-keychain'
import { closeAllTab } from 'reduxs/reducers'
import { makeStyles, useTheme } from 'themes'
import { AsyncStorageKeys, clearAll } from 'ultils'

export const InputPassword = () => {
  const themeStore = useAppSelector((state) => state.root.theme.theme)
  const theme = useTheme(themeStore)
  const styles = useStyles()
  const { handleShowLockScreen, handleRemoveWallet } = useProvider()
  const {
    getKeychainPassword,
    getFaceIdPermission,
    getSupportedBiometryType,
    deleteKeychainPassword,
    biometryConfig,
    passwordConfig,
    PASSWORD_KEYCHAIN_NAME,
    BIOMETRY_KEYCHAIN_NAME,
  } = useBiometry()
  const dispatch = useAppDispatch()

  const [password, setPassword] = useState('')
  const [keychainPassword, setKeychainPassword] = useState('')
  const [biometryEnabled, setBiometryEnabled] = useState(false)
  const [biometryType, setBiometryType] = useState<string | undefined>(
    undefined,
  )
  const [passwordHidden, setPasswordHidden] = useState(false)
  const [showInputPassword, setShowInputPassword] = useState(false)
  const [error, setError] = useState(false)
  const [showAlert, setShowAlert] = useState(false)

  const initiate = useCallback(async () => {
    const biometryType = await getSupportedBiometryType()
    const faceIdPermission = await getFaceIdPermission()
    const enabledBiometry = await AsyncStorage.getItem(
      AsyncStorageKeys.biometryEnabled,
    )
    const password = await getKeychainPassword(
      passwordConfig,
      PASSWORD_KEYCHAIN_NAME,
    )
    if (password) {
      setKeychainPassword(password)
    }

    if (faceIdPermission === 'granted') {
      setBiometryType(biometryType)
    }
    if (enabledBiometry === 'true') {
      const config = {
        ...biometryConfig,
        authenticationPrompt: {
          title: 'Authenticate to access your wallet',
        },
      }
      setBiometryEnabled(true)
      const password = await getKeychainPassword(config, BIOMETRY_KEYCHAIN_NAME)
      if (password) {
        handleShowLockScreen(false)
      } else {
        setShowInputPassword(true)
      }
    } else {
      setBiometryEnabled(false)
      setShowInputPassword(true)
    }
  }, [
    BIOMETRY_KEYCHAIN_NAME,
    PASSWORD_KEYCHAIN_NAME,
    biometryConfig,
    getFaceIdPermission,
    getKeychainPassword,
    getSupportedBiometryType,
    handleShowLockScreen,
    passwordConfig,
  ])

  useEffect(() => {
    delay(() => initiate(), 200)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const checkPassword = () => {
    if (password === keychainPassword) {
      handleShowLockScreen(false)
    } else {
      setError(true)
      setTimeout(() => setError(false), 2000)
    }
  }

  const handleSuffixButtonTapped = useCallback(() => {
    if (biometryEnabled && biometryType) {
      getKeychainPassword(biometryConfig, BIOMETRY_KEYCHAIN_NAME).then(
        (password) => {
          if (password) {
            handleShowLockScreen(false)
          } else {
            setShowInputPassword(true)
          }
        },
      )
    } else {
      setPasswordHidden(!passwordHidden)
    }
  }, [
    BIOMETRY_KEYCHAIN_NAME,
    biometryConfig,
    biometryEnabled,
    biometryType,
    getKeychainPassword,
    handleShowLockScreen,
    passwordHidden,
  ])

  const renderSuffixButton = useCallback(() => {
    if (biometryEnabled && biometryType) {
      return (
        <TouchableOpacity
          onPress={() => handleSuffixButtonTapped()}
          style={styles.suffixWrapper}
        >
          <>
            {(biometryType === BIOMETRY_TYPE.FACE ||
              biometryType === BIOMETRY_TYPE.FACE_ID ||
              biometryType === BIOMETRY_TYPE.IRIS) && (
              <FaceIdIcon
                width={theme.normalize(25)('horizontal')}
                height={theme.normalize(25)('vertical')}
                color={theme.colors.grey10}
              />
            )}
            {(biometryType === BIOMETRY_TYPE.FINGERPRINT ||
              biometryType === BIOMETRY_TYPE.TOUCH_ID) && (
              <FingerprintIcon
                width={theme.normalize(25)('horizontal')}
                height={theme.normalize(25)('vertical')}
                color={theme.colors.grey10}
              />
            )}
          </>
        </TouchableOpacity>
      )
    }
    return (
      <TouchableOpacity
        onPress={() => handleSuffixButtonTapped()}
        style={styles.suffixWrapper}
      >
        <>
          {!passwordHidden && (
            <EyeClose
              width={theme.normalize(23)('horizontal')}
              height={theme.normalize(23)('vertical')}
              color={theme.colors.grey10}
            />
          )}
          {passwordHidden && (
            <EyeVisble
              width={theme.normalize(23)('horizontal')}
              height={theme.normalize(23)('vertical')}
              color={theme.colors.grey10}
            />
          )}
        </>
      </TouchableOpacity>
    )
  }, [
    biometryEnabled,
    biometryType,
    handleSuffixButtonTapped,
    passwordHidden,
    styles.suffixWrapper,
    theme,
  ])

  const removeWallet = useCallback(async () => {
    setShowAlert(false)
    handleRemoveWallet()
    const { KeyringController } = Engine.context
    dispatch(closeAllTab())
    await KeyringController?.setLocked()
    await clearAll()
    await deleteKeychainPassword(biometryConfig, BIOMETRY_KEYCHAIN_NAME)
    await deleteKeychainPassword(passwordConfig, PASSWORD_KEYCHAIN_NAME)
    await Engine.resetState()
  }, [
    BIOMETRY_KEYCHAIN_NAME,
    PASSWORD_KEYCHAIN_NAME,
    biometryConfig,
    deleteKeychainPassword,
    dispatch,
    handleRemoveWallet,
    passwordConfig,
  ])

  return (
    <Container
      style={
        showInputPassword
          ? styles.containerWrapperWhite
          : styles.containerWrapper
      }
      statusColor={
        showInputPassword ? theme.colors.white : theme.colors.primary
      }
    >
      {showInputPassword && (
        <View style={styles.container} onTouchStart={() => Keyboard.dismiss()}>
          <View style={styles.content}>
            <View style={styles.iconWrapper}>
              <AppLogoWithTextIcon />
            </View>
            <TextInput
              biometryEnabled={biometryEnabled}
              labelText="Enter password"
              placeholder="Enter your password"
              selectionColor={theme.colors.primary}
              secureTextEntry={!passwordHidden}
              onChangeText={setPassword}
              suffixItem={renderSuffixButton()}
              containerStyle={styles.newPasswordTextInput}
            />

            {error ? (
              <View style={styles.errorWrapper}>
                <DangerIcon />
                <Text style={styles.errorText}>Password incorrect</Text>
              </View>
            ) : (
              <View style={styles.errorWrapper} />
            )}
            <Text style={styles.description1}>Can not unlock?</Text>
            <Text style={styles.description2}>
              You can REMOVE your current wallet and setup a new one
            </Text>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={() => {
                setShowAlert(true)
              }}
            >
              <Text style={styles.resetButtonText}>Remove Wallet</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => checkPassword()}
            style={isEmpty(password) ? styles.buttonDisabled : styles.button}
            disabled={isEmpty(password)}
          >
            <Text
              style={
                !isEmpty(password)
                  ? styles.buttonTextEnabled
                  : styles.buttonText
              }
            >
              Unlock
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <Modal
        visible={showAlert}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAlert(!showAlert)}
      >
        <TouchableOpacity
          onPress={() => setShowAlert(false)}
          style={styles.alertWrapper}
        >
          <View style={styles.alert}>
            <View style={styles.typographyWrapper}>
              <View style={styles.alertTitleWrapper}>
                <Text style={styles.alertTitle}>Warning</Text>
              </View>
              <View style={styles.alertDescriptionWrapper}>
                <Text style={styles.alertDescription}>
                  Are you sure you want to REMOVE your current wallet
                </Text>
              </View>
            </View>
            <View style={styles.alertButtonsWrapper}>
              <TouchableOpacity
                onPress={() => setShowAlert(false)}
                style={styles.alertButtonWrapper}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <View style={styles.buttonSeparator} />
              <TouchableOpacity
                style={styles.alertButtonWrapper}
                onPress={() => removeWallet()}
              >
                <Text style={styles.proceedButtonText}>Proceed</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </Container>
  )
}

const useStyles = makeStyles()(({ normalize, colors, font }) => ({
  containerWrapper: {
    backgroundColor: colors.primary,
    flex: 1,
  },
  containerWrapperWhite: {
    backgroundColor: colors.white,
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: normalize(15)('horizontal'),
    paddingBottom: normalize(10)('vertical'),
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    paddingTop: normalize(100)('vertical'),
  },
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontWeight: '500',
    fontSize: font.size.s1,
    marginTop: normalize(10)('vertical'),
    marginBottom: normalize(30)('vertical'),
  },
  passwordInput: {
    marginVertical: normalize(10)('vertical'),
    borderColor: colors.grey12,
  },
  passwordInputError: {
    marginVertical: normalize(10)('vertical'),
    borderColor: colors.alert,
  },
  description1: {
    color: colors.grey4,
    fontSize: font.size.s4,
    marginTop: normalize(20)('vertical'),
    textAlign: 'center',
  },
  description2: {
    color: colors.grey4,
    fontSize: font.size.s4,
    marginTop: normalize(5)('vertical'),
    textAlign: 'center',
    paddingHorizontal: normalize(55)('horizontal'),
  },
  errorWrapper: {
    flexDirection: 'row',
    marginLeft: normalize(5)('horizontal'),
    minHeight: normalize(15)('vertical'),
  },
  errorText: {
    color: colors.alert,
    fontSize: font.size.s4,
    marginLeft: normalize(5)('horizontal'),
  },
  resetButtonText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: font.size.s4,
  },
  resetButton: {
    alignSelf: 'center',
    marginTop: normalize(15)('vertical'),
  },
  buttonDisabled: {
    backgroundColor: colors.grey13,
    height: normalize(45)('vertical'),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: normalize(10)('moderate'),
    marginTop: 'auto',
    marginBottom: 0,
  },
  button: {
    backgroundColor: colors.primary,
    height: normalize(45)('vertical'),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: normalize(10)('moderate'),
    marginTop: 'auto',
    marginBottom: 0,
  },
  buttonText: {
    color: colors.grey11,
    fontWeight: '500',
    fontSize: font.size.s3,
  },
  buttonTextEnabled: {
    color: colors.white,
    fontWeight: '500',
    fontSize: font.size.s3,
  },
  alertButtonWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  alertTitleWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    height: normalize(50)('vertical'),
    borderBottomColor: colors.grey12,
    borderBottomWidth: normalize(1)('vertical'),
    width: '100%',
  },
  alertDescriptionWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: normalize(0)('vertical'),
    marginHorizontal: normalize(20)('horizontal'),
    flex: 1,
  },
  alertTitle: {
    fontSize: font.size.s2,
    textAlign: 'center',
    fontWeight: '700',
  },
  alertDescription: {
    fontSize: font.size.s3,
    textAlign: 'center',
  },
  proceedButtonText: {
    fontSize: font.size.s3,
    textAlign: 'center',
    color: colors.alert,
    fontWeight: '500',
  },
  typographyWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  cancelButtonText: {
    fontWeight: '700',
    fontSize: font.size.s3,
    color: colors.grey10,
    textAlign: 'center',
  },
  alertWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.black + 'BB',
    height: '100%',
  },
  alert: {
    width: normalize(250)('horizontal'),
    height: normalize(150)('vertical'),
    backgroundColor: colors.white,
    borderRadius: normalize(14)('moderate'),
  },
  alertButtonsWrapper: {
    flexDirection: 'row',
    marginTop: 'auto',
    justifyContent: 'space-evenly',
    width: '100%',
    height: normalize(45)('vertical'),
    borderTopColor: colors.grey14,
    borderTopWidth: normalize(1)('vertical'),
  },
  buttonSeparator: {
    backgroundColor: colors.grey14,
    width: normalize(1)('horizontal'),
    height: '100%',
  },
  suffixWrapper: {
    backgroundColor: colors.white,
    marginRight: normalize(15)('horizontal'),
  },
  textInputLabel: {
    fontSize: font.size.s4,
  },
  newPasswordTextInput: {
    marginBottom: normalize(10)('vertical'),
    marginTop: normalize(30)('vertical'),
    tintColor: colors.primary,
    fontSize: font.size.s5,
  },
}))
