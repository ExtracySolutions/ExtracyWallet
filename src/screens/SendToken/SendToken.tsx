import React, { FC, useCallback, useEffect, useState } from 'react'

import { DropDown } from '@components'
import { FrequentRpc, TokenPlatform } from '@extracy-wallet-controller'
import { useAppDispatch, useAppSelector } from '@hooks'
import { makeStyles } from '@themes'
import { getIconNetworkWithNetworkID } from '@ultils'
import {
  Dimensions,
  GestureResponderEvent,
  KeyboardAvoidingView,
  Platform,
  View,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native'
import { changeNetworkChoose } from 'reduxs/reducers'

import { SendTokenEVM } from './SendTokenEVM'
import { SendTokenSOL } from './SendTokenSOL'

const { height, width } = Dimensions.get('screen')

export type SendTokenProps = {
  rightIconPress?: (event: GestureResponderEvent) => void
  isValidScan: boolean
  errorAddressScan: string
  recipientAddressScan: string
  tokenName: string
}
export type Network = {
  label?: string
  value: string
  icon?: () => void
} & TokenPlatform &
  FrequentRpc

export const SendToken: FC = ({ props, route }: any) => {
  const {
    rightIconPress,
    recipientAddressScan,
    isValidScan,
    errorAddressScan,
    tokenList,
  } = route.params

  const {
    theme: { theme: themeStore },
    tokenPlatformReducer: { tokenPlatform },
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

  const styles = useStyles(props, themeStore)
  const dispatch = useAppDispatch()

  const keyboardVerticalOffset = Platform.OS === 'ios' ? 'padding' : 'height'

  const [openNetwork, setOpenNetwork] = useState<boolean>(false)
  const [networkID, setNetworkID] = useState<string>(tokenPlatform.chainID)

  const network: Network[] = tokenList.map(
    (item: Network) =>
      item && {
        ...item,
        value: item.chainID,
        label: item.networkName,
        icon: () => getIconNetworkWithNetworkID(item.token_id),
      },
  )

  const sortNetwork = network.filter(
    (itemNetwork, index) =>
      network.findIndex((item) => item.chainID === itemNetwork.chainID) ===
      index,
  )

  const [netWorkValue, setNetworkValue] = useState<Network[]>(sortNetwork)
  const [networkToChoose, setNetworkToChoose] = useState<Network>(
    sortNetwork[0],
  )
  const [totalAccountBalance, setTotalAccountBalance] = useState(
    tokenPlatform.isNative
      ? //@ts-ignore
        tokenBalances?.[selectedAccountIndex]?.[networkToChoose.networkType]?.[
          tokenPlatform.token_id
        ]?.balance
      : //@ts-ignore
        tokenBalances?.[selectedAccountIndex]?.[networkToChoose.networkType]?.[
          tokenPlatform.address
        ]?.balance,
  )
  useEffect(() => {
    const result: Network | undefined = sortNetwork.find(
      (item) => item.chainID === networkID,
    )
    setTotalAccountBalance(
      result && tokenPlatform.isNative
        ? //@ts-ignore
          tokenBalances?.[selectedAccountIndex]?.[
            networkToChoose.networkType
          ]?.[result.token_id]?.balance
        : result &&
            //@ts-ignore
            tokenBalances?.[selectedAccountIndex]?.[
              networkToChoose.networkType
            ]?.[result.address]?.balance,
    )
    if (result) {
      dispatch(changeNetworkChoose(result.networkType))
      setNetworkToChoose(result)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    netWorkValue,
    networkID,
    tokenPlatform.chainID,
    networkToChoose.networkType,
    selectedAccountIndex,
    tokenBalances,
    tokenPlatform.isNative,
  ])

  const handleCloseDropDown = useCallback(() => {
    setOpenNetwork(false)
  }, [])

  return (
    <KeyboardAvoidingView
      style={styles.sendControlContainerOuter}
      behavior={keyboardVerticalOffset}
    >
      <View style={styles.root}>
        <ScrollView showsVerticalScrollIndicator={false} scrollEnabled={false}>
          <View style={styles.container}>
            <View style={styles.listNetwork}>
              <DropDown
                open={openNetwork}
                value={networkID}
                items={netWorkValue}
                setOpen={() => {
                  setOpenNetwork(!openNetwork)
                }}
                setValue={setNetworkID}
                setItems={setNetworkValue}
              />
              {openNetwork && (
                <TouchableWithoutFeedback onPress={handleCloseDropDown}>
                  <View style={styles.overlay} />
                </TouchableWithoutFeedback>
              )}
            </View>
            <View style={styles.body}>
              {networkToChoose.networkType !== 'SOL' ? (
                <SendTokenEVM
                  totalAccountBalance={totalAccountBalance}
                  networkToChoose={networkToChoose}
                  errorAddressScan={errorAddressScan}
                  isValidScan={isValidScan}
                  recipientAddressScan={recipientAddressScan}
                  tokenPlatform={tokenPlatform}
                  rightIconPress={rightIconPress}
                />
              ) : (
                <SendTokenSOL
                  totalAccountBalance={totalAccountBalance}
                  networkToChoose={networkToChoose}
                  errorAddressScan={errorAddressScan}
                  isValidScan={isValidScan}
                  tokenPlatform={tokenPlatform}
                  recipientAddressScan={recipientAddressScan}
                  rightIconPress={rightIconPress}
                />
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  )
}

const useStyles = makeStyles<SendTokenProps>()(({ normalize }) => ({
  root: {
    height: height * 0.8,
    flexDirection: 'column',
    marginHorizontal: normalize(17)('horizontal'),
  },
  listNetwork: {
    marginHorizontal: normalize(13)('horizontal'),
    marginTop: normalize(20)('horizontal'),
    zIndex: 1000,
  },
  container: {
    height: height * 0.85,
    position: 'relative',
  },
  sendControlContainerOuter: {
    height: height,
  },
  overlay: {
    zIndex: 200,
    width: width * 0.91,
    height: height,
    position: 'relative',
  },
  body: {
    marginTop: normalize(80)('vertical'),
    position: 'absolute',
    width: width - 10,
    flexDirection: 'column',
  },
}))
