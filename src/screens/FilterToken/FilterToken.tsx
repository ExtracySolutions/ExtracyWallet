import React, { FC, useCallback, useRef } from 'react'

import { useAppSelector } from '@hooks'
import { useFocusEffect } from '@react-navigation/core'
import { makeStyles } from '@themes'
import useWalletInfo from 'hooks/useWalletInfo'
import { useNavigation } from 'navigation'
import { BackHandler, Dimensions, FlatList, View } from 'react-native'

import { FilterItem } from './FilterItem'

const { width } = Dimensions.get('screen')
export type FilterTokenProps = {}

export const FilterToken: FC<FilterTokenProps> = ({ props }: any) => {
  const selectedAccountIndex = useAppSelector(
    (state) =>
      state.root.engine.backgroundState.PreferencesController
        ?.selectedAccountIndex,
  )
  const themeStore = useAppSelector((state) => state.root.theme.theme)

  const styles = useStyles(props, themeStore)
  const navigation = useNavigation()
  const listRef = useRef<any>(null)

  const { tokenList } = useWalletInfo()

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.goBack()
        return true
      }
      BackHandler.addEventListener('hardwareBackPress', onBackPress)

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress)
      }
    }, [navigation]),
  )

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    return (
      <View key={index} style={index === 0 ? styles.container : null}>
        <FilterItem
          key={index}
          {...item}
          handeScroll={() =>
            listRef.current.scrollToIndex({
              animated: true,
              index: index - 2 < 0 ? 0 : index - 2,
            })
          }
          isHide={item.isHide}
          isDisableDelete={!item.platform[0].isNative}
        />
      </View>
    )
  }

  return (
    <View style={styles.root}>
      <FlatList
        ref={listRef}
        renderItem={renderItem}
        data={selectedAccountIndex?.toString() ? tokenList : null}
        keyExtractor={(item) => item.token_id}
        getItemLayout={(data, index) => ({
          length: 100,
          offset: index - 2 < 0 ? 0 : 100 * index,
          index,
        })}
      />
    </View>
  )
}

const useStyles = makeStyles<FilterTokenProps>()(({ colors, normalize }) => ({
  root: {
    backgroundColor: colors.backgroundList,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    flex: 1,
    backgroundColor: colors.backgroundList,
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },
  container: {
    width: width,
    marginTop: normalize(20)('vertical'),
  },
  groupButton: {
    backgroundColor: colors.primary,
    height: normalize(45)('moderate'),
    width: normalize(45)('moderate'),
    borderRadius: normalize(50)('moderate'),
    position: 'absolute',
    bottom: 28,
    right: 48,
  },
  icon: {
    height: normalize(40)('moderate'),
    width: normalize(45)('moderate'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  plus: {
    fontSize: normalize(45)('moderate'),
    position: 'absolute',
    color: colors.white,
  },
  searchBox: {
    alignItems: 'center',
  },
  inputStyle: {
    width: width * 0.91,
    backgroundColor: colors.white,
    marginTop: normalize(30)('moderate'),
  },
}))
