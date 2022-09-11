import React, { useCallback, useEffect, useMemo, useState } from 'react'

import AsyncStorage from '@react-native-community/async-storage'
import { CheckIcon, EyeClose, EyeVisble } from 'assets'
import {
  Button,
  CheckboxComponent,
  Container,
  Header,
  Switch,
  Text,
  TextInput,
} from 'components'
import {
  PERMISSION_TYPE,
  useAppSelector,
  useBiometry,
  usePermission,
} from 'hooks'
import { isEmpty } from 'lodash'
import { useRoute } from 'navigation'
import { useProvider } from 'provider'
import {
  Keyboard,
  KeyboardAvoidingView,
  TouchableOpacity,
  View,
} from 'react-native'
import { BIOMETRY_TYPE } from 'react-native-keychain'
import { makeStyles, useTheme } from 'themes'
import { AsyncStorageKeys } from 'ultils'
import * as yup from 'yup'

export const CreatePassword = () => {
  const styles = useStyles()
  const themeStore = useAppSelector((state) => state.root.theme.theme)
  const theme = useTheme(themeStore)
  const route = useRoute('CreatePassword')

  const { seedPhrase, parentScreen } = route.params
  const { handleCreateWallet, handleShowLockScreen } = useProvider()
  const { showPermissionDialog } = usePermission()
  const {
    getKeychainPassword,
    setKeychainPassword,
    biometryConfig,
    passwordConfig,
    BIOMETRY_KEYCHAIN_NAME,
    PASSWORD_KEYCHAIN_NAME,
    getSupportedBiometryType,
  } = useBiometry()

  const [userAgreed, setUserAgreed] = useState(false)
  const [biometryEnabled, setBiometryEnabled] = useState(false)
  const [biometryType, setBiometryType] = useState<string | undefined>(
    undefined,
  )
  const [password, setPassword] = useState('')
  const [uppercaseMatch, setUppercaseMatch] = useState<boolean | undefined>(
    undefined,
  )
  const [numberMatch, setNumberMatch] = useState<boolean | undefined>(undefined)
  const [minimumCharsMatch, setMinimumCharsMatch] = useState<
    boolean | undefined
  >(undefined)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [matchPassword, setMatchPassword] = useState<boolean | undefined>(
    undefined,
  )
  const [loading, setLoading] = useState(false)

  const biometryTypeName = useMemo(() => {
    if (biometryType) {
      switch (biometryType) {
        case (BIOMETRY_TYPE.FACE, BIOMETRY_TYPE.IRIS):
          return 'Face'
        case BIOMETRY_TYPE.FACE_ID:
          return 'Face ID'
        case BIOMETRY_TYPE.FINGERPRINT:
          return 'Fingerprint'
        case BIOMETRY_TYPE.TOUCH_ID:
          return 'Touch ID'
      }
    }
  }, [biometryType])

  const passwordValidation = yup.string().test('', '', (value) => {
    if (value) {
      const metMinimumChars = /^.{8,}$/.test(value)
      const hasUpperCase = /[A-Z]/.test(value)
      const hasLowerCase = /[0-9]/.test(value)
      setUppercaseMatch(hasUpperCase)
      setNumberMatch(hasLowerCase)
      setMinimumCharsMatch(metMinimumChars)
      return true
    } else {
      setUppercaseMatch(false)
      setNumberMatch(false)
      setMinimumCharsMatch(false)
      return false
    }
  })

  const createWalletWithBiometry = async (enabled: boolean) => {
    await handleCreateWallet(seedPhrase, password)
    if (enabled) {
      await AsyncStorage.setItem(AsyncStorageKeys.biometryEnabled, 'true')
      setBiometryEnabled(true)
    } else {
      await AsyncStorage.setItem(AsyncStorageKeys.biometryEnabled, 'false')
      setBiometryEnabled(false)
    }
  }

  const createPassword = async () => {
    const config = {
      ...biometryConfig,
      authenticationPrompt: {
        title: 'Authenticate to verify owner of this device',
      },
    }
    setLoading(true)

    await setKeychainPassword(password, passwordConfig, PASSWORD_KEYCHAIN_NAME)

    if (biometryType) {
      await setKeychainPassword(password, config, BIOMETRY_KEYCHAIN_NAME)

      if (biometryEnabled) {
        const keychainPassword = await getKeychainPassword(
          config,
          BIOMETRY_KEYCHAIN_NAME,
        )
        if (keychainPassword) {
          await createWalletWithBiometry(true)
        } else {
          await createWalletWithBiometry(false)
        }
      } else {
        await createWalletWithBiometry(false)
      }
    } else {
      await createWalletWithBiometry(false)
    }

    setLoading(false)
    handleShowLockScreen(false)
  }

  const handleConfirmPassword = useCallback(
    (confirmPassword: string) => {
      if (confirmPassword === password) {
        setMatchPassword(true)
      } else {
        setMatchPassword(false)
      }
    },
    [password],
  )

  const handleToggleCheckBox = useCallback(
    () => setUserAgreed(!userAgreed),
    [userAgreed],
  )

  const onChangeTextNewPassword = useCallback(
    (text: string) => {
      passwordValidation.validate(text)
      setPassword(text)
      handleConfirmPassword(text)
    },
    [handleConfirmPassword, passwordValidation],
  )

  const SuffixItem = ({
    callback,
    isShow,
  }: {
    callback: () => void
    isShow: boolean
  }) => (
    <TouchableOpacity onPress={callback}>
      <View style={styles.suffixWrapper}>
        {isShow ? <EyeVisble /> : <EyeClose />}
      </View>
    </TouchableOpacity>
  )

  const handleShowPassword = useCallback(() => {
    setShowPassword((prev) => !prev)
  }, [])

  const handleShowConfirmPassword = useCallback(() => {
    setShowConfirmPassword((prev) => !prev)
  }, [])

  const TextConfirm = ({
    isCheck,
    title,
  }: {
    isCheck: boolean
    title: string
  }) => {
    return (
      <View style={[styles.row, styles.passwordRules]}>
        <CheckIcon
          color={isCheck ? theme.colors.primary50 : theme.colors.grey10}
          style={styles.passwordRulesIcon}
        />
        <Text
          variant="light"
          fontSize={14}
          lineHeight={16}
          style={
            isCheck ? styles.passwordRulesTextMatch : styles.passwordRulesText
          }
        >
          {title}
        </Text>
      </View>
    )
  }

  const handleTurnOnBiometry = useCallback(async () => {
    if (biometryType === BIOMETRY_TYPE.FACE_ID) {
      showPermissionDialog(PERMISSION_TYPE.biometry).then((value) => {
        if (value === true) {
          setBiometryEnabled(true)
        } else {
          setBiometryEnabled(false)
        }
      })
    }
    setBiometryEnabled(true)
  }, [biometryType, showPermissionDialog])

  const handleTurnOff = () => {
    setBiometryEnabled(false)
  }

  const RightComponent = () => {
    const onPress = () => {
      console.log('handleLearnMorePress')
    }
    return (
      <Text
        variant="light"
        fontSize={13}
        lineHeight={18}
        style={styles.agreementText}
      >
        {`I understand that OBL Wallet, cannot recover this password for me. `}
        <Text
          variant="light"
          fontSize={13}
          lineHeight={18}
          style={styles.learnMorelink}
          onPress={onPress}
        >
          Learn more
        </Text>
      </Text>
    )
  }

  const isDisabledButton = useMemo(
    () =>
      !userAgreed ||
      !numberMatch ||
      !uppercaseMatch ||
      !minimumCharsMatch ||
      !matchPassword ||
      isEmpty(password),
    [
      matchPassword,
      minimumCharsMatch,
      numberMatch,
      password,
      uppercaseMatch,
      userAgreed,
    ],
  )

  const onTouchStart = useCallback(() => {
    Keyboard.dismiss()
    passwordValidation.validate(password)
  }, [password, passwordValidation])

  useEffect(() => {
    getSupportedBiometryType().then((type) => {
      setBiometryType(type)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Container>
      <Header
        title={parentScreen === 'import' ? 'Create Password' : 'Create Wallet'}
      />
      <View style={styles.container} onTouchStart={onTouchStart}>
        <KeyboardAvoidingView
          style={styles.containerAvoidKeyboard}
          behavior="position"
          keyboardVerticalOffset={-30}
        >
          <View style={styles.content}>
            <Text fontSize={14} lineHeight={20} style={styles.description}>
              This password will unlock your wallet only on this device.
            </Text>
            <TextInput
              labelText="New password"
              selectionColor={theme.colors.primary50}
              secureTextEntry={!showPassword}
              onChangeText={onChangeTextNewPassword}
              suffixItem={
                <SuffixItem
                  callback={handleShowPassword}
                  isShow={showPassword}
                />
              }
              containerStyle={styles.newPasswordTextInput}
            />
            <View style={styles.passwordRulesWrapper}>
              <Text fontSize={14} lineHeight={16} style={styles.passwordMust}>
                Password must
              </Text>
              <TextConfirm
                isCheck={Boolean(minimumCharsMatch)}
                title="At least 8 characters"
              />
              <TextConfirm
                isCheck={Boolean(uppercaseMatch)}
                title="At least 1 uppercase"
              />
              <TextConfirm
                isCheck={Boolean(numberMatch)}
                title="At least 1 number"
              />
            </View>
            <TextInput
              labelText="Confirm password"
              secureTextEntry={!showConfirmPassword}
              containerStyle={styles.confirmPasswordTextInput}
              selectionColor={theme.colors.primary50}
              onChangeText={handleConfirmPassword}
              suffixItem={
                <SuffixItem
                  callback={handleShowConfirmPassword}
                  isShow={showConfirmPassword}
                />
              }
            />
            <TextConfirm
              isCheck={Boolean(matchPassword)}
              title="Password matched"
            />

            {biometryType && (
              <View style={[styles.row, styles.unlockWithBiometrySection]}>
                <Text
                  fontSize={14}
                  lineHeight={16}
                  style={styles.unlockWithBiometryText}
                >
                  Unlock with {biometryTypeName}?
                </Text>
                <Switch
                  isSwitch={biometryEnabled}
                  btnContainerStyle={styles.switch}
                  handleTurnOn={handleTurnOnBiometry}
                  handleTurnOff={handleTurnOff}
                />
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
        <CheckboxComponent
          containStyle={styles.agreementWrapper}
          handleToggleCheckBox={handleToggleCheckBox}
          isCheck={userAgreed}
          backgroundBox={theme.colors.primary}
          rightComponent={<RightComponent />}
        />
        <Button
          loading={loading}
          text="Create"
          onPress={createPassword}
          disabled={isDisabledButton}
        />
      </View>
    </Container>
  )
}

const useStyles = makeStyles()(({ normalize, font, colors }) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: normalize(15)('horizontal'),
    paddingTop: normalize(10)('vertical'),
  },
  content: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  passwordRules: {
    marginVertical: normalize(5)('vertical'),
    justifyContent: 'flex-start',
    marginLeft: normalize(5)('horizontal'),
  },
  passwordRulesText: {
    color: colors.grey4,
  },
  passwordMust: {
    color: colors.grey10,
  },
  passwordRulesTextMatch: {
    color: colors.primary50,
  },

  passwordRulesWrapper: {
    alignItems: 'flex-start',
  },
  passwordRulesIcon: {
    marginRight: normalize(10)('horizontal'),
  },
  learnMorelink: {
    color: colors.primary50,
  },

  newPasswordTextInput: {
    marginBottom: normalize(12)('vertical'),
  },
  confirmPasswordTextInput: {
    marginTop: normalize(16)('vertical'),
    marginBottom: normalize(12)('vertical'),
  },
  description: {
    marginVertical: normalize(24)('vertical'),
    textAlign: 'center',
    paddingHorizontal: normalize(48)('horizontal'),
  },
  unlockWithBiometryText: {
    flex: 1,
  },
  unlockWithBiometrySection: {
    marginBottom: 'auto',
    marginTop: normalize(10)('vertical'),
  },
  switch: {
    marginRight: 0,
    marginLeft: 'auto',
  },

  agreementWrapper: {
    flex: 0.2,
    justifyContent: 'flex-end',
    paddingHorizontal: normalize(5)('horizontal'),
    marginVertical: normalize(8)('vertical'),
  },
  agreementText: {
    flex: 1,
    marginLeft: normalize(11)('horizontal'),

    justifyContent: 'center',
  },
  button: {
    borderRadius: normalize(10)('moderate'),
    backgroundColor: colors.primary50,
    padding: normalize(20)('moderate'),
    marginTop: 'auto',
    marginBottom: normalize(0)('vertical'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    borderRadius: normalize(10)('moderate'),
    backgroundColor: colors.disabled,
    padding: normalize(20)('moderate'),
    marginTop: 'auto',
    marginBottom: normalize(0)('vertical'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: font.size.title2,
    fontWeight: '600',
  },

  suffixWrapper: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: normalize(20)('horizontal'),
  },
  containerAvoidKeyboard: {
    flex: 1,
    alignItems: 'center',
  },
  titleCompleted: {
    color: colors.primary50,
    marginHorizontal: normalize(35)('horizontal'),
  },
}))
