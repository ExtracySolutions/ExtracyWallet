import React, { FC, useCallback, useEffect, useState } from 'react'

import { DangerIcon } from '@assets/icons'
import {
  Button,
  Container,
  DropDown,
  Header,
  Text,
  TextInput,
} from '@components'
import { FrequentRpc } from '@extracy-wallet-controller'
import { useAppDispatch, useAppSelector } from '@hooks'
import crashlytics from '@react-native-firebase/crashlytics'
import { useFocusEffect } from '@react-navigation/native'
import { makeStyles } from '@themes'
import {
  getIconNetworkWithNetworkID,
  validateTokenSupported,
  DEFAULT_FREQUENT_RPC,
} from '@ultils'
import { isEmpty } from 'lodash'
import { useNavigation } from 'navigation/NavigationService'
import {
  BackHandler,
  Dimensions,
  GestureResponderEvent,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native'
import { addToken } from 'reduxs/reducers'
import { isAddress } from 'web3-utils'

import Engine from '../../core/Engine'

const { height, width } = Dimensions.get('screen')

type AddTokenProps = {
  rightIconPress?: (event: GestureResponderEvent) => void
  isValidScan: boolean
  errorAddressScan: string
  recipientAddressScan: string
  tokenName: string
}

type Network = {
  label?: string
  value: string
} & FrequentRpc

export const AddToken: FC<AddTokenProps> = (props) => {
  const themeStore = useAppSelector((state) => state.root.theme.theme)
  const selectedAccount = useAppSelector(
    (state) =>
      state.root.engine.backgroundState.PreferencesController
        ?.selectedAccountIndex,
  )
  const networkList = useAppSelector(
    (state) => state.root.tokenList.networkListActive,
  )

  const styles = useStyles(props, themeStore)
  const navigation = useNavigation()
  const dispatch = useAppDispatch()

  const [isValid, setValid] = useState<boolean>()
  const [contractAddress, setContractAddress] = useState<string>('')
  const [errorAddress, setErrorAddress] = useState<string>('')
  const [tokenSymbol, setTokenSymbol] = useState<string>('')
  const [tokenDecimals, setTokenDecimals] = useState<string>('')
  const [openNetwork, setOpenNetwork] = useState<boolean>(false)
  const [networkID, setNetworkID] = useState<string>(
    selectedAccount?.toString()
      ? isEmpty(networkList[selectedAccount])
        ? DEFAULT_FREQUENT_RPC[0].chainID
        : networkList[selectedAccount][0].chainID
      : '',
  )
  const [isFocus, setFocus] = useState<boolean>(false)
  const [netWorkValue, setNetworkValue] = useState<Network[]>([])
  const [networkToChoose, setNetworkToChoose] = useState<Network>()

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.navigate('Main')
        return true
      }
      BackHandler.addEventListener('hardwareBackPress', onBackPress)

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress)
      }
    }, [navigation]),
  )

  const getDecimalsAndSymbol = useCallback(async () => {
    if (selectedAccount?.toString()) {
      const filterNetwork = isEmpty(networkList[selectedAccount])
        ? DEFAULT_FREQUENT_RPC.filter((item) => item.chainID === networkID)
        : networkList[selectedAccount].filter(
            (item) => item.chainID === networkID,
          )
      if (contractAddress && networkID) {
        try {
          const [symbol, decimals] = await Promise.all([
            Engine.context.AssetsContractController?.getAssetSymbol(
              filterNetwork[0].token_id,
              contractAddress,
            ),
            Engine.context.AssetsContractController?.getTokenDecimals(
              filterNetwork[0].token_id,
              contractAddress,
            ),
          ])

          if (symbol && decimals) {
            setTokenSymbol(symbol.toUpperCase())
            setTokenDecimals(decimals)
          } else {
            setErrorAddress('This is not in the correct format of address')
            setValid(false)
            setTokenSymbol('')
            setTokenDecimals('')
          }
        } catch (error) {
          setErrorAddress('This is not in the correct format of address')
          setValid(false)
          setTokenSymbol('')
          setTokenDecimals('')
        }
      } else {
        setValid(false)
        setTokenSymbol('')
        setTokenDecimals('')
      }
    }
  }, [contractAddress, networkID, networkList, selectedAccount])

  const getNetworks = useCallback(() => {
    console.log('selectedAccount', selectedAccount)
    if (selectedAccount?.toString()) {
      console.log('networkList[selectedAccount]', networkList[selectedAccount])
      console.log(
        'networkDropdown: Network[] = isEmpty(networkList[selectedAccount])',
        (networkDropdown = isEmpty(networkList[selectedAccount])),
      )

      const networkDropdown: Network[] = isEmpty(networkList[selectedAccount])
        ? DEFAULT_FREQUENT_RPC.map(
            (item: any) =>
              item && {
                ...item,
                value: item.chainID,
                label: item.nickname,
                icon: () => getIconNetworkWithNetworkID(item.token_id),
              },
          )
        : networkList[selectedAccount].map(
            (item: any) =>
              item && {
                ...item,
                value: item.chainID,
                label: item.networkName,
                icon: () => getIconNetworkWithNetworkID(item.token_id),
              },
          )
      console.log('networkDropdown', networkDropdown)

      setNetworkValue(networkDropdown)

      const result = networkDropdown.find((item) => item.chainID === networkID)
      // console.log({ networkDropdown, result })
      result && setNetworkToChoose(result)
      if (contractAddress) {
        getDecimalsAndSymbol()
      }
    }
  }, [
    contractAddress,
    getDecimalsAndSymbol,
    networkID,
    networkList,
    selectedAccount,
  ])

  const handleCloseDropDown = useCallback(() => {
    setOpenNetwork(false)
  }, [])

  useEffect(() => {
    getNetworks()
  }, [getNetworks])

  const validateContractAddress = useCallback(() => {
    if (contractAddress === '') {
      setErrorAddress('Address is Required')
      setValid(false)
    } else if (!isAddress(contractAddress)) {
      setErrorAddress('This is not in the correct format of address')
      setValid(false)
    } else {
      setErrorAddress('')
      setValid(true)
    }
  }, [contractAddress])

  const handleAddToken = useCallback(async () => {
    try {
      if (networkToChoose && selectedAccount?.toString()) {
        const nomalizeToken = isEmpty(networkList[selectedAccount])
          ? validateTokenSupported({
              networkType: networkToChoose?.type,
              chainID: networkToChoose?.chainID,
              address: contractAddress,
              decimals: tokenDecimals,
              symbol: tokenSymbol,
            })
          : validateTokenSupported({
              //@ts-ignore
              networkType: networkToChoose?.networkType,
              chainID: networkToChoose?.chainID,
              address: contractAddress,
              decimals: tokenDecimals,
              symbol: tokenSymbol,
            })

        /**
         * Log user add what token
         */
        await crashlytics().setAttribute(
          'User add token',
          JSON.stringify({
            networkType: networkToChoose?.type,
            chainID: networkToChoose?.chainID,
            address: contractAddress,
            decimals: tokenDecimals,
            symbol: tokenSymbol,
          }),
        )
        await Engine.context.TokensController?.addToken(nomalizeToken)
        const tokenList =
          await Engine.context.TokensController?.getTokensBySelectAccount()

        if (tokenList && selectedAccount?.toString()) {
          dispatch(
            addToken({
              tokenParam: tokenList,
              selectedAccount: selectedAccount,
            }),
          )
          navigation.goBack()
        }
      }
    } catch (error) {
      crashlytics().recordError(error as Error)
    }
  }, [
    contractAddress,
    dispatch,
    navigation,
    networkList,
    networkToChoose,
    selectedAccount,
    tokenDecimals,
    tokenSymbol,
  ])

  return (
    <View style={styles.sendControlContainerOuter}>
      <Container style={styles.root}>
        <Header title={'Add Token'} />
        <ScrollView showsVerticalScrollIndicator={false} scrollEnabled={false}>
          <View style={styles.container}>
            <View style={styles.listNetwork}>
              <DropDown
                open={openNetwork}
                value={networkID ? networkID : ''}
                items={netWorkValue}
                placeholder={'Selected network'}
                onChangeValue={getDecimalsAndSymbol}
                setOpen={() => {
                  setOpenNetwork(!openNetwork)
                }}
                setValue={(value) => {
                  isFocus && validateContractAddress()
                  setNetworkID(value)
                }}
                setItems={setNetworkValue}
                containerStyle={styles.picker}
              />
              {openNetwork && (
                <TouchableOpacity
                  onPress={handleCloseDropDown}
                  style={styles.overlay}
                />
              )}
            </View>

            <View style={styles.body}>
              <View style={styles.groupInput}>
                <TextInput
                  labelText={'Address'}
                  placeholder={'Search, public address, or ENS'}
                  value={contractAddress}
                  onBlur={() => setFocus(true)}
                  onChangeText={setContractAddress}
                  onSelectionChange={validateContractAddress}
                  containerStyle={styles.inputStyle}
                />
                {errorAddress !== '' && (
                  <View style={styles.groupError}>
                    <DangerIcon />
                    <Text style={styles.text}>{errorAddress}</Text>
                  </View>
                )}
              </View>
              <TextInput
                editable={false}
                selectTextOnFocus={false}
                labelText={'Token Symbol'}
                value={tokenSymbol}
                containerStyle={styles.inputStyle}
              />
              <TextInput
                labelText={'Token Decimals'}
                value={tokenDecimals}
                editable={false}
                selectTextOnFocus={false}
                containerStyle={styles.inputStyle}
              />
            </View>
          </View>
        </ScrollView>
        <View
          style={[
            styles.groupButton,
            Platform.OS === 'android'
              ? styles.groupButtonAndroid
              : styles.groupButtonIOS,
          ]}
        >
          <Button
            round
            variant={'fulfill'}
            text={'Create'}
            disabled={!isValid || !tokenSymbol || !tokenDecimals}
            onPress={handleAddToken}
          />
        </View>
      </Container>
    </View>
  )
}

const useStyles = makeStyles<AddTokenProps>()(
  ({ normalize, colors, font }) => ({
    root: {
      flexDirection: 'column',
    },
    listNetwork: {
      marginHorizontal: normalize(17)('horizontal'),
      marginTop: normalize(20)('horizontal'),
      zIndex: 1000,
    },
    container: {
      height: height * 0.8,
      position: 'relative',
    },
    body: {
      top: normalize(85)('vertical'),
      position: 'absolute',
      width: width,
      flexDirection: 'column',
      alignItems: 'center',
      zIndex: 0,
    },
    groupButton: {
      paddingHorizontal: normalize(15)('horizontal'),
    },
    text: {
      color: colors.alert,
      fontSize: font.size.caption2,
      position: 'relative',
      left: normalize(5)('horizontal'),
      paddingTop: normalize(2)('vertical'),
    },

    inputStyle: {
      width: width * 0.9,
      marginVertical: normalize(15)('vertical'),
    },
    sendControlContainerOuter: {
      height: height,
    },
    groupError: {
      position: 'absolute',
      left: normalize(5)('horizontal'),
      bottom: -3,
      flexDirection: 'row',
    },
    groupInput: {},
    picker: {
      marginBottom: normalize(10)('vertical'),
    },
    overlay: {
      zIndex: 100,
      width: width,
      height: height,
      position: 'relative',
    },
    groupButtonAndroid: {
      width: width,
      position: 'absolute',
      bottom: normalize(45)('vertical'),
    },
    groupButtonIOS: {
      width: width,
      position: 'absolute',
      bottom: normalize(25)('vertical'),
    },
  }),
)
