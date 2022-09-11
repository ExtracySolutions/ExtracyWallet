import React, { FC, useCallback } from 'react'

import { Text } from '@components'
import { useAppSelector } from '@hooks'
import { makeStyles } from '@themes'
import { keyExtractor } from '@ultils'
import { FlatList, TouchableOpacity, View } from 'react-native'

type MnemonicWord = {
  index: number
  seedWord: string
  confirmStatus: boolean
  isSelect: boolean
}

export type SuggestionWordProps = {
  mnemonicArray: MnemonicWord[]
  onSelectSeedWord: (seedWord: MnemonicWord) => void
}
export const SuggestionWord: FC<SuggestionWordProps> = (props) => {
  const themeStore = useAppSelector((state) => state.root.theme.theme)
  const styles = useStyles(props, themeStore)
  const { mnemonicArray, onSelectSeedWord } = props

  const renderItem = useCallback(
    ({ item, index }: { item: MnemonicWord; index: number }) => {
      return !item.isSelect ? (
        <TouchableOpacity
          key={index}
          style={[styles.notSelectWordPhrase]}
          onPress={() => {
            onSelectSeedWord(item)
          }}
        >
          <Text
            numberOfLines={1}
            ellipsizeMode={'tail'}
            style={styles.textNotSelect}
          >
            {item.seedWord}
          </Text>
        </TouchableOpacity>
      ) : (
        <View key={index} style={[styles.selectedWordPhrase]} />
      )
    },
    [
      onSelectSeedWord,
      styles.notSelectWordPhrase,
      styles.selectedWordPhrase,
      styles.textNotSelect,
    ],
  )

  return (
    <FlatList
      keyExtractor={keyExtractor}
      horizontal={false}
      scrollEnabled={false}
      data={mnemonicArray}
      numColumns={4}
      renderItem={renderItem}
      contentContainerStyle={styles.root}
    />
  )
}

const useStyles = makeStyles<SuggestionWordProps>()(
  ({ normalize, colors }) => ({
    root: {
      alignItems: 'center',
      marginTop: normalize(-8)('horizontal'),
    },
    notSelectWordPhrase: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: normalize(13)('horizontal'),
      marginHorizontal: normalize(2)('horizontal'),
      borderRadius: normalize(8)('moderate'),
      width: normalize(76)('horizontal'),
      height: normalize(30)('vertical'),
      borderColor: colors.grey12,
      borderWidth: 1,
    },
    selectedWordPhrase: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: normalize(10)('horizontal'),
      marginHorizontal: normalize(5)('horizontal'),
      borderRadius: normalize(8)('moderate'),
      width: normalize(70)('horizontal'),
      height: normalize(30)('vertical'),
      borderColor: colors.grey12,
      borderWidth: 1,
      borderStyle: 'dashed',
    },
    textNotSelect: {
      color: colors.text,
    },
  }),
)
