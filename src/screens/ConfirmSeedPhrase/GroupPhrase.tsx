import React, { FC, useCallback } from 'react'

import { Text } from '@components'
import { useAppSelector } from '@hooks'
import { makeStyles } from '@themes'
import { FlatList, TouchableOpacity, View } from 'react-native'
type MnemonicWord = {
  index: number
  seedWord: string
  confirmStatus: boolean
  isSelect: boolean
}
export type GroupPhraseProps = {
  mnemonicArray: MnemonicWord[]
  onSelectSeedWord: (seedWord: MnemonicWord) => void
}

export const GroupPhrase: FC<GroupPhraseProps> = (props) => {
  const themeStore = useAppSelector((state) => state.root.theme.theme)
  const styles = useStyles(props, themeStore)
  const { mnemonicArray, onSelectSeedWord } = props

  const renderItem = useCallback(
    ({ item, index }: { item: MnemonicWord; index: number }) => {
      return (
        <TouchableOpacity
          key={index}
          style={[styles.wordPhrase, item.isSelect && styles.highlight]}
          onPress={() => {
            onSelectSeedWord(item)
          }}
        >
          <View style={styles.groupText}>
            <View style={styles.indexBox}>
              <Text style={styles.text}>{`${index + 1}  `}</Text>
            </View>
            <Text>{item.seedWord}</Text>
          </View>
        </TouchableOpacity>
      )
    },
    [
      onSelectSeedWord,
      styles.groupText,
      styles.highlight,
      styles.indexBox,
      styles.text,
      styles.wordPhrase,
    ],
  )

  return (
    <FlatList
      keyExtractor={(item, index) => index.toString()}
      scrollEnabled={false}
      data={mnemonicArray}
      renderItem={renderItem}
      contentContainerStyle={styles.containerList}
    />
  )
}

const useStyles = makeStyles<GroupPhraseProps>()(({ colors, normalize }) => ({
  wordPhrase: {
    width: normalize(100)('horizontal'),
    justifyContent: 'center',
    marginVertical: normalize(8)('horizontal'),
    marginLeft: normalize(5)('horizontal'),
    paddingHorizontal: normalize(5)('horizontal'),
    borderRadius: normalize(8)('horizontal'),
    height: normalize(30)('vertical'),
    backgroundColor: colors.white,
    borderColor: colors.primary25,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  indexBox: {
    width: normalize(24)('moderate'),
    height: normalize(24)('moderate'),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary0,
    borderRadius: normalize(50)('moderate'),
    marginRight: normalize(5)('horizontal'),
  },
  groupText: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  containerList: {
    paddingRight: normalize(5)('horizontal'),
    paddingVertical: normalize(10)('horizontal'),
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  text: {
    color: colors.primary50,
    textAlign: 'center',
  },
  highlight: {
    borderStyle: 'solid',
  },
}))
