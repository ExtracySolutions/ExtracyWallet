import React, { FC, useCallback, useEffect, useState } from 'react'

import { Container, Header, Scanner } from '@components'
import { PERMISSION_TYPE, useAppSelector, usePermission } from '@hooks'
import { makeStyles } from '@themes'
import { isAddressSOL } from '@ultils'
import { useNavigation, useRoute } from 'navigation/NavigationService'
import { BackHandler, View } from 'react-native'
import { useDispatch } from 'react-redux'
import { setSelectContact } from 'reduxs/reducers'
import { isAddress } from 'web3-utils'

import { Received } from '../Received'
import { SendToken } from '../SendToken'
import { ManagerTabsAction } from './ManagerTabsAction'

export type ManagerAssetProps = {}

type Tab = {
  name: string
  label: string
  component: React.ComponentType
}
export enum RouteTab {
  send = 'SEND',
  received = 'RECEIVED',
}

export const ManagerAsset: FC<ManagerAssetProps> = (props) => {
  const {
    params: { token, routeName, tokenList },
  } = useRoute('ManagerAsset')

  const themeStore = useAppSelector((state) => state.root.theme.theme)
  const { networkTypeChoose } = useAppSelector((state) => state.root.tokenList)
  const styles = useStyles(props, themeStore)

  const [isValidScan, setValidScan] = useState<boolean>(false)
  const [scan, setScan] = useState<boolean>(false)
  const [errorAddressScan, setErrorAddressScan] = useState<string>('')
  const [recipientAddressScan, setRecipientAddressScan] = useState<string>('')
  const [routeState, setRoute] = useState<string>(routeName)
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const { showPermissionDialog } = usePermission()

  const TabArr: Tab[] = [
    {
      name: RouteTab.send,
      label: RouteTab.send,
      component: SendToken,
    },
    {
      name: RouteTab.received,
      label: RouteTab.received,
      component: Received,
    },
  ]
  const backHandler = useCallback(() => {
    !scan ? navigation.goBack() : setScan(false)
    return true
  }, [navigation, scan])

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backHandler)
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backHandler)
    }
  }, [backHandler, networkTypeChoose, scan])

  const handleScan = async () => {
    const resultPermission = await showPermissionDialog(PERMISSION_TYPE.camera)
    if (resultPermission === true) {
      setScan(true)
      setValidScan(true)
      setRoute(RouteTab.send)
    } else {
      setScan(false)
      setValidScan(false)
      setRoute(RouteTab.send)
    }
  }

  const handleCloseScan = useCallback(() => {
    setScan(false)
    setValidScan(false)
    setErrorAddressScan('')
    setRoute(RouteTab.send)
  }, [])

  const handleValidate = async (address: string) => {
    if (networkTypeChoose === 'SOL') {
      const result = await isAddressSOL(address)
      result
        ? [
            setErrorAddressScan(''),
            setRecipientAddressScan(address),
            setScan(false),
            dispatch(setSelectContact({ address: '', index: -1, name: '' })),
          ]
        : [
            setErrorAddressScan(
              'QRCode is not in the correct format of address',
            ),
            setScan(false),
            setRecipientAddressScan(''),
          ]
    } else {
      isAddress(address)
        ? (setRecipientAddressScan(address),
          setScan(false),
          dispatch(setSelectContact({ address: '', index: -1, name: '' })),
          setErrorAddressScan(''))
        : (setScan(false),
          setRecipientAddressScan(''),
          setErrorAddressScan('QRCode is not in the correct format of address'))
    }
  }

  return (
    <View style={styles.root}>
      <Container>
        {!scan ? (
          <>
            <Header title={token.symbol} />
            <View style={styles.body}>
              <ManagerTabsAction
                TabArr={TabArr}
                routeName={routeState}
                rightIconPress={handleScan}
                errorAddressScan={errorAddressScan}
                isValidScan={isValidScan}
                recipientAddressScan={recipientAddressScan}
                token={token}
                tokenList={tokenList}
              />
            </View>
          </>
        ) : (
          <Scanner onRead={handleValidate} back={handleCloseScan} />
        )}
      </Container>
    </View>
  )
}

const useStyles = makeStyles<ManagerAssetProps>()(({ normalize }) => ({
  root: {
    flex: 1,
  },
  body: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginTop: normalize(-5)('vertical'),
  },
}))
