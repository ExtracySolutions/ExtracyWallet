import React, { FC, useCallback, useEffect, useState } from 'react'

import { CheckIcon } from '@assets/icons'
import { Button, Header, Text, Container } from '@components'
import { useAppSelector } from '@hooks'
import { makeStyles, normalize, useTheme } from '@themes'
import { FeatParentScreen } from 'navigation'
import { useNavigation, useRoute } from 'navigation/NavigationService'
import { View, Dimensions } from 'react-native'

import { GroupPhrase } from './GroupPhrase'
import { SuggestionWord } from './SuggestionWord'

const { width } = Dimensions.get('screen')

export type ConfirmSeedPhraseProps = {}

type MnemonicWord = {
  index: number
  seedWord: string
  confirmStatus: boolean
  isSelect: boolean
}

// [TESTS] scare quote item float eight design naive kick jacket flock lesson close

export const ConfirmSeedPhrase: FC<ConfirmSeedPhraseProps> = (props) => {
  const themeStore = useAppSelector((state) => state.root.theme.theme)
  const [id, setId] = useState<number>(0)
  const {
    params: { mnemonic, mnemonicArray },
  } = useRoute('ConfirmSeedPhrase')
  const navigation = useNavigation()
  const styles = useStyles(props, themeStore)
  const theme = useTheme(themeStore)

  const [isSuccess, setSuccess] = useState<boolean>(true)
  const [mnemonicArrayState, setMnemonicArrayState] = useState<MnemonicWord[]>(
    () => {
      return [
        {
          index: 1,
          seedWord: '',
          confirmStatus: false,
          isSelect: false,
        },
        {
          index: 2,
          seedWord: '',
          confirmStatus: false,
          isSelect: false,
        },
        {
          index: 3,
          seedWord: '',
          confirmStatus: false,
          isSelect: false,
        },
        {
          index: 4,
          seedWord: '',
          confirmStatus: false,
          isSelect: false,
        },
        {
          index: 5,
          seedWord: '',
          confirmStatus: false,
          isSelect: false,
        },
        {
          index: 6,
          seedWord: '',
          confirmStatus: false,
          isSelect: false,
        },
        {
          index: 7,
          seedWord: '',
          confirmStatus: false,
          isSelect: false,
        },
        {
          index: 8,
          seedWord: '',
          confirmStatus: false,
          isSelect: false,
        },
        {
          index: 9,
          seedWord: '',
          confirmStatus: false,
          isSelect: false,
        },
        {
          index: 10,
          seedWord: '',
          confirmStatus: false,
          isSelect: false,
        },
        {
          index: 11,
          seedWord: '',
          confirmStatus: false,
          isSelect: false,
        },
        {
          index: 12,
          seedWord: '',
          confirmStatus: false,
          isSelect: false,
        },
      ]
    },
  )
  const [randomMnemonic, setRandomMnemonic] = useState<MnemonicWord[]>([])
  const [isWordValid, setWordValid] = useState<boolean>(true)
  const [isDisable, setDisable] = useState<boolean>(true)

  const checkAll = useCallback(async () => {
    return new Promise<MnemonicWord[]>(async (resolve, reject) => {
      const tempArray = []
      try {
        for (let i = 0; i < mnemonicArrayState.length; i++) {
          if (mnemonicArrayState[i].seedWord === mnemonicArray[i].seedWord) {
            tempArray.push({
              confirmStatus: true,
              isSelect: true,
              index: mnemonicArrayState[i].index,
              seedWord: mnemonicArrayState[i].seedWord,
            })
          } else if (
            mnemonicArrayState[i].seedWord !== mnemonicArray[i].seedWord
          ) {
            tempArray.push({
              confirmStatus: false,
              isSelect: false,
              index: mnemonicArrayState[i].index,
              seedWord: mnemonicArrayState[i].seedWord,
            })
          }
        }
        Promise.all(tempArray)
        resolve(tempArray)
      } catch (error) {
        reject({ error })
      }
    })
  }, [mnemonicArray, mnemonicArrayState])

  const handleSelectSeedWord = useCallback(
    async (seedWord: MnemonicWord) => {
      setRandomMnemonic(
        randomMnemonic.map((item) =>
          item.seedWord === seedWord.seedWord && item.index === seedWord.index
            ? { ...item, isSelect: true, confirmStatus: false }
            : item,
        ),
      )

      mnemonicArrayState[id] = seedWord

      setMnemonicArrayState(
        mnemonicArrayState.map((item) =>
          item.seedWord === seedWord.seedWord && item.index === seedWord.index
            ? { ...item, isSelect: true, confirmStatus: false }
            : item,
        ),
      )

      if (mnemonicArrayState[id].seedWord === mnemonicArray[id].seedWord) {
        setMnemonicArrayState(
          mnemonicArrayState.map((item) =>
            item.seedWord === seedWord.seedWord && item.index === seedWord.index
              ? { ...item, isSelect: true, confirmStatus: true }
              : item,
          ),
        )
      }

      setId(id + 1)
    },
    [id, mnemonicArray, mnemonicArrayState, randomMnemonic],
  )

  const handleSelectConfirmSeedWord = useCallback(
    async (seedWord: MnemonicWord) => {
      const index = mnemonicArrayState.findIndex(
        (item) =>
          item.seedWord === seedWord.seedWord && item.index === seedWord.index,
      )

      mnemonicArrayState.splice(index, 1)
      mnemonicArrayState.push({
        index: 12,
        seedWord: '',
        confirmStatus: false,
        isSelect: false,
      })
      setId(id - 1)

      setRandomMnemonic(
        randomMnemonic.map((item) =>
          item.seedWord === seedWord.seedWord && item.index === seedWord.index
            ? { ...item, isSelect: false, confirmStatus: false }
            : item,
        ),
      )
      setMnemonicArrayState(await checkAll())
    },
    [checkAll, id, mnemonicArrayState, randomMnemonic],
  )

  useEffect(() => {
    const randomMnemonicArray = mnemonicArray
      .map((x: MnemonicWord[]) => ({ x, r: Math.random() }))
      .sort((a: { r: number }, b: { r: number }) => a.r - b.r)
      .map((a: { x: any }) => a.x)
      .map((x: MnemonicWord[]) => ({ x, r: Math.random() }))
      .sort((a: { r: number }, b: { r: number }) => a.r - b.r)
      .map((a: { x: any }) => a.x)
    setRandomMnemonic(randomMnemonicArray)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const indexCheckValidMnemonicArray = mnemonicArrayState.findIndex(
      (item) => item.confirmStatus === false,
    )
    if (mnemonicArrayState.length !== 0) {
      if (indexCheckValidMnemonicArray !== -1) {
        setWordValid(true)
      } else {
        setWordValid(false)
      }
    } else {
      setWordValid(false)
    }
    if (mnemonicArrayState.length === 12) {
      if (indexCheckValidMnemonicArray !== -1) {
        setDisable(true)
      } else {
        setDisable(false)
      }
    } else {
      setDisable(true)
    }
  }, [id, mnemonicArray, mnemonicArrayState])

  const handleNext = useCallback(() => {
    setSuccess(false)
    if (isSuccess) {
      navigation.navigate('CreatePassword', {
        seedPhrase: mnemonic,
        parentScreen: FeatParentScreen.create,
      })
    }
  }, [isSuccess, mnemonic, navigation])

  return (
    <Container>
      <View style={styles.root}>
        <Header title={'Verify Recovery Phrase'} />
        <View style={styles.groupText}>
          <Text style={styles.text} fontSize={14} lineHeight={20}>
            {`Tap the words to put them side by side in the correct order.`}
          </Text>
        </View>
        <View style={styles.groupPhrase}>
          <View style={styles.pharse}>
            <GroupPhrase
              mnemonicArray={mnemonicArrayState}
              onSelectSeedWord={handleSelectConfirmSeedWord}
            />
          </View>
          <View style={styles.groupError}>
            <CheckIcon
              color={
                !isWordValid ? theme.colors.primary50 : theme.colors.grey12
              }
            />
            <Text
              variant="light"
              fontSize={14}
              lineHeight={16}
              style={!isWordValid ? styles.inCorrectText : styles.correctText}
            >
              Recovery Phrase correct!
            </Text>
          </View>
        </View>
        <View style={styles.suggestionWord}>
          <SuggestionWord
            mnemonicArray={randomMnemonic}
            onSelectSeedWord={handleSelectSeedWord}
          />
        </View>
        <View style={styles.groupButton}>
          <Button
            round
            disabled={isDisable}
            variant={'fulfill'}
            text={'Continue'}
            onPress={handleNext}
          />
        </View>
      </View>
    </Container>
  )
}

const useStyles = makeStyles<ConfirmSeedPhraseProps>()(({ colors }) => ({
  root: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
  },
  groupText: {
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: normalize(55)('horizontal'),
  },
  groupPhrase: {
    flex: 4,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: normalize(25)('vertical'),
  },
  pharse: {
    width: width * 0.95,
    paddingVertical: normalize(5)('vertical'),
    backgroundColor: colors.primary0,
    borderRadius: normalize(8)('moderate'),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary15,
  },
  groupButton: {
    width: width,
    justifyContent: 'flex-end',
    paddingHorizontal: normalize(15)('horizontal'),
  },
  inCorrectText: {
    color: colors.primary50,
    position: 'relative',
    left: normalize(5)('horizontal'),
  },
  correctText: {
    position: 'relative',
    left: normalize(5)('horizontal'),
  },
  suggestionWord: {
    flex: 3,
  },
  groupError: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: normalize(15)('vertical'),
  },
}))
