import React, { FC, useCallback, useEffect, useState } from 'react'

import { DangerIcon } from '@assets/icons'
import {
  Button,
  Container,
  Header,
  HideKeyboard,
  Scanner,
  Text,
} from '@components'
import { PERMISSION_TYPE, useAppSelector, usePermission } from '@hooks'
import { validateMnemonic } from '@medardm/react-native-bip39'
import Clipboard from '@react-native-clipboard/clipboard'
import { makeStyles } from '@themes'
import { FeatParentScreen } from 'navigation'
import { useNavigation } from 'navigation/NavigationService'
import {
  BackHandler,
  TextInputProps as RNTextInputProps,
  View,
} from 'react-native'

import { TextInput } from './TextInput'

export type ImportWalletProps = RNTextInputProps

export const ImportWallet: FC<ImportWalletProps> = (props) => {
  const themeStore = useAppSelector((state) => state.root.theme.theme)
  const styles = useStyles(props, themeStore)

  const navigation = useNavigation()
  const { showPermissionDialog } = usePermission()

  const [scan, setScan] = useState(false)
  const [isValidSP, setValidSP] = useState<boolean>(false)
  const [result, setResult] = useState<string>('')
  const [errorSP, setError] = useState<string>('')
  const [isFocus, setFocus] = useState<boolean>(false)
  const handReset = useCallback(() => {
    setResult('')
  }, [])

  const handPaste = useCallback(async () => {
    const text = await Clipboard.getString()
    setResult(text)
  }, [])

  const handleScan = useCallback(async () => {
    const resultPermission = await showPermissionDialog(PERMISSION_TYPE.camera)
    if (resultPermission === true) {
      setScan(true)
    }
  }, [showPermissionDialog])

  const handleSuccess = useCallback(() => {
    navigation.navigate('CreatePassword', {
      parentScreen: FeatParentScreen.import,
      seedPhrase: result,
    })
  }, [navigation, result])

  const handleValidate = (e: string) => {
    console.log('handleValidate e', e)
    if (validateMnemonic(e)) {
      setResult(e)
      setError('')
      setValidSP(true)
    } else {
      setValidSP(false)
      setError('QRCode is not in the correct format of Seed Phrase')
    }
    setScan(false)
  }

  const handleBack = useCallback(() => {
    if (scan) {
      setScan(false)
    } else {
      navigation.goBack()
    }
    return true
  }, [navigation, scan])

  const onFocusInput = () => {
    setFocus(true)
  }
  const backScanScreen = () => {
    setScan(false)
  }

  useEffect(() => {
    if (isFocus && result === '') {
      setError('')
      setValidSP(false)
    } else if (isFocus && !validateMnemonic(result)) {
      setError('This is not in the correct format of Seed Phrase')
      setValidSP(false)
    } else if (result !== '' && validateMnemonic(result)) {
      setError('')
      setValidSP(true)
    }
    BackHandler.addEventListener('hardwareBackPress', handleBack)
  }, [handleBack, isFocus, result])

  return (
    <Container>
      {scan ? (
        <Scanner onRead={handleValidate} back={backScanScreen} />
      ) : (
        <HideKeyboard>
          <View style={styles.root}>
            <Header handleScan={handleScan} title="Import Wallet" />
            <Text style={styles.title} fontSize={14} lineHeight={20}>
              Usually 12 (sometimes 24) single words separated by spaces.
            </Text>
            <View style={styles.textInput}>
              <TextInput
                labelText="Seed Phrase"
                onFocusInput={onFocusInput}
                handPaste={handPaste}
                handReset={handReset}
                multiline
                autoCapitalize="none"
                onChangeText={setResult}
                placeholder=" Type, paste or scan your Seed Phrase here"
                textAlignVertical="top"
                value={result}
              />
              {errorSP !== '' && (
                <View style={styles.groupError}>
                  <DangerIcon />
                  <Text
                    variant="light"
                    fontSize={13}
                    lineHeight={16}
                    style={styles.text}
                  >
                    {errorSP}
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.bottom}>
              <Button
                disabled={!isValidSP}
                text="Confirm"
                onPress={handleSuccess}
              />
            </View>
          </View>
        </HideKeyboard>
      )}
    </Container>
  )
}

const useStyles = makeStyles<ImportWalletProps>()(({ normalize, colors }) => ({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  textInput: {
    flex: 1,
    marginHorizontal: normalize(16)('horizontal'),
  },
  groupError: {
    paddingVertical: normalize(4)('vertical'),
    paddingHorizontal: normalize(6)('horizontal'),
    flexDirection: 'row',
    backgroundColor: colors.backgroundErrorText,
    marginTop: normalize(5)('vertical'),
    borderRadius: normalize(4)('moderate'),
    alignItems: 'center',
  },
  text: {
    flex: 1,
    color: colors.alert,
    left: normalize(5)('horizontal'),
    paddingTop: normalize(2)('vertical'),
  },
  bottom: {
    justifyContent: 'flex-end',
    marginHorizontal: normalize(15)('horizontal'),
  },
  title: {
    color: colors.grey4,
    textAlign: 'center',
    marginBottom: normalize(16)('vertical'),
    marginHorizontal: normalize(48)('horizontal'),
    marginTop: normalize(24)('vertical'),
  },
}))
