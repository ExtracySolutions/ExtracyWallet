import React, { FC, useRef, useCallback, useState, useEffect } from 'react'

import { DangerIcon, CancelIcon, CustomIcon } from '@assets/icons'
import {
  Text,
  BottomSheet,
  Modalize,
  TextInput,
  Button,
  SelectedItem,
} from '@components'
import { Identity, TokenPlatform } from '@extracy-wallet-controller'
import { useAppDispatch, useAppSelector } from '@hooks'
import { CommonActions } from '@react-navigation/native'
import { makeStyles } from '@themes'
import { balanceFormat } from '@ultils'
import Engine from 'core/Engine'
import { isEmpty } from 'lodash'
import { useNavigation } from 'navigation'
import { useProvider } from 'provider'
import { View, TouchableOpacity, Dimensions, Platform } from 'react-native'
import Jazzicon from 'react-native-jazzicon'
import Animated from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { addTotalPrice, handleDislayBalance } from 'reduxs/reducers'

export type HeaderProps = {
  avatarHeader: any
  nameAccount: any
  boxIconFilter: any
}

type IdentityList =
  | {
      [accountIndex: number]: Identity
    }
  | undefined

const { height: MAX_HEIGHT, width } = Dimensions.get('screen')

export enum FeatAccount {
  addAccount = 'addAccount',
  renameAccount = 'renameAccount',
}

export const HeaderInfoAccount: FC<HeaderProps> = (props) => {
  const themeStore = useAppSelector((state) => state.root.theme.theme)
  const { tokenList, dataAPI } = useAppSelector((state) => state.root.tokenList)
  const { hideBalance } = useAppSelector((state) => state.root.tokenList)

  const { PreferencesController } = useAppSelector(
    (state) => state.root.engine.backgroundState,
  )
  const totalPrices = useAppSelector((state) => state.root.tokenList.totalPrice)
  const selectedAccountIndex = useAppSelector(
    (state) =>
      state.root.engine.backgroundState.PreferencesController
        ?.selectedAccountIndex,
  )
  const tokenBalances = useAppSelector(
    (state) =>
      state.root.engine.backgroundState.TokenBalancesController?.tokenBalances,
  )

  const styles = useStyles(props, themeStore)
  const insets = useSafeAreaInsets()
  const modalizeChangeAccountRef = useRef<Modalize>(null)
  const modalizeCreateAccountRef = useRef<Modalize>(null)
  const { canOpenWallet } = useProvider()
  const [accountName, setAccountName] = useState<string>(
    canOpenWallet
      ? `Account ${
          PreferencesController &&
          Object.keys(PreferencesController?.identities).length + 1
        }`
      : '',
  )
  const [accountList, setAccountList] = useState<Identity[]>()
  const [currentAccName, setCurrentAccName] = useState<string>('')
  const [isCreate, setCreate] = useState<boolean>(false)
  const [errorName, setErrorName] = useState<string>('')
  const [isValidName, setValidName] = useState<boolean>(true)
  const [isFocus, setFocus] = useState<boolean>(false)
  const [isRename, setRename] = useState<boolean>(false)
  const [totalPrice, setTotalPrice] = useState<number>(0)
  const navigation = useNavigation()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (isFocus && accountName === '') {
      setErrorName('Name is Required')
      setValidName(false)
    } else if (isFocus && accountName !== '') {
      setErrorName('')
      setValidName(true)
    }
  }, [accountName, isFocus])
  useEffect(() => {
    // update total balance
    try {
      requestAnimationFrame(() => {
        if (
          !isEmpty(tokenBalances) &&
          tokenBalances &&
          selectedAccountIndex?.toString() &&
          !isEmpty(tokenList[selectedAccountIndex])
        ) {
          let totalBalanceRaw = 0
          tokenList[selectedAccountIndex].forEach((token) => {
            token.platform.forEach((item: TokenPlatform) => {
              if (token.coingecko_id) {
                if (
                  item.isNative &&
                  !isEmpty(
                    tokenBalances?.[selectedAccountIndex]?.[item.networkType]?.[
                      item.token_id
                    ]?.balance,
                  )
                ) {
                  totalBalanceRaw +=
                    Number(
                      tokenBalances?.[selectedAccountIndex]?.[
                        item.networkType
                      ]?.[item.token_id]?.balance,
                    ) * Number(dataAPI?.[token.coingecko_id]?.usd)
                } else if (
                  !isEmpty(
                    tokenBalances?.[selectedAccountIndex]?.[item.networkType]?.[
                      item.address
                    ]?.balance,
                  )
                ) {
                  totalBalanceRaw +=
                    Number(
                      tokenBalances?.[selectedAccountIndex]?.[
                        item.networkType
                      ]?.[item.address]?.balance,
                    ) * Number(dataAPI?.[token.coingecko_id]?.usd)
                }
              }
            })
          })

          setTotalPrice(totalBalanceRaw)
          dispatch(
            addTotalPrice({
              selectedAccount: selectedAccountIndex,
              totalPrice: totalBalanceRaw + '',
            }),
          )

          // setTotalBalance(totalBalanceRaw)
        }
      })
    } catch (error) {
      console.log('Update total balance failed!', error)
    }
  }, [dataAPI, dispatch, selectedAccountIndex, tokenBalances, tokenList])

  useEffect(() => {
    const identities: IdentityList = PreferencesController?.identities
    if (identities) {
      let identitiesArray: Identity[] = []
      Object.keys(identities).forEach((value, index) => {
        identitiesArray.push(identities[index])
      })
      Promise.all(identitiesArray)
      setAccountList(identitiesArray)
    }
    isCreate === false && modalizeCreateAccountRef.current?.close()
  }, [PreferencesController, isCreate])

  const handleOpen = useCallback(async () => {
    setCreate(false)
    modalizeChangeAccountRef.current?.open()

    // listRef.current?.scrollToIndex({
    //   animated: false,
    //   index: PreferencesController?.selectedAccountIndex,
    // })
    setErrorName('')
    setValidName(true)
    setAccountName(
      canOpenWallet
        ? `Account ${
            PreferencesController &&
            Object.keys(PreferencesController?.identities).length + 1
          }`
        : '',
    )
  }, [PreferencesController, canOpenWallet])

  const handleOpenCreateNewAccount = useCallback(
    (feat: string) => {
      if (feat === FeatAccount.addAccount) {
        modalizeChangeAccountRef.current?.close()
        modalizeCreateAccountRef.current?.open()
      } else if (feat === FeatAccount.renameAccount) {
        setAccountName(currentAccName)
        setRename(true)
        modalizeCreateAccountRef.current?.open()
      }
    },
    [currentAccName],
  )

  const handleCloseRename = useCallback(() => {
    setRename(false)
  }, [])

  useEffect(() => {
    if (PreferencesController) {
      const { identities, selectedAccountIndex } = PreferencesController
      if (identities) {
        setAccountName(`Account ${Object.keys(identities).length + 1}`)
        setCurrentAccName(identities[selectedAccountIndex]?.name ?? '')
      }
    }
  }, [PreferencesController, selectedAccountIndex])

  const handleCreateAccount = useCallback(async () => {
    setCreate(true)
    requestAnimationFrame(async () => {
      try {
        const { KeyringController } = Engine.context
        await KeyringController?.addNewAccount(accountName)
        modalizeCreateAccountRef.current?.close()

        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: 'Main',
              },
            ],
          }),
        )
      } catch (e) {
        console.log(e, 'error while trying to add a new account')
      }
    })
  }, [accountName, navigation])

  const handleRenameAccount = useCallback(() => {
    try {
      const { PreferencesController } = Engine.context
      selectedAccountIndex?.toString() &&
        PreferencesController?.setAccountLabel(
          selectedAccountIndex,
          accountName,
        )
      modalizeCreateAccountRef.current?.close()
    } catch (e) {
      console.log(e, 'error while trying to add a new account')
    }
  }, [accountName, selectedAccountIndex])

  const handleChangeAccount = useCallback(
    async (item: Identity) => {
      const { PreferencesController } = Engine.context
      await PreferencesController?.setSelectedAccountIndex(item.accountIndex)
      if (item.accountIndex !== selectedAccountIndex) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: 'Main',
              },
            ],
          }),
        )
      }
      modalizeChangeAccountRef.current?.close()
    },
    [navigation, selectedAccountIndex],
  )

  const handleHideBalance = useCallback(() => {
    dispatch(handleDislayBalance())
  }, [dispatch])

  const HeaderAccountComponent = useCallback(() => {
    return (
      <View style={styles.headerWrapper}>
        <Text variant="medium" style={styles.textBtnNew}>
          Your Account
        </Text>
      </View>
    )
  }, [styles.headerWrapper, styles.textBtnNew])

  const FooterAccountComponent = useCallback(() => {
    return (
      <View style={[styles.footerWrapper]}>
        <Button
          round
          variant="fulfill"
          text="Create New Account"
          onPress={() => handleOpenCreateNewAccount(FeatAccount.addAccount)}
        />
      </View>
    )
  }, [handleOpenCreateNewAccount, styles.footerWrapper])

  const HeaderCreateAccountComponent = useCallback(() => {
    return (
      <View style={styles.headerWrapper}>
        <Text variant="medium" style={styles.textBtnNew}>
          Create New Account
        </Text>
      </View>
    )
  }, [styles.headerWrapper, styles.textBtnNew])

  const FooterCreateAccountComponent = useCallback(() => {
    return (
      <View style={[styles.footerWrapper]}>
        {!isCreate ? (
          <Button
            round
            loading={isCreate}
            disabled={!isValidName || isCreate}
            variant="fulfill"
            text={isRename ? 'Rename' : 'Create'}
            onPress={isRename ? handleRenameAccount : handleCreateAccount}
          />
        ) : (
          //Fix dulicate account
          <Button round loading={true} variant="fulfill" text="Create" />
        )}
      </View>
    )
  }, [
    handleCreateAccount,
    handleRenameAccount,
    isCreate,
    isRename,
    isValidName,
    styles.footerWrapper,
  ])

  const FloatingComponent = useCallback(() => {
    if (insets.bottom === 0) {
      return null
    } else {
      return <View style={[styles.floatComponent, { height: insets.bottom }]} />
    }
  }, [insets.bottom, styles.floatComponent])

  const renderItem = useCallback(
    ({ item, index }: { item: Identity; index: number }) => {
      return (
        <SelectedItem
          key={index}
          selected={
            item.accountIndex === PreferencesController?.selectedAccountIndex
          }
          onPress={() => handleChangeAccount(item)}
          style={styles.accountItem}
        >
          <View style={styles.accountWrapper}>
            <Jazzicon size={33} seed={index} containerStyle={styles.jazzicon} />
            <View style={styles.titleWrapper}>
              <Text variant="medium" style={styles.nameTitle}>
                {item.name}
              </Text>
              <Text variant="medium" style={styles.totalPrice}>
                {`$ ${balanceFormat(
                  totalPrices[item.accountIndex].toString(),
                  2,
                )}`}
              </Text>
            </View>
          </View>
        </SelectedItem>
      )
    },
    [
      totalPrices,
      PreferencesController?.selectedAccountIndex,
      handleChangeAccount,
      styles.accountItem,
      styles.accountWrapper,
      styles.jazzicon,
      styles.nameTitle,
      styles.titleWrapper,
      styles.totalPrice,
    ],
  )

  return (
    <Animated.View style={styles.root}>
      <TouchableOpacity style={styles.boxIconEmty} />
      <View style={styles.account}>
        <Animated.View style={[props.avatarHeader, styles.boxAvatar]}>
          <TouchableOpacity style={[styles.icon]} onPress={handleOpen}>
            <Jazzicon size={53} seed={1} />
          </TouchableOpacity>
        </Animated.View>
        <View style={styles.groupText}>
          <TouchableOpacity
            onPress={() =>
              handleOpenCreateNewAccount(FeatAccount.renameAccount)
            }
          >
            <Animated.Text style={[styles.title, props.nameAccount]}>
              {currentAccName}
            </Animated.Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleHideBalance}
            style={styles.groupBalance}
          >
            <Text lineHeight={24} style={styles.text}>
              {hideBalance
                ? `**********`
                : `$ ${balanceFormat(totalPrice.toString(), 2)}`}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <Animated.View style={[styles.boxIcon, props.boxIconFilter]}>
        <TouchableOpacity>
          <CustomIcon />
        </TouchableOpacity>
      </Animated.View>
      {/* open when need it */}
      <BottomSheet
        ref={modalizeChangeAccountRef}
        modalHeight={MAX_HEIGHT * 0.4 + insets.bottom}
        HeaderComponent={HeaderAccountComponent}
        FooterComponent={FooterAccountComponent}
        FloatingComponent={FloatingComponent}
        adjustToContentHeight={false}
        flatListProps={{
          data: accountList,
          keyExtractor: (data, index) => index.toString(),
          renderItem: renderItem,
          getItemLayout: (data, index) => ({
            length: 35,
            offset: 75 * index,
            index,
          }),
          initialNumToRender: 2,
          // style: styles.list,
          initialScrollIndex:
            PreferencesController?.selectedAccountIndex &&
            PreferencesController?.selectedAccountIndex,
        }}
      />
      <BottomSheet
        ref={modalizeCreateAccountRef}
        HeaderComponent={HeaderCreateAccountComponent}
        FooterComponent={FooterCreateAccountComponent}
        FloatingComponent={FloatingComponent}
        onClose={handleCloseRename}
        keyboardAvoidingBehavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        scrollViewProps={{ keyboardShouldPersistTaps: 'handled' }}
      >
        <View style={styles.creatAccountModalContent}>
          <TextInput
            labelText={'Account Name'}
            value={accountName}
            maxLength={16}
            onFocusInput={() => setFocus(true)}
            onChangeText={setAccountName}
          />
        </View>
        {errorName !== '' && (
          <View style={styles.groupErrorName}>
            <DangerIcon />
            <Text style={styles.textDanger}>{errorName}</Text>
          </View>
        )}
      </BottomSheet>
    </Animated.View>
  )
}

const useStyles = makeStyles<HeaderProps>()(({ colors, font, normalize }) => ({
  root: {
    flexDirection: 'row',
    height: normalize(160)('moderate'),
    paddingVertical: normalize(15)('vertical'),
    backgroundColor: colors.primary50,
    borderBottomRightRadius: normalize(24)('moderate'),
    paddingHorizontal: normalize(16)('horizontal'),
  },
  icon: {
    alignItems: 'center',
  },
  account: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  groupText: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    alignSelf: 'center',
    fontSize: font.size.s4,
    color: colors.white,
    paddingTop: normalize(5)('moderate'),
    fontFamily: 'Inter-Medium',
  },
  textBtnNew: {
    alignSelf: 'center',
    fontSize: font.size.s3,
    color: colors.grey1,
    paddingTop: normalize(5)('moderate'),
    fontFamily: 'Inter-Medium',
  },
  text: {
    fontSize: font.size.s2,
    justifyContent: 'center',
    textAlign: 'center',
    color: colors.white,
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
  footerWrapper: {
    paddingHorizontal: normalize(15)('horizontal'),
    paddingVertical: normalize(5)('vertical'),
  },
  floatComponent: {
    backgroundColor: colors.white,
  },
  creatAccountModalContent: {
    marginHorizontal: normalize(20)('vertical'),
    marginVertical: normalize(30)('vertical'),
    position: 'relative',
  },
  accountItem: {
    marginVertical: normalize(6)('vertical'),
  },
  accountWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  jazzicon: {
    marginHorizontal: normalize(10)('horizontal'),
  },
  titleWrapper: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
  nameTitle: {
    fontSize: font.size.s3,
  },
  groupErrorName: {
    position: 'absolute',
    left: normalize(20)('horizontal'),
    bottom: normalize(5)('vertical'),
    flexDirection: 'row',
  },
  textDanger: {
    color: colors.alert,
    fontSize: font.size.s5,
    position: 'relative',
    left: normalize(5)('horizontal'),
    paddingTop: normalize(2)('vertical'),
  },
  filterIcon: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  groupBalance: {
    flexDirection: 'row',
    height: normalize(35)('horizontal'),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    marginTop: normalize(8)('vertical'),
    paddingHorizontal: normalize(12)('horizontal'),
    borderRadius: normalize(24)('moderate'),
  },
  iconHide: {
    padding: 5,
  },
  hideInfo: {
    position: 'absolute',
    right: 0,
    marginRight: width * 0.075,
    padding: 10,
  },
  totalPrice: {
    fontSize: font.size.s4,
    color: colors.grey10,
  },
  boxIcon: {
    borderRadius: normalize(60)('moderate'),
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    height: normalize(32)('moderate'),
    width: normalize(32)('moderate'),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: normalize(2)('vertical'),
  },
  boxIconEmty: {
    height: normalize(32)('moderate'),
    width: normalize(32)('moderate'),
  },
  boxAvatar: {
    backgroundColor: colors.white,
    borderRadius: normalize(60)('moderate'),
    alignItems: 'center',
    justifyContent: 'center',
    height: normalize(56)('moderate'),
    width: normalize(56)('moderate'),
  },
}))
