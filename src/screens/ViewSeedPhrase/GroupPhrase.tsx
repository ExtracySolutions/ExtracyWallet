import React, { FC, useCallback } from 'react'

import { Text } from '@components'
import { useAppSelector } from '@hooks'
import { makeStyles } from '@themes'
import { keyExtractor } from '@ultils'
import { FlatList, View } from 'react-native'
type MnemonicWord = {
  index: number
  seedWord: string
  confirmStatus: boolean
  isSelect: boolean
}
export type GroupPhraseProps = {
  mnemonicArray: MnemonicWord[]
}

export const GroupPhrase: FC<GroupPhraseProps> = (props) => {
  const { mnemonicArray } = props
  const themeStore = useAppSelector((state) => state.root.theme.theme)
  const styles = useStyles(props, themeStore)

  const renderItem = useCallback(
    ({ item, index }) => {
      return (
        <View key={index} style={styles.groupWordPhrase}>
          <View style={styles.indexBox}>
            <Text style={styles.index}>{`${index + 1}`}</Text>
          </View>
          <Text style={styles.seeWordText}>{`${item.seedWord}`}</Text>
        </View>
      )
    },
    [styles.groupWordPhrase, styles.index, styles.indexBox, styles.seeWordText],
  )

  return (
    <FlatList
      keyExtractor={keyExtractor}
      horizontal={false}
      scrollEnabled={false}
      data={mnemonicArray}
      renderItem={renderItem}
      numColumns={2}
      contentContainerStyle={styles.containerList}
    />
  )
}

const useStyles = makeStyles<GroupPhraseProps>()(({ colors, normalize }) => ({
  groupWordPhrase: {
    borderColor: colors.primary15,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: normalize(8)('horizontal'),
    marginVertical: normalize(6)('horizontal'),
    borderRadius: 8,
    backgroundColor: colors.white,
    width: normalize(130)('horizontal'),
    height: normalize(35)('vertical'),
  },
  containerList: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  index: {
    color: colors.primary50,
  },
  indexBox: {
    width: normalize(24)('moderate'),
    marginLeft: normalize(5)('horizontal'),
    height: normalize(24)('moderate'),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary0,
    borderRadius: normalize(50)('moderate'),
  },
  seeWordText: {
    paddingLeft: normalize(10)('horizontal'),
  },
}))
