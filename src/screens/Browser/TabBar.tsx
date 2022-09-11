import React, { useState, useMemo, useCallback, useEffect, FC } from 'react'

import { useAppSelector } from '@hooks'
import { colors, makeStyles, useTheme } from '@themes'
import { IgconitoTab, EmptyScreenIcon, CancelIcon } from 'assets/icons'
import { Text, FastImage } from 'components'
import DappBottomTab from 'core/DappBottomTabContext'
import {
  Dimensions,
  Pressable,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native'
import { useDispatch } from 'react-redux'

import {
  Tabs,
  closeTab,
  toggleShowTabs,
  setActiveTabs,
  changeTakePhoto,
} from '../../reduxs/reducers'

const { width, height } = Dimensions.get('screen')

export type TabsBar = {
  state: Array<Object>
}

export const TabBar: FC<TabsBar> = (props) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const dispatch = useDispatch()
  const { activeTabId, tabs, isActiveTabIncognito } = useAppSelector(
    (state) => state.root.browser,
  )

  const themeStore = useAppSelector((state) => state.root.theme.theme)
  const theme = useTheme(themeStore)
  const styles = useStyles(props, themeStore)
  const { state } = props

  const hide = tabs.filter((element) => element.incognito === true).length === 0

  useEffect(() => {
    if (hide) {
      setCurrentIndex(0)
    } else {
      setCurrentIndex(isActiveTabIncognito ? 1 : 0)
    }
  }, [hide, isActiveTabIncognito, tabs])

  const ListEmptyComponent = useMemo(
    () => (
      <View style={styles.emptyComponent}>
        <EmptyScreenIcon screen={'Tab'} />
        <View style={styles.groupText}>
          <Text variant="bold">No Tabs</Text>
          <Text style={styles.text} variant="regular">
            Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet
            sint.
          </Text>
        </View>
      </View>
    ),

    [styles.emptyComponent, styles.groupText, styles.text],
  )

  const handlePressItemTab = useCallback(
    (tab: Tabs) => {
      dispatch(setActiveTabs({ id: tab.id }))
      dispatch(toggleShowTabs(false))
      dispatch(changeTakePhoto({ isTakePhoto: false }))
    },
    [dispatch],
  )

  const handleCloseItemTab = useCallback(
    (tab: Tabs) => {
      dispatch(closeTab({ id: tab.id, incognito: tab.incognito || false }))
      DappBottomTab.context.onTerminateTabWithID(Number(tab.id))
    },
    [dispatch],
  )

  const TabsItem = useCallback(
    ({ item, index }: { item: Tabs; index: number }) => {
      const hostname = new URL(String(item.url)).hostname
      return (
        <TouchableOpacity
          key={index}
          style={[
            styles.tabItem,
            activeTabId === item.id ? styles.tabSelectedItem : null,
          ]}
          onPress={() => handlePressItemTab(item)}
        >
          <TouchableOpacity
            style={styles.closeIcon}
            onPress={() => handleCloseItemTab(item)}
          >
            <CancelIcon color={'white'} width={10} height={10} />
          </TouchableOpacity>
          <Text
            style={styles.hostnameStyle}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {hostname}
          </Text>
          <View style={styles.box}>
            <FastImage
              resizeMode="cover"
              style={styles.image}
              source={{ uri: item.image }}
            />
          </View>
        </TouchableOpacity>
      )
    },
    [
      activeTabId,
      handleCloseItemTab,
      handlePressItemTab,
      styles.box,
      styles.closeIcon,
      styles.hostnameStyle,
      styles.image,
      styles.tabItem,
      styles.tabSelectedItem,
    ],
  )

  const dataTabs = tabs.filter(
    (element) => element.incognito === (currentIndex !== 0),
  )

  const sumTabsNormal = tabs.filter(
    (element) => element.incognito === false,
  ).length

  return (
    <View style={styles.rootContainer}>
      <View style={[styles.root, hide ? [styles.mt70m] : null]}>
        <View style={styles.container}>
          {state.map((route, index) => {
            const isFocused = currentIndex === index

            const onPress = (index: number) => {
              setCurrentIndex(index)
            }

            return (
              <>
                {index === 0 ? (
                  <Pressable
                    key={index}
                    accessibilityRole="button"
                    onPress={() => onPress(0)}
                    style={isFocused ? styles.btnFocused : styles.btn}
                  >
                    <View
                      style={[
                        styles.borderTab,
                        isFocused ? null : styles.borderUnfocused,
                      ]}
                    >
                      <Text
                        fontSize={12}
                        style={[
                          styles.textTab,
                          isFocused ? null : styles.textUnfocused,
                        ]}
                      >
                        {sumTabsNormal}
                      </Text>
                    </View>
                  </Pressable>
                ) : (
                  <Pressable
                    key={index}
                    accessibilityRole="button"
                    onPress={() => onPress(1)}
                    style={isFocused ? styles.btnFocused : styles.btn}
                  >
                    <IgconitoTab
                      color={
                        isFocused ? theme.colors.primary : theme.colors.grey10
                      }
                      width={20}
                      height={18}
                    />
                  </Pressable>
                )}
              </>
            )
          })}
        </View>
      </View>
      <View
        style={[
          styles.container,
          hide ? styles.mt30 : null,
          { height: height },
        ]}
      >
        <FlatList
          contentContainerStyle={styles.containerFlatlist}
          data={dataTabs}
          renderItem={TabsItem}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          columnWrapperStyle-={styles.columnWrapper}
          ListEmptyComponent={ListEmptyComponent}
        />
      </View>
    </View>
  )
}

export const useStyles = makeStyles<TabsBar>()(
  ({ colors, normalize, font }) => ({
    btnFocused: {
      width: 50,
      // height: normalize(60)('vertical'),
      paddingVertical: normalize(10)('vertical'),
      paddingTop: normalize(10)('vertical'),
      alignItems: 'center',
      justifyContent: 'center',
      borderBottomWidth: 3,
      borderColor: colors.primary,
    },
    btn: {
      width: 50,
      paddingVertical: normalize(10)('vertical'),
      paddingTop: normalize(10)('vertical'),
      alignItems: 'center',
      justifyContent: 'center',
      borderBottomWidth: 3,
      borderColor: colors.white,
    },
    root: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      backgroundColor: colors.white,
      alignContent: 'center',
      justifyContent: 'center',
    },
    rootContainer: {
      flex: 1,
    },
    container: {
      flexDirection: 'row',
    },
    borderTab: {
      borderWidth: 2,
      borderColor: colors.primary,
      borderRadius: 5,
      width: 20,
      height: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    textTab: {
      color: colors.primary,
      fontFamily: 'Inter-Medium',
    },
    emptyComponent: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: normalize(200)('vertical'),
    },
    groupText: {
      alignItems: 'center',
      paddingHorizontal: normalize(55)('horizontal'),
    },
    text: {
      flex: 1,
      textAlign: 'center',
      fontSize: font.size.s4,
      paddingTop: normalize(10)('vertical'),
      color: colors.grey4,
    },
    columnWrapper: {
      alignSelf: 'center',
    },
    containerFlatlist: {
      margin: normalize(5)('moderate'),
      alignItems: 'center',
      height: height + normalize(60)('vertical'),
    },
    tabItem: {
      justifyContent: 'space-around',
      height: height / 5.5,
      width: width / 2.5,
      marginHorizontal: normalize(8)('moderate'),
      marginVertical: normalize(12)('moderate'),
      padding: normalize(5)('moderate'),
      borderColor: colors.transparent,
      borderWidth: 1,
      borderRadius: normalize(12)('moderate'),
      backgroundColor: colors.white,
      shadowColor: 'black',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 10,
    },
    tabSelectedItem: {
      borderColor: colors.primary,
      borderWidth: 2,
    },
    closeIcon: {
      position: 'absolute',
      right: -normalize(9)('moderate'),
      top: -normalize(9)('moderate'),
      backgroundColor: colors.grey10,
      borderRadius: 50,
      padding: normalize(7)('moderate'),
    },
    hostnameStyle: {
      fontSize: font.size.s4,
    },
    box: {
      alignItems: 'center',
    },
    image: {
      height: height / 7,
      width: width / 2.8,
      borderBottomLeftRadius: normalize(12)('moderate'),
      borderBottomRightRadius: normalize(12)('moderate'),
    },
    borderUnfocused: {
      borderColor: colors.grey11,
    },
    textUnfocused: {
      color: colors.grey11,
    },
    mt30: {
      marginTop: 30,
    },
    mt70m: {
      marginTop: -70,
    },
  }),
)
