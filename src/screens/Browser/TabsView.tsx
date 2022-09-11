/* eslint-disable import/order */
import React, { FC, useCallback } from 'react'

import { Text } from '@components'
import { useAppSelector, useAppDispatch } from '@hooks'
import { useNavigation } from '@navigation'
import { makeStyles } from '@themes'

import { View, TouchableOpacity } from 'react-native'

import { Tabs, closeAllTab, toggleShowTabs } from '../../reduxs/reducers'
import { TabBar } from './TabBar'
import DappBottomTab from 'core/DappBottomTabContext'

export type TabsViewProps = {
  tabs: Tabs[]
}

type Tab = {
  name: string
  label: string
}

export const TabsView: FC<TabsViewProps> = (props) => {
  const themeStore = useAppSelector((state) => state.root.theme.theme)

  const styles = useStyles(props, themeStore)
  const dispatch = useAppDispatch()
  const navigation = useNavigation()

  const { tabs } = props

  const TabArr: Tab[] = [
    {
      name: 'New tab',
      label: 'Normal',
    },
    {
      name: 'New incognito tab',
      label: 'Igcognito',
    },
  ]

  const handleDone = useCallback(() => {
    if (tabs.length < 1) {
      dispatch(toggleShowTabs(false))
      navigation.goBack()
    } else {
      dispatch(toggleShowTabs(false))
    }
  }, [dispatch, navigation, tabs.length])

  const handleCloseAllTab = useCallback(() => {
    dispatch(closeAllTab())
    DappBottomTab.context.onTerminateAllTab()
    dispatch(toggleShowTabs(false))
  }, [dispatch])

  return (
    <View style={styles.root}>
      <TabBar state={TabArr} />

      <View style={styles.option}>
        <TouchableOpacity style={styles.itemOption} onPress={handleCloseAllTab}>
          <Text style={styles.textOption}>Close all</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemOption} onPress={handleDone}>
          <Text style={styles.textOption}>Done</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const useStyles = makeStyles<TabsViewProps>()(
  ({ normalize, colors, font }) => ({
    root: {
      backgroundColor: colors.transparent,
      flexGrow: 1,
      position: 'relative',
    },
    option: {
      // flex: 0.8,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      alignSelf: 'center',
      zIndex: 100,
      paddingHorizontal: normalize(40)('horizontal'),
      paddingVertical: normalize(5)('vertical'),
      position: 'absolute',
      width: '100%',
      bottom: 10,
    },
    itemOption: {
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: normalize(20)('moderate'),
      borderColor: colors.grey12,
      borderWidth: 1,
      paddingVertical: normalize(6)('vertical'),
      paddingHorizontal: normalize(20)('horizontal'),
      backgroundColor: colors.white,
      width: normalize(90)('horizontal'),
    },
    textOption: {
      fontSize: font.size.s5,
      color: colors.grey4,
    },
  }),
)
