import React, { FC, useCallback, useEffect, useState } from 'react'

import { CopyIcon } from '@assets/icons'
import { Button, Header, Text, Container } from '@components'
import { useAppSelector } from '@hooks'
import Clipboard from '@react-native-clipboard/clipboard'
import { makeStyles, normalize, useTheme } from '@themes'
import { generateMnemonic } from '@ultils'
import { useNavigation } from 'navigation/NavigationService'
import { Pressable, View } from 'react-native'
import Snackbar from 'react-native-snackbar'

import { GroupPhrase } from './GroupPhrase'

export type ViewSeedPhraseProps = {}
export type MnemonicWord = {
  index: number
  seedWord: string
  confirmStatus: boolean
  isSelect: boolean
}

export const ViewSeedPhrase: FC<ViewSeedPhraseProps> = (props) => {
  const themeStore = useAppSelector((state) => state.root.theme.theme)
  const styles = useStyles(props, themeStore)
  const theme = useTheme(themeStore)
  const navigation = useNavigation()

  const [mnemonicArray, setMnemonicArray] = useState<MnemonicWord[]>([])
  const [mnemonicCopy, setMnemonic] = useState<string>('')

  const hanldeGenerateMnemonic = useCallback(async () => {
    try {
      const { mnemonic } = await generateMnemonic()
      setMnemonic(mnemonic)

      const normalizeMnemonic = mnemonic.split(/\s+/)
      const mappingArray: MnemonicWord[] = normalizeMnemonic.map(
        (item, index) => {
          return {
            index: index + 1,
            seedWord: item,
            confirmStatus: false,
            isSelect: false,
          }
        },
      )

      setMnemonicArray(mappingArray)
    } catch (error) {
      throw new Error('Create mnemonic failed!')
    }
  }, [])

  const handleNavigateToComfirmSeedPhrase = useCallback(async () => {
    navigation.navigate('ConfirmSeedPhrase', {
      mnemonicArray,
      mnemonic: mnemonicCopy,
    })
  }, [mnemonicArray, mnemonicCopy, navigation])

  const handleCopyToClipBoard = useCallback((value) => {
    Clipboard.setString(value)
    Snackbar.show({
      text: 'Coppied!',
      duration: Snackbar.LENGTH_SHORT,
    })
  }, [])

  useEffect(() => {
    hanldeGenerateMnemonic()
  }, [hanldeGenerateMnemonic])

  return (
    <Container>
      <Header title={'Recovery Seed Phrase'} />
      <View style={styles.root}>
        <Text
          style={styles.text}
          variant="medium"
          fontSize={14}
          lineHeight={20}
        >
          Write or copy these words in the correct order and save them in a safe
          place.
        </Text>
        <View style={styles.groupPhrase}>
          <View style={styles.pharse}>
            <GroupPhrase mnemonicArray={mnemonicArray} />
          </View>
        </View>
        <View style={styles.layout}>
          <Pressable onPress={() => handleCopyToClipBoard(mnemonicCopy)}>
            <View style={styles.copyWapper}>
              <CopyIcon color={theme.colors.primary50} />
              <Text style={styles.link}>Click to copy</Text>
            </View>
          </Pressable>
        </View>
        <View style={styles.groupButton}>
          <Text
            style={styles.warningText}
            variant="light"
            fontSize={14}
            lineHeight={20}
          >
            {`Never share recovery phrases with anyone,\n keep them safe and secret`}
          </Text>
          <Button
            round
            variant={'fulfill'}
            text={'Continue'}
            onPress={handleNavigateToComfirmSeedPhrase}
          />
        </View>
      </View>
    </Container>
  )
}

const useStyles = makeStyles<ViewSeedPhraseProps>()(({ colors }) => ({
  root: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.background,
  },
  text: {
    textAlign: 'center',
    marginTop: normalize(24)('horizontal'),
    paddingHorizontal: normalize(40)('horizontal'),
  },
  groupPhrase: {
    flex: 4,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  pharse: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: normalize(8)('horizontal'),
  },
  groupButton: {
    flex: 2,
    justifyContent: 'flex-end',
    paddingHorizontal: normalize(15)('horizontal'),
  },
  layout: {
    flex: 0.5,
    alignItems: 'center',
    borderRadius: normalize(8)('horizontal'),
  },
  copyWapper: {
    padding: normalize(5)('vertical'),
    paddingHorizontal: normalize(15)('vertical'),
    backgroundColor: colors.primary0,
    borderRadius: normalize(8)('horizontal'),
    flexDirection: 'row',
    alignItems: 'center',
  },
  link: {
    color: colors.primary,
    paddingLeft: normalize(10)('vertical'),
  },
  warningText: {
    textAlign: 'center',
    marginBottom: normalize(20)('vertical'),
  },
}))
