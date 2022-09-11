import React, { useCallback, useState } from 'react'

import {
  BulletedListIcon,
  CookiesIcon,
  DollarIcon,
  LockIcon,
  NextIcon,
  RewindClockIcon,
  ShieldIcon,
  TranslateIcon,
  TrashCanIcon,
} from '@assets/icons'
import { Container, Header, SectionedList, Text, Dialog } from '@components'
import { useAppDispatch, useAppSelector, useBiometry } from '@hooks'
import { StackActions } from '@react-navigation/native'
import { makeStyles } from '@themes'
import { clearAll } from '@ultils'
import Engine from 'core/Engine'
import { delay } from 'lodash'
import { useNavigation } from 'navigation'
import { useProvider } from 'provider'
import { View, TouchableWithoutFeedback } from 'react-native'
import {
  clearBrowserHistory,
  closeAllTab,
  deleteAll,
  removeAllBookmark,
  setProcessOnBoarding,
  setNotLogin,
} from 'reduxs/reducers'

interface Item {
  prefix?: React.ReactElement
  suffix?: React.ReactElement
  title?: string
  onPress?: () => void
}

interface ItemArray {
  title: string
  data: Item[]
}

export const Setting = () => {
  const themeStore = useAppSelector((state) => state.root.theme.theme)
  const styles = useStyles(undefined, themeStore)

  const [modalVisible, setModalVisible] = useState(false)
  const [modalType, setModalType] = useState<
    'removeWallet' | 'clearHistory' | 'clearCookies'
  >('removeWallet')
  const { handleRemoveWallet } = useProvider()
  const {
    deleteKeychainPassword,
    biometryConfig,
    passwordConfig,
    BIOMETRY_KEYCHAIN_NAME,
    PASSWORD_KEYCHAIN_NAME,
  } = useBiometry()
  const dispatch = useAppDispatch()
  const navigation = useNavigation()

  const handleLogout = useCallback(async () => {
    setModalVisible(false)
    handleRemoveWallet()
    const { KeyringController } = Engine.context
    dispatch(closeAllTab())
    await KeyringController?.setLocked()
    await clearAll()
    await deleteKeychainPassword(biometryConfig, BIOMETRY_KEYCHAIN_NAME)
    await deleteKeychainPassword(passwordConfig, PASSWORD_KEYCHAIN_NAME)
    await Engine.resetState()
    dispatch(setProcessOnBoarding(false))
    dispatch(setNotLogin(true))
    dispatch(deleteAll())
    dispatch(removeAllBookmark())
  }, [
    BIOMETRY_KEYCHAIN_NAME,
    PASSWORD_KEYCHAIN_NAME,
    biometryConfig,
    deleteKeychainPassword,
    dispatch,
    handleRemoveWallet,
    passwordConfig,
  ])

  const data: ItemArray[] = [
    {
      title: 'General',
      data: [
        {
          prefix: <BulletedListIcon width={25} height={25} />,
          title: 'White List Contact',
          onPress: () =>
            navigation.navigate('WhiteList', { routeName: 'Setting' }),
          suffix: <NextIcon width={12} height={12} />,
        },
        {
          prefix: <TranslateIcon width={25} height={25} />,
          title: 'Language',
          onPress: () => navigation.navigate('Language'),
          suffix: <NextIcon width={12} height={12} />,
        },
        {
          prefix: <DollarIcon width={25} height={25} />,
          title: 'Currency Conversion',
          onPress: () => navigation.navigate('CurrencyConversion'),
          suffix: <NextIcon width={12} height={12} />,
        },
      ],
    },
    {
      title: 'Security',
      data: [
        {
          prefix: <LockIcon width={25} height={25} />,
          title: 'Reveal Seed Phrase',
          onPress: () =>
            delay(
              () => navigation.dispatch(StackActions.push('RevealSeedPhrase')),
              200,
            ),
          suffix: <NextIcon width={12} height={12} />,
        },
        {
          prefix: <ShieldIcon width={25} height={25} />,
          title: 'Security',
          onPress: () => navigation.navigate('SecuritySettings'),
          suffix: <NextIcon width={12} height={12} />,
        },
      ],
    },
    {
      title: 'Network',
      data: [
        {
          prefix: <RewindClockIcon width={25} height={25} />,
          title: 'Delete History',
          onPress: () => {
            setModalType('clearHistory')
            setModalVisible(true)
          },
          suffix: <NextIcon width={12} height={12} />,
        },
        // {
        //   prefix: <CookiesIcon width={25} height={25} />,
        //   title: 'Delete Cookies',
        //   onPress: () => {
        //     setModalType('clearCookies')
        //     setModalVisible(true)
        //   },
        //   suffix: <NextIcon width={12} height={12} />,
        // },
      ],
    },
    {
      title: '',
      data: [
        {
          prefix: <TrashCanIcon width={25} height={25} />,
          title: 'Remove Wallet',
          onPress: () => {
            setModalType('removeWallet')
            setModalVisible(true)
          },
          suffix: <NextIcon width={12} height={12} />,
        },
      ],
    },
  ]

  const handleAlertAcceptPress = () => {
    switch (modalType) {
      case 'clearHistory':
        dispatch(clearBrowserHistory())
        break
      case 'removeWallet':
        handleLogout()
        break
      // case 'clearCookies':
      //   break
    }
  }

  const renderItem = ({ item, index }: { item: Item; index: number }) => {
    return (
      <TouchableWithoutFeedback onPress={item.onPress}>
        <View
          style={[
            styles.itemWrapper,
            index !== data[index].data.length && styles.borderBottom,
          ]}
        >
          <View style={styles.itemPrefixWrapper}>{item.prefix}</View>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <View style={styles.itemSuffixWrapper}>{item.suffix}</View>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  return (
    <Container edges={['right', 'left']} style={styles.root}>
      <Header title="Setting" disableBack />
      <View style={styles.container}>
        <SectionedList
          data={data}
          enableSeparator
          style={styles.container}
          renderItem={renderItem}
          stickySectionHeadersEnabled={false}
        />

        <Dialog
          isRemove={true}
          title={
            modalType === 'clearCookies'
              ? 'Clear Browser Cookies'
              : modalType === 'clearHistory'
              ? 'Clear Browser History'
              : 'Are you sure you want to erase your wallet?'
          }
          titleAccept={
            modalType === 'clearCookies' || modalType === 'clearHistory'
              ? 'Clear'
              : 'Remove'
          }
          isVisible={modalVisible}
          setIsVisible={setModalVisible}
          handleAccept={handleAlertAcceptPress}
        >
          {modalType !== 'removeWallet' && (
            <Text fontSize={14} lineHeight={20} style={styles.textModal}>
              {modalType === 'clearCookies'
                ? `Are you sure you want to remove all the browser's cookies ?`
                : `Are you sure you want to remove all the browser's history ?`}
            </Text>
          )}
          {modalType === 'removeWallet' && (
            <Text fontSize={14} lineHeight={20} style={styles.textModal}>
              You current wallet, accounts and assets will be{' '}
              <Text variant="bold" fontSize={14} lineHeight={20}>
                removed from this app permanetly.
              </Text>
              This action cannot be undone.
            </Text>
          )}
        </Dialog>
      </View>
    </Container>
  )
}

const useStyles = makeStyles()(({ normalize, colors, font }) => ({
  root: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.grey16,
  },
  container: {
    marginHorizontal: normalize(6)('horizontal'),
    paddingBottom: normalize(50)('vertical'),
  },
  itemWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: normalize(10)('horizontal'),
    paddingVertical: normalize(7)('vertical'),
  },
  itemPrefixWrapper: {
    padding: normalize(7)('moderate'),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: normalize(10)('horizontal'),
  },
  itemTitle: {
    fontSize: font.size.s4,
  },
  itemSuffixWrapper: {
    marginRight: normalize(7)('horizontal'),
    marginLeft: 'auto',
  },
  textModal: {
    textAlign: 'center',
    width: normalize(280)('horizontal'),
  },
  borderBottom: {
    borderBottomWidth: 1.4,
    borderColor: colors.grey16,
  },
}))
