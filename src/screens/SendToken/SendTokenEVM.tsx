import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { Contacts, DangerIcon, EditIcon, Scan } from '@assets/icons'
import {
  Button,
  Modalize,
  Switch,
  Text,
  TextInput,
  ToastPayload,
} from '@components'
import {
  estimateGas,
  FrequentRpc,
  NetworkType,
  TokenPlatform,
  Transaction,
} from '@extracy-wallet-controller'
import { useAppSelector } from '@hooks'
import crashlytics from '@react-native-firebase/crashlytics'
import { makeStyles, normalize, useTheme } from '@themes'
import {
  amountInputFormat,
  balanceFormat,
  calculateTransactionFree,
  DEFAULT_FREQUENT_RPC,
  gweiDecToWEIBN,
} from '@ultils'
import { BigNumber } from 'bignumber.js'
import { useNavigation } from 'navigation/NavigationService'
import {
  Dimensions,
  GestureResponderEvent,
  NativeSyntheticEvent,
  ScrollView,
  TextInputEndEditingEventData,
  TouchableOpacity,
  View,
} from 'react-native'
import { fromWei, isAddress, toDecimal, toHex, toWei } from 'web3-utils'

import Engine from '../../core/Engine'
import { AddContactBottomsheet } from './AddContactBottomsheet'
import { EditGasBottomSheet } from './EditGasBottomSheet'
import { InvoiceBottomSheet } from './InvoiceBottomSheet'

const { height, width } = Dimensions.get('screen')

export type SendTokenProps = {
  rightIconPress?: (event: GestureResponderEvent) => void
  isValidScan: boolean
  errorAddressScan: string
  recipientAddressScan: string
  networkToChoose: Network
  tokenPlatform: TokenPlatform
  totalAccountBalance: string
}
export type Network = {
  label?: string
  value: string
  icon?: () => void
} & TokenPlatform &
  FrequentRpc

export const SendTokenEVM: FC<SendTokenProps> = (props: any) => {
  const {
    theme: { theme: themeStore },
    contact: { selectContact },
  } = useAppSelector((stateRoot) => stateRoot.root)

  const tokenBalances = useAppSelector(
    (state) =>
      state.root.engine.backgroundState.TokenBalancesController?.tokenBalances,
  )
  const selectedAccountIndex = useAppSelector(
    (state) =>
      state.root.engine.backgroundState.PreferencesController
        ?.selectedAccountIndex,
  )

  const {
    PreferencesController,
    TransactionController,
    TokenBalancesController,
  } = Engine.context

  const styles = useStyles(props, themeStore)
  const theme = useTheme(themeStore)
  const navigation = useNavigation()
  const {
    networkToChoose,
    tokenPlatform,
    recipientAddressScan,
    rightIconPress,
    isValidScan,
    errorAddressScan,
    totalAccountBalance,
  } = props

  const addContactRef = useRef<Modalize>(null)
  const modalizeEditGasRef = useRef<Modalize>(null)
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
  const isCustom = useRef<boolean>(false)
  const isMax = useRef<boolean>(false)
  // for gas function
  const [gasPrice, setGasPrice] = useState<string>('')
  const [gasLimit, setGasLimit] = useState<string>('')
  const [totalNativeToken, setTotalNativeToken] = useState<string>('')

  const selectedAddress = PreferencesController?.getSelectedAddress(
    networkToChoose.networkType,
  )

  // get symbol network
  const nettworkChoose = DEFAULT_FREQUENT_RPC.find((item) => {
    return item.token_id === networkToChoose.token_id
  })

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
    networkToChoose,
    networkToChoose.networkType,
    selectedAccountIndex,
    tokenBalances,
    tokenPlatform.token_id,
  ])

  useEffect(() => {
    const transactionFee = calculateTransactionFree({
      gasLimit,
      gasPrice,
    })

    if (networkToChoose.isNative) {
      // 1. native token
      if (
        new BigNumber(transactionFee).plus(new BigNumber(sendValue)) >
        new BigNumber(totalNativeToken)
      ) {
        setSendValueError(`Insufficient native token for transfer`)
      } else {
        setSendValueError('')
      }
    } else {
      // 2. not native token
      if (new BigNumber(transactionFee).gt(new BigNumber(totalNativeToken))) {
        setSendValueError(`Insufficient native token for transfer`)
      } else if (
        new BigNumber(sendValue).gt(new BigNumber(totalAccountBalance))
      ) {
        setSendValueError('Insufficient fund for transfer')
      } else {
        setSendValueError('')
      }
    }
  }, [
    gasLimit,
    gasPrice,
    networkToChoose.isNative,
    sendValue,
    totalAccountBalance,
    totalNativeToken,
  ])

  const calculateGasFee = useCallback(
    async (address: string) => {
      try {
        // get selected address
        const selectedAddress = PreferencesController?.getSelectedAddress(
          networkToChoose.networkType,
        )

        // get contract addrress
        const contractAddress = networkToChoose.address

        // create raw transaction
        const rawTransaction: Transaction<NetworkType.ERC20> = {
          chainId: Number(networkToChoose.chainID),
          from: String(selectedAddress),
          to: String(address),
          value: toHex(toWei(sendValue, 'ether')),
          contractAddress: contractAddress,
        }

        // estimate gaslimit and gas price // error here
        const { gas: newGasLimit, gasPrice: newGasPrice } =
          //@ts-ignore
          await estimateGas(
            networkToChoose.token_id,
            rawTransaction,
            //@ts-ignore
            TransactionController?.providers,
          )

        return {
          gasLimit: String(toDecimal(String(newGasLimit))),
          gasPrice: String(fromWei(String(newGasPrice), 'gwei')),
        }
      } catch (error) {
        console.log('[ERROR calculateGasFee]', error)
      }
    },
    [
      PreferencesController,
      TransactionController,
      networkToChoose.address,
      networkToChoose.chainID,
      networkToChoose.networkType,
      networkToChoose.token_id,
      sendValue,
    ],
  )

  const hanldeEstimateGasFee = useCallback(
    async (recipientAddress: string) => {
      try {
        //@ts-ignore
        const { gasLimit: newGasLimit, gasPrice: newGasPrice } =
          await calculateGasFee(recipientAddress)
        setGasLimit(newGasLimit)
        setGasPrice(newGasPrice)

        // if success clear error
        setSendValueError('')
      } catch (error: any) {
        if (isAddress(recipientAddress)) {
          setSendValueError(error.message)
        }
      }
    },
    [calculateGasFee],
  )

  const checkExist = useCallback(
    async (recipientAddress: string) => {
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
    },
    [nameInput, selectedAccountIndex],
  )

  const handleOpenAddWhiteListBottomSheet = useCallback(() => {
    setSwitch(true)
    addContactRef.current?.open()
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
        checkExist(recipientAddress)
        setNameInput('')
        addContactRef.current?.close()
      }
    },
    [checkExist, recipientAddress, selectedAccountIndex],
  )

  const handleCloseAddWhite = useCallback(() => {
    setSwitch(false)
  }, [])

  const handleGetAddress = useCallback(() => {
    if (selectContact.address !== '') {
      setReceiveAddress(selectContact.address)
      setNameContact(selectContact.name)
      setErrorAddress('')
      setValid(true)
      hanldeEstimateGasFee(selectContact.address)
    } else if (recipientAddressScan !== '') {
      setReceiveAddress(recipientAddressScan)

      setErrorAddress('')
      setValid(true)
      hanldeEstimateGasFee(recipientAddressScan)
    } else {
      setReceiveAddress(recipientAddressScan)
      checkExist(recipientAddress)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipientAddressScan, selectContact])

  /**
   * nomalize value input
   */
  useEffect(() => {
    const result = amountInputFormat(sendValue)
    setSendValue(result ? result : '')
  }, [sendValue])

  useEffect(() => {
    handleGetAddress()
  }, [handleGetAddress])

  const getAddressByNameEns = async (name: string) => {
    try {
      const netWork_ID_Of_Eth = 'ethereum' // support only Ethereum

      return await Engine.context.AssetsContractController?.getAddressByNameEns(
        netWork_ID_Of_Eth,
        name,
      )
    } catch (e) {
      return ''
    }
  }

  const resetIsValidAndSenValue = () => {
    setValid(false)
    setSendValue('0')
  }

  const handleEnsName = useCallback(
    async (inputValue: string) => {
      const ensAddress = await getAddressByNameEns(inputValue)
      if (!ensAddress) {
        setErrorAddress('This ENS not available')
        resetIsValidAndSenValue()
      }
      if (ensAddress && isAddress(ensAddress)) {
        hanldeEstimateGasFee(ensAddress + '')
        setErrorAddress('')
        setValid(true)
        return ensAddress
      }
    },
    [hanldeEstimateGasFee],
  )

  const handleAddress = useCallback(
    (inputValue: string) => {
      if (!isAddress(inputValue)) {
        setErrorAddress('This is not in the correct format of address')
        resetIsValidAndSenValue()
      } else {
        hanldeEstimateGasFee(inputValue)
        setErrorAddress('')
        setValid(true)
      }
    },
    [hanldeEstimateGasFee],
  )
  const isNotEthereum = useMemo(() => {
    return Number(networkToChoose.chainID) !== 1 // support only Ethereum
  }, [networkToChoose.chainID])
  const checkRecipientAddress = useCallback(
    async (textInputValue: string) => {
      let resultAddress = textInputValue
      if (textInputValue === '') {
        setErrorAddress('Address is Required')
        resetIsValidAndSenValue()
        return resultAddress
      }

      if (isNotEthereum) {
        handleAddress(textInputValue)
        return resultAddress
      }
      const checkNameOfAddressRegex = /[.]/ // if has dot is name ENS and if not has is address

      if (checkNameOfAddressRegex.test(textInputValue)) {
        const ensAddress = await handleEnsName(textInputValue)
        ensAddress && (resultAddress = ensAddress)
      } else {
        handleAddress(textInputValue)
      }

      return resultAddress
    },
    [handleAddress, handleEnsName, isNotEthereum],
  )

  const validaterecipientAddress = useCallback(
    async (e: NativeSyntheticEvent<TextInputEndEditingEventData> | any) => {
      if (new BigNumber(sendValue).gte(new BigNumber(totalAccountBalance))) {
        setSendValue('0')
      }
      isMax.current = false

      const resultAddress = await checkRecipientAddress(e.nativeEvent.text)

      await checkExist(resultAddress)
    },
    [checkExist, checkRecipientAddress, sendValue, totalAccountBalance],
  )

  const rightIconAddressComponent = useMemo(() => {
    return (
      <>
        <TouchableOpacity onPress={rightIconPress} style={styles.iconScan}>
          <Scan width={25} height={25} />
        </TouchableOpacity>
        {/* go to whitelist */}
        <TouchableOpacity onPress={handleOpenWhiteList}>
          <Contacts />
        </TouchableOpacity>
      </>
    )
  }, [handleOpenWhiteList, rightIconPress, styles.iconScan])

  const handleOnBlurAmountSend = useCallback(async () => {
    //@ts-ignore
    const { gasLimit: newGasLimit, gasPrice: newGasPrice } =
      await calculateGasFee(recipientAddress)
    if (
      Number(calculateTransactionFree({ gasLimit, gasPrice })) <
      Number(
        calculateTransactionFree({
          gasLimit: newGasLimit,
          gasPrice: newGasPrice,
        }),
      )
    ) {
      setGasLimit(newGasLimit)
      setGasPrice(newGasPrice)
    }
  }, [calculateGasFee, gasLimit, gasPrice, recipientAddress])

  const handleMaxBalance = useCallback(() => {
    isMax.current = true
    if (isAddress(recipientAddress)) {
      // if token is native token
      if (tokenPlatform.isNative) {
        const transactionFee = calculateTransactionFree({
          gasLimit,
          gasPrice,
        })
        if (
          new BigNumber(transactionFee).gte(new BigNumber(totalNativeToken))
        ) {
          setSendValue('0')
        } else {
          const maxAmountCanSend = new BigNumber(totalNativeToken).minus(
            new BigNumber(transactionFee),
          )
          setSendValue(maxAmountCanSend.toString())
        }
      } else {
        // not a native token
        setSendValue(totalAccountBalance.toString())
      }
      hanldeEstimateGasFee(recipientAddress)
    } else {
      setSendValue(totalAccountBalance.toString())
    }
    handleOnBlurAmountSend()
  }, [
    hanldeEstimateGasFee,
    handleOnBlurAmountSend,
    gasLimit,
    gasPrice,
    recipientAddress,
    tokenPlatform.isNative,
    totalAccountBalance,
    totalNativeToken,
  ])

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
    styles.textMAX,
    styles.textColorGrey10,
  ])

  /**
   * open gas edit bottom sheet
   */
  const handleOpenEditGasBottomSheet = useCallback(() => {
    modalizeEditGasRef.current?.open()
    isCustom.current = true
  }, [])

  /**
   * open review transaction bottom sheet
   */
  const handleOpenInvoiceBottomSheet = useCallback(() => {
    modalizeInvoiceRef.current?.open()
  }, [])

  const rightIconGasComponent = useMemo(() => {
    const canEdit = gasLimit && gasPrice
    const onPress = () => {
      if (!canEdit) {
        return
      }
      handleOpenEditGasBottomSheet()
    }
    return (
      <TouchableOpacity onPress={onPress} style={styles.btnEdit}>
        <EditIcon
          color={canEdit ? theme.colors.primary50 : theme.colors.grey10}
        />
      </TouchableOpacity>
    )
  }, [
    gasLimit,
    gasPrice,
    handleOpenEditGasBottomSheet,
    styles.btnEdit,
    theme.colors.grey10,
    theme.colors.primary50,
  ])

  /**
   * estimate gas when address change or sendValue change
   */
  useEffect(() => {
    if (recipientAddress && sendValue && !isCustom.current && isMax.current) {
      hanldeEstimateGasFee(recipientAddress)
    }
  }, [hanldeEstimateGasFee, isCustom, recipientAddress, sendValue])

  const handleCloseInvoiceBottomSheet = useCallback(() => {
    modalizeInvoiceRef.current?.close()
  }, [])

  const handleSendTransaction = useCallback(async () => {
    handleCloseInvoiceBottomSheet()
    try {
      crashlytics().log('User send transaction ')

      const selectedAddress = PreferencesController?.getSelectedAddress(
        networkToChoose.networkType,
      )
      const contractAddress = networkToChoose.address
      if (TransactionController) {
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'MainStack',
            },
          ],
        })
        // create raw transaction
        const rawTransaction: Transaction<NetworkType.ERC20> = {
          chainId: Number(networkToChoose.chainID),
          from: String(selectedAddress),
          to: String(recipientAddress),
          value: toHex(toWei(sendValue, 'ether')),
          contractAddress: contractAddress,
          gasLimit: toHex(gasLimit),
          gasPrice: toHex(gweiDecToWEIBN(String(gasPrice))),
        }

        await crashlytics().setAttribute(
          'User send transaction with raw transaction',
          JSON.stringify(rawTransaction),
        )

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
                nounce: transactionMeta.transaction.nonce,
                transactionHash,
              } as ToastPayload,
            })
          }
        })
      }
    } catch (error: any) {
      console.log('[ERROR] :', (error as Error).message)

      crashlytics().recordError(error as Error)
      // eslint-disable-next-line no-undef
      toast.show('', {
        data: {
          type: 'cancelled',
          message: (error as Error).message,
        } as ToastPayload,
      })
    }
  }, [
    handleCloseInvoiceBottomSheet,
    PreferencesController,
    networkToChoose.networkType,
    networkToChoose.address,
    networkToChoose.chainID,
    networkToChoose.token_id,
    networkToChoose.symbol,
    TransactionController,
    recipientAddress,
    sendValue,
    gasLimit,
    gasPrice,
    navigation,
    TokenBalancesController,
  ])

  const handleCloseEditGasBottomSheet = useCallback(() => {
    modalizeEditGasRef.current?.close()
  }, [])
  const handleClickTextAddWhiteList = () => {
    hanldeSwitch()
    !isSwitch && handleOpenAddWhiteListBottomSheet()
  }
  return (
    <View style={styles.sendControlContainerOuter}>
      <View style={styles.root}>
        <ScrollView showsVerticalScrollIndicator={false} scrollEnabled={false}>
          <View style={styles.container}>
            <View style={styles.body}>
              <TextInput
                labelText={nameContact ? nameContact : 'Recipiant'}
                labelStyle={nameContact ? styles.labelNameStyle : () => {}}
                placeholder={`Public address${!isNotEthereum && ' or ENS'}`}
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
                    <Text style={styles.text} fontSize={10}>
                      {errorAddress}
                    </Text>
                  </>
                )}
              </View>
              <TextInput
                labelText={'Amount'}
                placeholder={'Type amount transaction'}
                value={sendValue}
                onChangeText={setSendValue}
                onBlur={handleOnBlurAmountSend}
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
                    <Text style={styles.text} fontSize={10}>
                      {sendValueError}
                    </Text>
                  </>
                )}
              </View>
              {isAddress(recipientAddress) && (
                <TextInput
                  labelText={'Transaction fee'}
                  value={`${calculateTransactionFree({
                    gasLimit,
                    gasPrice,
                  })} ${nettworkChoose?.symbol + ''}`}
                  containerStyle={styles.inputContainerStyle}
                  editable={false}
                  rightIcon={rightIconGasComponent}
                />
              )}
              <View
                style={[
                  styles.rowBalance,
                  isAddress(recipientAddress) && {
                    marginTop: normalize(24)('moderate'),
                  },
                ]}
              >
                <Text
                  style={styles.textColorGrey10}
                  variant="bold"
                  fontSize={12}
                  lineHeight={14}
                >
                  Available
                </Text>
                <Text
                  style={styles.textColorGrey10}
                  fontSize={12}
                  lineHeight={14}
                >
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
        </ScrollView>
        <View style={styles.groupButton}>
          <Button
            text="Send"
            disabled={
              !(isValid && sendValue) ||
              gasPrice === '' ||
              !!sendValueError ||
              Number(sendValue) > Number(totalAccountBalance)
            }
            onPress={handleOpenInvoiceBottomSheet}
          />
        </View>
      </View>
      <InvoiceBottomSheet
        ref={modalizeInvoiceRef}
        addressFrom={selectedAddress ? selectedAddress : ''}
        addressTo={recipientAddress}
        gasPrice={gasPrice}
        gasLimit={gasLimit}
        networkTicker={nettworkChoose?.symbol + ''}
        tokenTicker={networkToChoose.symbol}
        sendValue={sendValue}
        handleCloseInvoiceBottomSheet={handleCloseInvoiceBottomSheet}
        handleSendTransaction={handleSendTransaction}
      />
      <AddContactBottomsheet
        ref={addContactRef}
        handleAddWhite={() => handleAddWhiteList(nameInput, recipientAddress)}
        handleCloseAddWhite={handleCloseAddWhite}
        nameInput={nameInput}
        setNameInput={setNameInput}
      />
      <EditGasBottomSheet
        ref={modalizeEditGasRef}
        networkID={tokenPlatform.chainID}
        gasLimit={gasLimit}
        setGasLimit={setGasLimit}
        gasPrice={gasPrice}
        setGasPrice={setGasPrice}
        ticker={nettworkChoose?.symbol + ''}
        handleCloseEditGasBottomSheet={handleCloseEditGasBottomSheet}
      />
    </View>
  )
}

const useStyles = makeStyles<SendTokenProps>()(({ normalize, colors }) => ({
  root: {
    flexDirection: 'column',
  },
  container: {
    height: height * 0.6,
    position: 'relative',
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
    bottom: normalize(16)('horizontal'),
    left: normalize(16)('horizontal'),
    right: normalize(16)('horizontal'),
    zIndex: 1000,
  },
  text: {
    color: colors.alert,
    left: normalize(5)('horizontal'),
  },
  inputContainerStyle: {
    width: width * 0.91,
    marginLeft: normalize(3)('horizontal'),
  },
  sendControlContainerOuter: {
    height: height,
    marginTop: normalize(-10)('vertical'),
  },
  item: {
    height: normalize(22)('horizontal'),
    marginRight: normalize(2)('horizontal'),
    paddingHorizontal: normalize(8)('horizontal'),
    borderRadius: normalize(4)('horizontal'),
    backgroundColor: colors.primary0,
    justifyContent: 'center',
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
  textMAX: {
    color: colors.primary35,
  },
  switch: {
    width: width * 0.91,
    flexDirection: 'row',
    paddingVertical: normalize(30)('horizontal'),
    alignItems: 'center',
  },
  customSwitch: {
    margin: normalize(-5)('moderate'),
  },
  textSwitch: {
    flex: 1,
    color: colors.grey4,
  },
  groupError: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    paddingLeft: normalize(15)('horizontal'),
    height: normalize(25)('vertical'),
    flexDirection: 'row',
    marginBottom: normalize(5)('horizontal'),
    zIndex: 1000,
  },
  labelNameStyle: {
    color: colors.primary50,
  },
  iconScan: {
    marginRight: normalize(12)('vertical'),
  },
  btnEdit: {
    padding: normalize(20)('moderate'),
    paddingRight: normalize(0)('vertical'),
  },
}))
