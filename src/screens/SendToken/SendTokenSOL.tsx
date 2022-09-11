import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { Contacts, DangerIcon, Scan } from '@assets/icons'
import {
  Button,
  Modalize,
  Switch,
  Text,
  TextInput,
  ToastPayload,
} from '@components'
import {
  FrequentRpc,
  NetworkType,
  TokenPlatform,
  Transaction,
} from '@extracy-wallet-controller'
import { useAppSelector } from '@hooks'
import crashlytics from '@react-native-firebase/crashlytics'
import { makeStyles, useTheme } from '@themes'
import { amountInputFormat, balanceFormat, isAddressSOL } from '@ultils'
import { BigNumber } from 'bignumber.js'
import { useNavigation } from 'navigation/NavigationService'
import {
  Dimensions,
  GestureResponderEvent,
  TouchableOpacity,
  View,
} from 'react-native'

import Engine from '../../core/Engine'
import { AddContactBottomsheet } from './AddContactBottomsheet'
import { InvoiceBottomSheet } from './InvoiceBottomSheet'

const { height, width } = Dimensions.get('screen')

export type SendTokenSOLProps = {
  rightIconPress?: (event: GestureResponderEvent) => void
  isValidScan: boolean
  errorAddressScan: string
  recipientAddressScan: string
  tokenPlatform: TokenPlatform
  networkToChoose: Network
  totalAccountBalance: string
}
export type Network = {
  label?: string
  value: string
  icon?: () => void
} & TokenPlatform &
  FrequentRpc

export const SendTokenSOL: FC<SendTokenSOLProps> = (props: any) => {
  const {
    rightIconPress,
    recipientAddressScan,
    isValidScan,
    errorAddressScan,
    networkToChoose,
    totalAccountBalance,
    tokenPlatform,
  } = props

  const {
    theme: { theme: themeStore },
  } = useAppSelector((stateRoot) => stateRoot.root)

  const selectedAccountIndex = useAppSelector(
    (state) =>
      state.root.engine.backgroundState.PreferencesController
        ?.selectedAccountIndex,
  )
  const selectContact = useAppSelector(
    (state) => state.root.contact.selectContact,
  )
  const tokenBalances = useAppSelector(
    (state) =>
      state.root.engine.backgroundState.TokenBalancesController?.tokenBalances,
  )
  const { TransactionController, TokenBalancesController } = Engine.context

  const styles = useStyles(props, themeStore)
  const theme = useTheme(themeStore)
  const navigation = useNavigation()

  const addContactRef = useRef<Modalize>(null)
  const modalizeInvoiceRef = useRef<Modalize>(null)

  const [isValid, setValid] = useState<boolean>(isValidScan)
  const [recipientAddress, setReceiveAddress] =
    useState<string>(recipientAddressScan)
  const [errorAddress, setErrorAddress] = useState<string>(errorAddressScan)
  const [sendValue, setSendValue] = useState<string>('0')
  const [sendValueError, setSendValueError] = useState<string>('')

  const [nameInput, setNameInput] = useState<string>('')
  const [isSwitch, setSwitch] = useState<boolean>(false)
  const [nameContact, setNameContact] = useState<string>('')
  const [totalNativeToken, setTotalNativeToken] = useState<string>('')

  const selectedAddress =
    Engine.context.PreferencesController?.getSelectedAddress(
      networkToChoose.networkType as any,
    )

  useEffect(() => {
    // get total native token for detect max amount user can send
    const totalNativeToken =
      //@ts-ignore
      tokenBalances?.[selectedAccountIndex]?.[networkToChoose.networkType]?.[
        tokenPlatform.token_id
      ]?.balance

    setTotalNativeToken(totalNativeToken)
  }, [
    totalAccountBalance,
    tokenPlatform.token_id,
    networkToChoose,
    networkToChoose.networkType,
    selectedAccountIndex,
    tokenBalances,
  ])

  const checkExist = useCallback(async () => {
    if (selectedAccountIndex !== undefined) {
      const checkContactExist =
        await Engine.context.WhiteListController?.checkContact({
          name: nameInput,
          address: recipientAddress,
          index: selectedAccountIndex,
        })
      checkContactExist
        ? setNameContact(checkContactExist.name)
        : setNameContact('')
    }
  }, [nameInput, recipientAddress, selectedAccountIndex])

  const handleOpenAddWhiteListBottomSheet = useCallback(() => {
    setSwitch(true)
    addContactRef.current?.open()
  }, [])

  const handleCloseInvoiceBottomSheet = useCallback(() => {
    modalizeInvoiceRef.current?.close()
  }, [])

  /**
   * open review transaction bottom sheet
   */
  const handleOpenInvoiceBottomSheet = useCallback(() => {
    modalizeInvoiceRef.current?.open()
  }, [])

  const handleOpenWhiteList = useCallback(
    () => navigation.navigate('WhiteList', { routeName: 'WhiteList' }),
    [navigation],
  )
  const hanldeSwitch = useCallback(() => {
    setSwitch(!isSwitch)
  }, [isSwitch])

  const handleAddWhiteList = useCallback(
    async (nameInput, address) => {
      if (selectedAccountIndex !== undefined) {
        await Engine.context.WhiteListController?.addContact({
          name: nameInput,
          address,
          index: selectedAccountIndex,
        })
        checkExist()
        setNameInput('')
        addContactRef.current?.close()
      }
    },
    [checkExist, selectedAccountIndex],
  )

  const handleCloseAddWhite = useCallback(() => {
    setSwitch(false)
  }, [])

  const handleGetAddress = useCallback(async () => {
    if (selectContact.address !== '') {
      setReceiveAddress(selectContact.address)
      setNameContact(selectContact.name)
      setErrorAddress('')
      setValid(true)
    } else {
      setReceiveAddress(recipientAddressScan)
      checkExist()
    }
  }, [
    checkExist,
    recipientAddressScan,
    selectContact.address,
    selectContact.name,
  ])

  /**
   * nomalize value input
   */
  useEffect(() => {
    const result = amountInputFormat(sendValue)
    setSendValue(result ? result : '')
    if (new BigNumber(sendValue).gt(new BigNumber(totalAccountBalance))) {
      setSendValueError('Insufficient fund for transfer')
    } else {
      const checkMaxAmountCanSend = new BigNumber(totalAccountBalance).minus(
        new BigNumber('0.000005'),
      )

      if (new BigNumber(sendValue).gt(new BigNumber(checkMaxAmountCanSend))) {
        setSendValueError('Insufficient fund for transfer')
      } else {
        setSendValueError('')
      }
    }
  }, [sendValue, tokenPlatform.isNative, totalAccountBalance])

  useEffect(() => {
    handleGetAddress()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const validaterecipientAddress = useCallback(async () => {
    const checkAddressSOL = await isAddressSOL(recipientAddress)
    if (tokenPlatform.isNative) {
      if (new BigNumber('0.000005').gte(new BigNumber(totalAccountBalance))) {
        setSendValueError('Insufficient fund for transfer')
      } else {
        setSendValueError('')
      }
    }
    if (recipientAddress === '') {
      setErrorAddress('Address is Required')
      setValid(false)
      setSendValue('0')
    } else if (!checkAddressSOL) {
      setErrorAddress('This is not in the correct format of address')
      setValid(false)
      setSendValue('0')
    } else {
      setErrorAddress('')
      setValid(true)
    }

    await checkExist()
  }, [
    checkExist,
    recipientAddress,
    tokenPlatform.isNative,
    totalAccountBalance,
  ])

  const rightIconAddressComponent = useMemo(() => {
    return (
      <>
        <TouchableOpacity onPress={rightIconPress}>
          <Scan />
        </TouchableOpacity>

        {/* go to whitelist */}
        <TouchableOpacity style={styles.icon} onPress={handleOpenWhiteList}>
          <Contacts />
        </TouchableOpacity>
      </>
    )
  }, [handleOpenWhiteList, rightIconPress, styles.icon])

  const handleMaxBalance = useCallback(() => {
    const maxAmountCanSend = new BigNumber(totalNativeToken).minus(
      new BigNumber('0.000005'),
    )
    setSendValue(maxAmountCanSend.toString())
  }, [totalNativeToken])

  const rightIconBalanceComponent = useMemo(() => {
    return (
      <>
        <View style={styles.boxTokenName}>
          <Text style={styles.textColorGrey10} fontSize={12} variant="bold">
            {networkToChoose.symbol}
          </Text>
        </View>
        <TouchableOpacity style={styles.item} onPress={handleMaxBalance}>
          <Text style={styles.textMAX} fontSize={12} variant="bold">
            {'MAX'}
          </Text>
        </TouchableOpacity>
      </>
    )
  }, [
    handleMaxBalance,
    networkToChoose.symbol,
    styles.boxTokenName,
    styles.item,
    styles.textColorGrey10,
    styles.textMAX,
  ])

  const handleSendSol = useCallback(async () => {
    try {
      if (TransactionController) {
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'MainStack',
            },
          ],
        })

        const rawTransaction: Transaction<NetworkType.SOL> = {
          from: selectedAddress ? selectedAddress : '',
          to: recipientAddress,
          value: sendValue,
        }

        const { result: transactionHashPromise, transactionMeta } =
          await TransactionController.addTransaction(
            networkToChoose.networkType,
            networkToChoose.token_id,
            String(networkToChoose.symbol),
            rawTransaction,
          )

        // submit toast notification
        // eslint-disable-next-line no-undef
        toast.show('', {
          data: {
            type: 'submited',
          } as ToastPayload,
        })

        requestAnimationFrame(async () => {
          await TransactionController.approveTransaction(
            networkToChoose.networkType,
            networkToChoose.token_id,
            transactionMeta.id,
          )

          // Promise waiting for transaction confirmation
          const transactionHash = await transactionHashPromise

          if (transactionHash) {
            await crashlytics().setAttribute(
              'User send transaction success with transactionHash',
              JSON.stringify(transactionHash),
            )

            // update balance after transaction done
            await TokenBalancesController?.updateBalances()

            // eslint-disable-next-line no-undef
            toast.show('', {
              data: {
                type: 'completed',
                transactionHash,
              } as ToastPayload,
            })
          }
        })
      }
    } catch (error) {
      console.log('[handleSendSol]', error)
    }
  }, [
    TokenBalancesController,
    TransactionController,
    recipientAddress,
    networkToChoose,
    navigation,
    sendValue,
    selectedAddress,
  ])
  const handleClickTextAddWhiteList = () => {
    hanldeSwitch()
    !isSwitch && handleOpenAddWhiteListBottomSheet()
  }
  return (
    <>
      <View style={styles.container}>
        <View style={styles.body}>
          <>
            <TextInput
              labelText={nameContact ? nameContact : 'Address'}
              labelStyle={nameContact ? styles.labelNameStyle : () => {}}
              placeholder={'Search, public address'}
              value={recipientAddress}
              onChangeText={setReceiveAddress}
              onEndEditing={validaterecipientAddress}
              containerStyle={styles.inputContainerStyle}
              rightIcon={rightIconAddressComponent}
            />

            <View style={styles.groupError}>
              {errorAddress !== '' && (
                <>
                  <DangerIcon />
                  <Text style={styles.text}>{errorAddress}</Text>
                </>
              )}
            </View>
          </>
          <>
            <TextInput
              labelText={'Amount'}
              placeholder={'Type amount transaction'}
              value={sendValue}
              onChangeText={setSendValue}
              containerStyle={styles.inputContainerStyle}
              keyboardType={'numeric'}
              rightIcon={rightIconBalanceComponent}
              style={{
                color:
                  Number(sendValue) === 0
                    ? theme.colors.grey12
                    : theme.colors.grey4,
              }}
            />

            <View style={styles.groupError}>
              {sendValueError !== '' && (
                <>
                  <DangerIcon />
                  <Text style={styles.text}>{sendValueError}</Text>
                </>
              )}
            </View>
          </>
          <View style={styles.rowBalance}>
            <Text
              style={styles.textColorGrey10}
              variant="bold"
              fontSize={12}
              lineHeight={14}
            >
              Available
            </Text>
            <Text style={styles.textColorGrey10} fontSize={12} lineHeight={14}>
              {`${balanceFormat(Number(totalAccountBalance).toString())} ${
                networkToChoose.symbol
              }`}
            </Text>
          </View>

          {/* save whitelist */}
          {nameContact === '' && isValid && (
            <View style={styles.switch}>
              <Text
                style={styles.textSwitch}
                fontSize={16}
                onPress={handleClickTextAddWhiteList}
              >
                Add this address to your whitelist
              </Text>
              <View style={styles.customSwitch}>
                <Switch
                  handleTurnOn={handleOpenAddWhiteListBottomSheet}
                  isSwitch={isSwitch}
                  onPress={hanldeSwitch}
                />
              </View>
            </View>
          )}
        </View>
      </View>
      <View style={styles.groupButton}>
        <Button
          text="Send"
          disabled={
            !(isValid && sendValue) ||
            !!sendValueError ||
            Number(sendValue) > Number(totalAccountBalance)
          }
          onPress={handleOpenInvoiceBottomSheet}
        />
      </View>
      <AddContactBottomsheet
        ref={addContactRef}
        handleAddWhite={() => handleAddWhiteList(nameInput, recipientAddress)}
        handleCloseAddWhite={handleCloseAddWhite}
        nameInput={nameInput}
        setNameInput={setNameInput}
      />
      <InvoiceBottomSheet
        ref={modalizeInvoiceRef}
        addressFrom={selectedAddress ? selectedAddress : ''}
        addressTo={recipientAddress}
        networkTicker={networkToChoose?.symbol + ''}
        tokenTicker={networkToChoose.symbol}
        sendValue={sendValue}
        transactionFee={'0.000005'}
        handleCloseInvoiceBottomSheet={handleCloseInvoiceBottomSheet}
        handleSendTransaction={handleSendSol}
      />
    </>
  )
}

const useStyles = makeStyles<SendTokenSOLProps>()(({ normalize, colors }) => ({
  container: {
    height: height * 0.6,
    position: 'relative',
    marginTop: normalize(-10)('vertical'),
  },
  body: {
    top: normalize(20)('vertical'),
    position: 'absolute',
    width: width - 10,
    flexDirection: 'column',
    alignItems: 'center',
  },
  groupButton: {
    width: width - normalize(32)('vertical'),
    bottom: normalize(16)('vertical'),
    left: normalize(16)('vertical'),
    right: normalize(16)('vertical'),
  },
  text: {
    color: colors.alert,
    left: normalize(5)('horizontal'),
  },
  inputContainerStyle: {
    width: width * 0.91,
    marginLeft: normalize(3)('horizontal'),
  },
  icon: {
    paddingLeft: normalize(12)('vertical'),
  },
  item: {
    height: normalize(22)('horizontal'),
    marginRight: normalize(2)('horizontal'),
    paddingHorizontal: normalize(8)('horizontal'),
    borderRadius: normalize(4)('horizontal'),
    backgroundColor: colors.primary0,
    justifyContent: 'center',
  },
  textMAX: {
    color: colors.primary35,
  },
  switch: {
    width: width * 0.91,
    flexDirection: 'row',
    paddingVertical: normalize(30)('horizontal'),
    alignItems: 'center',
  },
  textSwitch: {
    flex: 1,
    color: colors.grey4,
  },
  groupError: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    paddingLeft: normalize(15)('horizontal'),
    paddingBottom: normalize(10)('horizontal'),
    height: normalize(30)('vertical'),
    flexDirection: 'row',
  },
  labelNameStyle: {
    color: colors.primary,
  },
  boxTokenName: {
    paddingHorizontal: normalize(8)('horizontal'),
    paddingVertical: normalize(4)('vertical'),
    marginHorizontal: normalize(12)('horizontal'),
    borderRadius: normalize(4)('moderate'),
    backgroundColor: colors.grey16,
  },
  textColorGrey10: {
    color: colors.grey10,
  },
  rowBalance: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingVertical: normalize(16)('vertical'),
    paddingHorizontal: normalize(12)('horizontal'),
    backgroundColor: colors.grey16,
    borderRadius: normalize(8)('moderate'),
    width: width * 0.91,
    marginLeft: normalize(3)('horizontal'),
  },
  customSwitch: {
    margin: normalize(-5)('moderate'),
  },
}))
