import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import {
  DappArrowBackIcon,
  DappArrowNextIcon,
  VerticalDotIcon,
} from '@assets/icons'
import {
  Text,
  BottomSheet,
  Modalize,
  SelectedItem,
  ToastPayload,
} from '@components'
import {
  LIMIT_TABS_BROWSER,
  Identity,
  NetworkType,
  FrequentRpc,
  TokenPlatform,
} from '@extracy-wallet-controller'
import { useAppDispatch, useAppSelector } from '@hooks'
import { useNavigation } from '@react-navigation/native'
import { makeStyles, normalize, useTheme } from '@themes'
import {
  getIconNetworkWithNetworkID,
  HOMEPAGE_URL,
  keyExtractor,
} from '@ultils'
import { NewTabIcon, IgconitoTab, Bookmarks, RecentIcon } from 'assets'
import DappBottomContext from 'core/DappBottomTabContext'
import { isEmpty } from 'lodash'
import { View, TouchableOpacity, Dimensions, Platform } from 'react-native'
import Jazzicon from 'react-native-jazzicon'
import { Menu, MenuItem } from 'react-native-material-menu'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { createNewTab, toggleShowTabs } from 'reduxs/reducers'
import { height } from 'screens'

export type DappBottomTabProps = { isMoving: any }

const { height: MAX_HEIGHT, width: MAX_WIDTH } = Dimensions.get('screen')

export const DappBottomTab: FC<DappBottomTabProps> = (props) => {
  const themeStore = useAppSelector((state) => state.root.theme.theme)

  const { PreferencesController } = useAppSelector(
    (state) => state.root.engine.backgroundState,
  )
  const networksActive = useAppSelector(
    (state) => state.root.tokenList.networkListActive,
  )
  const selectedAccount = useAppSelector(
    (state) =>
      state.root.engine.backgroundState.PreferencesController
        ?.selectedAccountIndex,
  )

  const { tabs, activeTabId, showTab } = useAppSelector(
    (state) => state.root.browser,
  )

  const styles = useStyles(props, themeStore)

  const insets = useSafeAreaInsets()
  const dispatch = useAppDispatch()
  const navigation = useNavigation()
  const theme = useTheme(themeStore)

  const modalizeChangeAccountRef = useRef<Modalize>(null)
  const modalizeChangeNetworkRef = useRef<Modalize>(null)
  const [accountList, setAccountList] = useState<Identity[]>()
  const [networkList, setNetworkList] = useState<TokenPlatform[]>()
  const [selectedAccountName, setSelectedAccountName] = useState<string>('')
  const [accountIndexOfTab, setAccountIndexOfTab] = useState<number>()
  const [selectedNetworkID, setSelectedNetworkID] = useState<string>()

  const [visible, setVisible] = useState(false)

  //@ts-ignore
  const { identities, frequentRpcList } = PreferencesController

  const goBack = useCallback(() => {
    DappBottomContext.context.onExecuteGoBack(Number(activeTabId))
  }, [activeTabId])

  const goNext = useCallback(() => {
    DappBottomContext.context.onExecuteGoForward(Number(activeTabId))
  }, [activeTabId])

  const handleHistoryPress = () => {
    navigation.navigate('DappHistory')
    hideMenu()
  }

  const handleCreateNewTab = useCallback(
    (isIncognito: boolean) => {
      setVisible(false)

      // eslint-disable-next-line no-undef
      toast.hideAll()

      if (tabs.length < LIMIT_TABS_BROWSER) {
        dispatch(
          createNewTab({
            url: HOMEPAGE_URL,
            incognito: isIncognito,
            accountIndex: PreferencesController?.selectedAccountIndex ?? 0,
            networkID: 'ethereum',
            networkType: NetworkType.ERC20,
          }),
        )

        dispatch(toggleShowTabs(false))
      } else {
        // eslint-disable-next-line no-undef
        toast.show('', {
          data: {
            type: 'limited',
          } as ToastPayload,
        })
      }
    },
    [PreferencesController?.selectedAccountIndex, dispatch, tabs.length],
  )

  const hanleOption = useCallback(() => {
    setVisible(!visible)
  }, [visible])

  const hideMenu = () => setVisible(false)

  const handleToBookmark = useCallback(() => {
    setVisible(false)
    navigation.navigate('Bookmark')
  }, [navigation])

  useEffect(() => {
    if (identities) {
      let identitiesArray: Identity[] = []
      Object.keys(identities).forEach((value, index) => {
        identitiesArray.push(identities[index])
      })
      setAccountList(identitiesArray)
    }
  }, [identities])

  useEffect(() => {
    if (
      networksActive &&
      selectedAccount?.toString() &&
      !isEmpty(networksActive[selectedAccount])
    ) {
      //@ts-ignore
      setNetworkList(networksActive[selectedAccount])
    } else {
      setNetworkList(frequentRpcList)
    }
  }, [frequentRpcList, networksActive, selectedAccount])

  useEffect(() => {
    if (identities) {
      // get selected tab with id
      const selectedTab = tabs.find((tab) => tab.id === activeTabId)

      if (selectedTab) {
        setAccountIndexOfTab(selectedTab.selectedAccountIndex)
        //@ts-ignore
        setSelectedAccountName(
          identities[selectedTab.selectedAccountIndex].addresses[
            NetworkType.ERC20
          ],
        )
        setSelectedNetworkID(selectedTab.selectedNetworkID)
      }
    }
  }, [activeTabId, identities, tabs])

  const handleOpenChangeAccount = useCallback(() => {
    modalizeChangeAccountRef.current?.open()
  }, [])

  const handleChangeAccount = useCallback(
    (account: Identity) => {
      if (DappBottomContext.context) {
        DappBottomContext.context &&
          DappBottomContext.context.onExecuteChangeAccount &&
          DappBottomContext.context.onExecuteChangeAccount(
            account,
            Number(activeTabId),
          )
        modalizeChangeAccountRef.current?.close()
      }
    },
    [activeTabId],
  )

  const handleOpenChangeNetwork = useCallback(() => {
    modalizeChangeNetworkRef.current?.open()
  }, [])

  const handleChangeNetwork = useCallback(
    (network: FrequentRpc) => {
      if (DappBottomContext.context) {
        DappBottomContext.context &&
          DappBottomContext.context.onExecuteChangeNetwork &&
          DappBottomContext.context.onExecuteChangeNetwork(
            network,
            Number(activeTabId),
          )
        modalizeChangeNetworkRef.current?.close()
      }
    },
    [activeTabId],
  )

  const renderAccountItem = useCallback(
    ({ item, index }: { item: Identity; index: number }) => {
      return (
        <SelectedItem
          key={index}
          selected={item.accountIndex === accountIndexOfTab}
          onPress={() => handleChangeAccount(item)}
        >
          <View style={styles.accountWrapper}>
            <Jazzicon size={33} seed={index} />
            <View style={styles.titleWrapper}>
              <Text
                variant="medium"
                style={
                  item.accountIndex === accountIndexOfTab
                    ? styles.nameTitleSelected
                    : styles.nameTitle
                }
              >
                {item.name}
              </Text>
            </View>
          </View>
        </SelectedItem>
      )
    },
    [
      accountIndexOfTab,
      handleChangeAccount,
      styles.accountWrapper,
      styles.nameTitle,
      styles.nameTitleSelected,
      styles.titleWrapper,
    ],
  )

  const renderNetworkItem = useCallback(
    ({ item, index }: { item: FrequentRpc & TokenPlatform; index: number }) => {
      return (
        <SelectedItem
          key={index}
          selected={selectedNetworkID === item.token_id}
          onPress={() => handleChangeNetwork(item)}
        >
          <View style={styles.accountWrapper}>
            <View style={styles.icon}>
              {getIconNetworkWithNetworkID(item.token_id)}
            </View>
            <View style={styles.titleWrapper}>
              <Text
                variant="medium"
                style={
                  selectedNetworkID === item.token_id
                    ? styles.nameTitleSelected
                    : styles.nameTitle
                }
              >
                {selectedAccount?.toString() &&
                isEmpty(networksActive[selectedAccount])
                  ? item.nickname
                  : item.networkName}
              </Text>
            </View>
          </View>
        </SelectedItem>
      )
    },
    [
      selectedNetworkID,
      styles.accountWrapper,
      styles.icon,
      styles.titleWrapper,
      styles.nameTitleSelected,
      styles.nameTitle,
      selectedAccount,
      networksActive,
      handleChangeNetwork,
    ],
  )

  const HeaderAccountComponent = useCallback(() => {
    return (
      <View style={styles.headerWrapper}>
        <Text variant="medium" fontSize={16}>
          Your Account
        </Text>
        <View style={styles.headerSeparator} />
      </View>
    )
  }, [styles.headerSeparator, styles.headerWrapper])

  const HeaderNetworkComponent = useCallback(() => {
    return (
      <View style={styles.headerWrapper}>
        <Text variant="medium" fontSize={16}>
          Your Network
        </Text>
        <View style={styles.headerSeparator} />
      </View>
    )
  }, [styles.headerSeparator, styles.headerWrapper])

  const FloatingComponent = useCallback(() => {
    if (insets.bottom === 0) {
      return null
    } else {
      return <View style={[styles.floatComponent, { height: insets.bottom }]} />
    }
  }, [insets.bottom, styles.floatComponent])

  const NetworkIcon = useMemo(() => {
    const networkIcon = getIconNetworkWithNetworkID(
      selectedNetworkID ? selectedNetworkID : '',
    )
    return React.cloneElement(networkIcon, { width: 30, height: 30 })
  }, [selectedNetworkID])

  const goBackWallet = () => {
    props.isMoving.value = false
    navigation.navigate('Wallet')
  }

  return (
    <>
      <View style={styles.root}>
        <View style={styles.boxLeft}>
          {/* Wallet icon */}
          <TouchableOpacity style={[styles.groupWallet]} onPress={goBackWallet}>
            <Text isHighlight fontSize={12} lineHeight={14}>
              Wallet
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab]}
            onPress={goBack}
            disabled={
              !(
                DappBottomContext.context &&
                DappBottomContext.context?.onGetGoBackStatus(
                  Number(activeTabId),
                ) &&
                !showTab
              )
            }
          >
            <DappArrowBackIcon
              color={
                DappBottomContext.context?.onGetGoBackStatus(
                  Number(activeTabId),
                ) && !showTab
                  ? theme.colors.primary50
                  : theme.colors.grey10
              }
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab]}
            onPress={goNext}
            disabled={
              !(
                DappBottomContext.context &&
                DappBottomContext.context?.onGetGoForwardStatus(
                  Number(activeTabId),
                ) &&
                !showTab
              )
            }
          >
            <DappArrowNextIcon
              color={
                DappBottomContext.context &&
                DappBottomContext.context?.onGetGoForwardStatus(
                  Number(activeTabId),
                ) &&
                !showTab
                  ? theme.colors.primary50
                  : theme.colors.grey10
              }
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab]}
            onPress={() => handleCreateNewTab(false)}
          >
            <NewTabIcon />
          </TouchableOpacity>
        </View>

        <View style={styles.boxRight}>
          <TouchableOpacity
            style={styles.tabRight}
            onPress={handleOpenChangeNetwork}
          >
            <View style={styles.icon}>{NetworkIcon}</View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tabAccount}
            onPress={handleOpenChangeAccount}
          >
            <Text
              color={theme.colors.grey4}
              fontSize={12}
              ellipsizeMode={'middle'}
              numberOfLines={1}
            >
              {selectedAccountName ?? 'Account'}
            </Text>
          </TouchableOpacity>
          <Menu
            style={[
              styles.boxMenu,
              {
                top:
                  Platform.OS === 'ios'
                    ? height -
                      normalize(65)('moderate') -
                      (insets.bottom > 20 ? 18 : 0)
                    : height - normalize(135)('moderate') - insets.bottom,
              },
            ]}
            visible={visible}
            anchor={
              <TouchableOpacity onPress={hanleOption} style={styles.optionIcon}>
                <VerticalDotIcon color={theme.colors.grey4} />
              </TouchableOpacity>
            }
            onRequestClose={hanleOption}
          >
            <MenuItem
              onPress={() => {
                handleHistoryPress()
              }}
              style={[styles.itemPopup, styles.mt12]}
            >
              <View style={styles.rowPopup}>
                <View style={styles.boxIcon}>
                  <RecentIcon
                    width={14}
                    height={14}
                    color={theme.colors.primary50}
                  />
                </View>
                <Text style={styles.textPopup} variant="medium">
                  Recent Tab
                </Text>
              </View>
            </MenuItem>
            <MenuItem
              onPress={() => handleCreateNewTab(true)}
              style={styles.itemPopup}
            >
              <View style={styles.rowPopup}>
                <View style={styles.boxIcon}>
                  <IgconitoTab color={theme.colors.primary50} />
                </View>
                <Text style={styles.textPopup} variant="medium">
                  New Incognito Tab
                </Text>
              </View>
            </MenuItem>
            <MenuItem onPress={handleToBookmark} style={styles.itemPopup}>
              <View style={styles.rowPopup}>
                <View style={styles.boxIcon}>
                  <Bookmarks color={theme.colors.primary} />
                </View>
                <Text style={styles.textPopup} variant="medium">
                  Bookmark
                </Text>
              </View>
            </MenuItem>
          </Menu>
        </View>
      </View>

      <BottomSheet
        ref={modalizeChangeAccountRef}
        modalHeight={MAX_HEIGHT * 0.4 + insets.bottom}
        HeaderComponent={HeaderAccountComponent}
        FloatingComponent={FloatingComponent}
        handlePosition={'inside'}
        handleStyle={styles.modalHandle}
        adjustToContentHeight={false}
        flatListProps={{
          data: accountList,
          keyExtractor: keyExtractor,
          renderItem: renderAccountItem,
          style: styles.accountItem,
        }}
      />

      <BottomSheet
        ref={modalizeChangeNetworkRef}
        modalHeight={MAX_HEIGHT * 0.4 + insets.bottom}
        HeaderComponent={HeaderNetworkComponent}
        FloatingComponent={FloatingComponent}
        handlePosition={'inside'}
        handleStyle={styles.modalHandle}
        adjustToContentHeight={false}
        flatListProps={{
          data: networkList,
          keyExtractor: keyExtractor,
          renderItem: renderNetworkItem,
          style: styles.accountItem,
        }}
      />
    </>
  )
}

const useStyles = makeStyles<DappBottomTabProps>()(
  ({ colors, normalize, font }) => ({
    root: {
      flexDirection: 'row',
      alignItems: 'center',
      width: MAX_WIDTH,
      height: normalize(50)('moderate'),
      paddingHorizontal: normalize(12)('moderate'),
    },
    accountItem: {
      marginVertical: normalize(6)('vertical'),
    },
    accountWrapper: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      marginHorizontal: normalize(10)('horizontal'),
    },
    titleWrapper: {
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      paddingLeft: normalize(10)('horizontal'),
    },
    nameTitle: {
      fontSize: font.size.s3,
      paddingLeft: normalize(10)('horizontal'),
      color: colors.grey4,
    },
    nameTitleSelected: {
      fontSize: font.size.s3,
      paddingLeft: normalize(10)('horizontal'),
      color: colors.primary,
    },
    floatComponent: {
      backgroundColor: colors.white,
    },
    headerWrapper: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: normalize(20)('vertical'),
      paddingBottom: normalize(10)('vertical'),
      borderBottomWidth: 1,
      borderBottomColor: colors.grey14,
    },
    title: {
      fontSize: normalize(16)('moderate'),
    },
    headerSeparator: {
      height: 1,
      width: '100%',
      // backgroundColor: colors.grey14,
    },
    modalHandle: {
      backgroundColor: colors.grey13,
      width: '15%',
      height: normalize(3)('vertical'),
    },
    box: {
      borderWidth: normalize(1)('moderate'),
      borderColor: colors.grey12,
      borderRadius: normalize(100)('moderate'),
      paddingHorizontal: normalize(5)('horizontal'),
      paddingVertical: normalize(5)('vertical'),
      width: normalize(70)('horizontal'),
      justifyContent: 'center',
      alignItems: 'center',
    },
    textAccount: {
      fontSize: font.size.s5,
      width: normalize(60)('horizontal'),
    },
    icon: {
      height: normalize(26)('vertical'),
      width: normalize(26)('vertical'),
      justifyContent: 'center',
    },
    tab: {
      flexDirection: 'row',
    },
    tabRight: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    tabAccount: {
      width: '40%',
      borderWidth: normalize(1)('moderate'),
      borderColor: colors.grey12,
      borderRadius: normalize(16)('moderate'),
      paddingHorizontal: normalize(4)('horizontal'),
      height: normalize(28)('moderate'),
      alignItems: 'center',
      justifyContent: 'center',
    },
    rowPopup: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    optionIcon: {
      zIndex: 200,
      justifyContent: 'center',
      marginRight: normalize(-5)('moderate'),
      paddingVertical: normalize(10)('moderate'),
      paddingHorizontal: normalize(5)('moderate'),
    },
    boxMenu: {
      borderRadius: normalize(5)('moderate'),
      paddingTop: normalize(5)('moderate'),
    },
    itemPopup: {
      justifyContent: 'center',
      height: normalize(30)('moderate'),
      marginVertical: normalize(5)('moderate'),
      marginLeft: normalize(Platform.OS === 'ios' ? 5 : -10)('moderate'),
    },
    textPopup: {
      fontSize: font.size.s4,
      lineHeight: normalize(20)('horizontal'),
      paddingLeft: normalize(10)('horizontal'),
      color: colors.primary50,
    },
    boxLeft: {
      flexDirection: 'row',
      width: MAX_WIDTH * 0.5155,
      justifyContent: 'space-between',
    },
    boxRight: {
      flexDirection: 'row',
      width: MAX_WIDTH * 0.4,
      justifyContent: 'space-around',
      alignItems: 'center',
      marginLeft: normalize(MAX_WIDTH * 0.025)('moderate'),
    },
    boxIcon: {
      backgroundColor: colors.primary5,
      marginLeft: normalize(10)('moderate'),
      width: normalize(24)('moderate'),
      height: normalize(24)('moderate'),
      borderRadius: 4,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
    },
    mt12: {
      marginTop: normalize(12)('moderate'),
    },
    hideInfo: {
      position: 'absolute',
      right: 0,
      marginRight: MAX_WIDTH * 0.075,
      padding: normalize(10)('moderate'),
    },
    groupWallet: {
      borderWidth: normalize(1)('moderate'),
      borderColor: colors.primary50,
      borderRadius: normalize(16)('moderate'),
      height: normalize(28)('moderate'),
      justifyContent: 'center',
      alignContent: 'center',
      paddingHorizontal: normalize(18)('moderate'),
    },
  }),
)
