import React, { FC, useCallback } from 'react'

import { LIMIT_TABS_BROWSER, NetworkType } from '@extracy-wallet-controller'
import { useAppDispatch, useAppSelector } from '@hooks'
import { makeStyles } from '@themes'
import Engine from 'core/Engine'
import { useNavigation } from 'navigation'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { createNewTab, toggleShowTabs, updateTab } from 'reduxs/reducers'

import { DappBrowsingHistory } from './models/DappBrowsingHistory'
export interface DappHistoryCellProps {
  data: DappBrowsingHistory
}

export const DappHistoryCell: FC<DappHistoryCellProps> = (props) => {
  const styles = useStyles()
  const navigation = useNavigation()
  const dispatch = useAppDispatch()

  const { PreferencesController } = useAppSelector(
    (state) => state.root.engine.backgroundState,
  )

  const { isActiveTabIncognito, tabs } = useAppSelector(
    (state) => state.root.browser,
  )

  const selectedAccountIndex = useAppSelector(
    (state) =>
      state.root.engine.backgroundState.PreferencesController
        ?.selectedAccountIndex,
  )

  const handleCreateNewTab = useCallback(
    (value: boolean, url: string) => {
      const id = Date.now()

      if (tabs.length >= LIMIT_TABS_BROWSER) {
        dispatch(
          updateTab({
            url: url,
            id: id,
          }),
        )
      } else {
        dispatch(
          createNewTab({
            url: url,
            incognito: value,
            networkID: 'ethereum',
            networkType: NetworkType.ERC20,
            accountIndex: selectedAccountIndex ?? 0,
          }),
        )

        Engine.context.DappManagerController?.createNewTabs({
          id,
          accountIndex: PreferencesController?.selectedAccountIndex ?? 0,
          networkID: 'ethereum',
          networkType: NetworkType.ERC20,
        })
        dispatch(toggleShowTabs(false))
      }

      navigation.goBack()
    },
    [
      PreferencesController?.selectedAccountIndex,
      dispatch,
      navigation,
      selectedAccountIndex,
      tabs.length,
    ],
  )

  const data = new Date(props.data.date)
  const year = data.getFullYear()
  const month =
    data.getMonth() + 1 < 10 ? '0' + (data.getMonth() + 1) : data.getMonth() + 1
  const day = data.getDay() < 10 ? '0' + data.getDay() : data.getDay()

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => handleCreateNewTab(isActiveTabIncognito, props.data.url)}
    >
      <Text style={styles.textDay}>
        {day}-{month}-{year}
      </Text>
      <View style={styles.pageWrapper}>
        <Image source={{ uri: props.data.imageUrl }} style={styles.image} />
        <Text numberOfLines={2} style={styles.text}>
          {props.data.url}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

const useStyles = makeStyles()(({ normalize, font, colors }) => ({
  container: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingHorizontal: normalize(30)('horizontal'),
    paddingVertical: normalize(5)('vertical'),
  },
  pageWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    // paddingVertical: normalize(5)('vertical'),
  },
  text: {
    fontSize: font.size.s3,
    color: colors.grey4,
    marginRight: normalize(30)('horizontal'),
    marginBottom: normalize(10)('vertical'),
  },
  image: {
    width: 20,
    height: 20,
    marginTop: normalize(2)('vertical'),
    marginRight: normalize(10)('horizontal'),
    alignSelf: 'flex-start',
  },
  textDay: {
    marginVertical: normalize(5)('vertical'),
    marginLeft: normalize(27)('horizontal'),
    fontSize: font.size.s5,
    color: colors.grey10,
  },
}))
