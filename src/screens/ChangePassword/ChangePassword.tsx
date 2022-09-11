import React, { useEffect, useState } from 'react'

import { StackActions } from '@react-navigation/native'
import {
  CheckIcon,
  DangerIcon,
  EyeClose,
  EyeVisble,
  SuccessIllustrationIcon,
} from 'assets'
import { Button, Container, Header, TextInput } from 'components'
import { useAppSelector, useBiometry } from 'hooks'
import { isEmpty } from 'lodash'
import { useNavigation } from 'navigation'
import { Keyboard, Text, View } from 'react-native'
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler'
import { makeStyles, useTheme } from 'themes'
import { changeVaultPasscode } from 'ultils'
import * as yup from 'yup'

export const ChangePassword = () => {
  const themeStore = useAppSelector((state) => state.root.theme.theme)
  const theme = useTheme(themeStore)
  const navigation = useNavigation()
  const styles = useStyles()
  const {
    getKeychainPassword,
    setKeychainPassword,
    clearKeychainPassword,
    passwordConfig,
    biometryConfig,
    PASSWORD_KEYCHAIN_NAME,
    BIOMETRY_KEYCHAIN_NAME,
  } = useBiometry()

  const [keychainPassword, setKeychainPass] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [changePasscodeFinished, setChangePasscodeFinished] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uppercaseMatch, setUppercaseMatch] = useState<boolean | undefined>(
    undefined,
  )
  const [numberMatch, setNumberMatch] = useState<boolean | undefined>(undefined)
  const [minimumCharsMatch, setMinimumCharsMatch] = useState<
    boolean | undefined
  >(undefined)
  const [matchPassword, setMatchPassword] = useState<boolean | undefined>(
    undefined,
  )

  useEffect(() => {
    getKeychainPassword(passwordConfig, PASSWORD_KEYCHAIN_NAME).then(
      (password) => {
        if (password) {
          setKeychainPass(password)
        }
      },
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    navigation.setOptions({
      gestureEnabled: !changePasscodeFinished,
    })
  }, [navigation, changePasscodeFinished])

  const checkOldPassword = () => {
    if (password === keychainPassword) {
      setStep(2)
      setShowPassword(false)
    } else {
      setError(true)
      setTimeout(() => setError(false), 2500)
    }
  }

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

  const handleConfirmPassword = (confirmPassword: string) => {
    if (confirmPassword === password) {
      setMatchPassword(true)
    } else {
      setMatchPassword(false)
    }
  }

  const handleChangePasscodeFinished = async () => {
    setLoading(true)
    if (matchPassword) {
      await clearKeychainPassword()
      await setKeychainPassword(
        password,
        passwordConfig,
        PASSWORD_KEYCHAIN_NAME,
      )
      await setKeychainPassword(
        password,
        biometryConfig,
        BIOMETRY_KEYCHAIN_NAME,
      )
      await changeVaultPasscode(keychainPassword, password)
      setChangePasscodeFinished(true)
      setLoading(false)
    } else {
      setError(true)
      setTimeout(() => setError(false), 2500)
      setLoading(false)
    }
  }

  return (
    <Container>
      <Header title="Change password" disableBack={changePasscodeFinished} />
      {!changePasscodeFinished && step === 1 && (
        <View style={styles.container} onTouchStart={() => Keyboard.dismiss()}>
          <View style={styles.flex1}>
            <Text style={styles.description}>
              Before continuing we need you to confirm your password.
            </Text>

            <TextInput
              labelText="Current Password"
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
              containerStyle={styles.newPasswordTextInput}
            />

            {error && (
              <View style={styles.errorWrapper}>
                <DangerIcon />
                <Text style={styles.errorText}>Password is not correct</Text>
              </View>
            )}
          </View>
          <TouchableOpacity
            style={isEmpty(password) ? styles.buttonDisabled : styles.button}
            disabled={isEmpty(password)}
            onPress={() => checkOldPassword()}
          >
            <Text
              style={
                isEmpty(password) ? styles.buttonText : styles.buttonTextEnabled
              }
            >
              Confirm
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {!changePasscodeFinished && step === 2 && (
        <View style={styles.container} onTouchStart={() => Keyboard.dismiss()}>
          <View style={styles.flex1}>
            <Text style={styles.description}>
              This password will unlock your OBL Wallet only on this device.
            </Text>
            <TextInput
              labelText="New password"
              selectionColor={theme.colors.primary}
              secureTextEntry={!showPassword}
              onChangeText={(text) => {
                passwordValidation.validate(text)
                setPassword(text)
                handleConfirmPassword(text)
              }}
              suffixItem={
                <TouchableWithoutFeedback
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.suffixWrapper}
                >
                  <>
                    {showPassword && <EyeVisble />}
                    {!showPassword && <EyeClose />}
                  </>
                </TouchableWithoutFeedback>
              }
              containerStyle={styles.newPasswordTextInput}
            />
            <View style={styles.passwordRulesWrapper}>
              <Text style={styles.passwordRulesTitle}>Password must:</Text>
              <View style={[styles.row, styles.passwordRules]}>
                <CheckIcon
                  color={
                    minimumCharsMatch
                      ? theme.colors.primary
                      : theme.colors.grayTextWeb
                  }
                  style={styles.passwordRulesIcon}
                />
                <Text
                  style={
                    minimumCharsMatch === true
                      ? styles.passwordRulesTextMatch
                      : styles.passwordRulesText
                  }
                >
                  At least 8 characters
                </Text>
              </View>
              <View style={[styles.row, styles.passwordRules]}>
                <CheckIcon
                  color={
                    uppercaseMatch
                      ? theme.colors.primary
                      : theme.colors.grayTextWeb
                  }
                  style={styles.passwordRulesIcon}
                />
                <Text
                  style={
                    uppercaseMatch === true
                      ? styles.passwordRulesTextMatch
                      : styles.passwordRulesText
                  }
                >
                  At least 1 uppercase
                </Text>
              </View>
              <View style={[styles.row, styles.passwordRules]}>
                <CheckIcon
                  color={
                    numberMatch
                      ? theme.colors.primary
                      : theme.colors.grayTextWeb
                  }
                  style={styles.passwordRulesIcon}
                />
                <Text
                  style={
                    numberMatch === true
                      ? styles.passwordRulesTextMatch
                      : styles.passwordRulesText
                  }
                >
                  At least 1 number
                </Text>
              </View>
            </View>
            <TextInput
              // placeholderPos="leftTopBorder"
              labelText="Confirm password"
              secureTextEntry={!showConfirmPassword}
              containerStyle={styles.confirmPasswordTextInput}
              selectionColor={theme.colors.primary}
              onChangeText={(text) => {
                handleConfirmPassword(text)
              }}
              suffixItem={
                <TouchableWithoutFeedback
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.suffixWrapper}
                >
                  <>
                    {showConfirmPassword && <EyeVisble />}
                    {!showConfirmPassword && <EyeClose />}
                  </>
                </TouchableWithoutFeedback>
              }
            />
            <View style={[styles.row, styles.passwordRules]}>
              <CheckIcon
                color={
                  matchPassword
                    ? theme.colors.primary
                    : theme.colors.grayTextWeb
                }
                style={styles.passwordRulesIcon}
              />
              <Text
                style={
                  matchPassword === true
                    ? styles.passwordRulesTextMatch
                    : styles.passwordRulesText
                }
              >
                Password matched
              </Text>
            </View>
          </View>
          <Button
            text="Reset password"
            loading={loading}
            textStyle={
              !matchPassword ||
              !minimumCharsMatch ||
              !numberMatch ||
              !uppercaseMatch
                ? styles.buttonText
                : styles.buttonTextEnabled
            }
            containerStyle={
              !matchPassword ||
              !minimumCharsMatch ||
              !numberMatch ||
              !uppercaseMatch
                ? styles.buttonDisabled
                : styles.button
            }
            disabled={
              !matchPassword ||
              !minimumCharsMatch ||
              !numberMatch ||
              !uppercaseMatch
            }
            onPress={() => handleChangePasscodeFinished()}
          />
        </View>
      )}
      {changePasscodeFinished && (
        <View style={styles.container}>
          <View style={styles.flex1}>
            <Text style={styles.successTitle}>
              Your new password has been set successfully!
            </Text>
            <View style={styles.successContent}>
              <SuccessIllustrationIcon />
            </View>
          </View>
          <TouchableOpacity
            onPress={() => navigation.dispatch(StackActions.pop(2))}
            style={styles.button}
          >
            <Text style={styles.buttonTextEnabled}>Done</Text>
          </TouchableOpacity>
        </View>
      )}
    </Container>
  )
}

const useStyles = makeStyles()(({ font, normalize, colors }) => ({
  container: {
    flex: 1,
    paddingHorizontal: normalize(20)('horizontal'),
    paddingTop: normalize(24)('vertical'),
  },
  successTitle: {
    marginTop: normalize(20)('vertical'),
    paddingHorizontal: normalize(35)('horizontal'),
    color: colors.primary,
    fontSize: font.size.s1,
    fontWeight: '700',
    alignSelf: 'center',
    textAlign: 'center',
  },
  description: {
    fontSize: font.size.s3,
    color: colors.grey4,
    textAlign: 'center',
    paddingHorizontal: normalize(30)('horizontal'),
  },
  errorText: {
    color: colors.alert,
    fontSize: font.size.s4,
    marginLeft: normalize(7)('horizontal'),
  },
  errorWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: normalize(12)('vertical'),
    backgroundColor: colors.alertBG,
    padding: normalize(6)('moderate'),
    borderRadius: normalize(8)('moderate'),
  },
  buttonDisabled: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.grey13,
    height: normalize(45)('vertical'),
    borderRadius: normalize(8)('moderate'),
    marginTop: 'auto',
    marginBottom: 0,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    height: normalize(45)('vertical'),
    borderRadius: normalize(8)('moderate'),
    marginTop: 'auto',
    marginBottom: 0,
  },
  buttonText: {
    fontSize: font.size.s3,
    fontWeight: '500',
    color: colors.grey10,
  },
  buttonTextEnabled: {
    fontSize: font.size.s3,
    fontWeight: '500',
    color: colors.white,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  passwordRules: {
    marginVertical: normalize(5)('vertical'),
    justifyContent: 'flex-start',
  },
  passwordRulesTitle: {
    color: colors.grey4,
    marginBottom: normalize(5)('vertical'),
  },
  passwordRulesText: {
    color: colors.grey10,
  },
  passwordRulesTextMatch: {
    color: colors.primary,
  },
  passwordRulesWrapper: {
    alignItems: 'flex-start',
    marginBottom: normalize(15)('vertical'),
  },
  passwordRulesIcon: {
    marginRight: normalize(10)('horizontal'),
  },
  flex1: {
    flex: 1,
    marginBottom: 'auto',
  },
  successContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  suffixWrapper: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: normalize(20)('horizontal'),
    borderRadius: normalize(30)('moderate'),
  },
  newPasswordTextInput: {
    marginTop: normalize(30)('vertical'),
    tintColor: colors.primary,
    fontSize: font.size.s5,
  },
  confirmPasswordTextInput: {
    marginTop: normalize(15)('vertical'),
    marginBottom: normalize(5)('vertical'),
    tintColor: colors.primary,
    fontSize: font.size.s5,
  },
}))
