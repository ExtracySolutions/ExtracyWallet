/* eslint-disable import/default */
import React, { FC, useCallback, useRef, useState, useEffect } from 'react'

import { OBLWalletNameIcon } from '@assets/icons'
import { Button, DropDown, Text } from '@components'
import { TokenPlatform } from '@extracy-wallet-controller'
import { useAppSelector } from '@hooks'
import Clipboard from '@react-native-clipboard/clipboard'
import { makeStyles, normalize } from '@themes'
import { getIconNetworkWithNetworkID } from '@ultils'
// eslint-disable-next-line import/order
import {
  Dimensions,
  GestureResponderEvent,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'

import QRCode from 'react-native-qrcode-svg'
import Share from 'react-native-share'
import Snackbar from 'react-native-snackbar'
// eslint-disable-next-line import/no-named-as-default-member
import ViewShot, { captureRef } from 'react-native-view-shot'

import Engine from '../../core/Engine'

const { height, width } = Dimensions.get('screen')

type ReceivedProps = {
  rightIconPress?: (event: GestureResponderEvent) => void
  isValidScan: boolean
  errorAddressScan: string
  recipientAddressScan: string
  tokenName: string
}
type Network = {
  label?: string
  value: string
  icon?: () => void
} & TokenPlatform

export const Received: FC = ({ props, route }: any) => {
  const themeStore = useAppSelector((state) => state.root.theme.theme)
  const styles = useStyles(props, themeStore)
  const { tokenList } = route.params
  const {
    tokenPlatformReducer: { tokenPlatform },
  } = useAppSelector((stateRoot) => stateRoot.root)
  const { PreferencesController } = Engine.context

  const keyboardVerticalOffset = Platform.OS === 'ios' ? 'padding' : 'height'
  const [address, setAddress] = useState<string>('Address not found!')
  const viewShotRef = useRef<any>(null)
  const [openNetwork, setOpenNetwork] = useState<boolean>(false)
  const [networkID, setNetworkID] = useState<string>(tokenPlatform.chainID)
  const [tokenID, setTokenID] = useState<string>('')
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

  const handleCopyToClipBoard = useCallback(() => {
    Clipboard.setString(address)
    Snackbar.show({
      text: 'Coppied!',
      duration: Snackbar.LENGTH_SHORT,
    })
  }, [address])

  const handleCloseDropDown = useCallback(() => {
    setOpenNetwork(false)
  }, [])

  const shareAddress = async () => {
    try {
      const uri = await captureRef(viewShotRef, {
        format: 'png',
        quality: 1,
      })

      await Share.open({ title: 'Share QRCode', url: uri })
    } catch (e) {
      throw e
    }
  }

  useEffect(() => {
    const selectedItem = sortNetwork.find((item) => item.chainID === networkID)

    selectedItem && setTokenID(selectedItem?.token_id)
    const currentAddress = PreferencesController?.getSelectedAddress(
      selectedItem?.networkType as any,
    )
    setAddress(currentAddress as any)
  }, [
    PreferencesController,
    networkID,
    sortNetwork,
    tokenList,
    tokenPlatform,
    tokenPlatform.image,
  ])

  return (
    <KeyboardAvoidingView
      style={styles.sendControlContainerOuter}
      behavior={keyboardVerticalOffset}
      keyboardVerticalOffset={130}
    >
      <TouchableWithoutFeedback onPress={handleCloseDropDown}>
        <View style={styles.root}>
          <View style={styles.listNetwork}>
            <DropDown
              onLayout={() => setOpenNetwork(false)}
              open={openNetwork}
              value={networkID}
              items={netWorkValue}
              setOpen={() => {
                setOpenNetwork(!openNetwork)
              }}
              setValue={setNetworkID}
              setItems={setNetworkValue}
            />
            {openNetwork && <View style={styles.overlay} />}
          </View>

          <View style={styles.viewShot}>
            <View style={styles.contentWrapper}>
              <TouchableOpacity
                style={styles.boxQRCode}
                onPress={handleCopyToClipBoard}
              >
                <View style={styles.marginBoxQR}>
                  <QRCode
                    value={address}
                    size={normalize(180)('horizontal')}
                    quietZone={20}
                  />
                </View>
              </TouchableOpacity>
              <Text variant="medium" style={styles.text}>
                Scan address to receive payment
              </Text>
              <TouchableOpacity
                style={styles.copyClipboard}
                onPress={handleCopyToClipBoard}
              >
                <Text
                  fontSize={16}
                  variant="medium"
                  numberOfLines={2}
                  lineHeight={24}
                  isHighlight
                  style={styles.copyClipboardText}
                >
                  {address}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.layout} />
            <ViewShot
              ref={viewShotRef}
              options={{ format: 'png' }}
              style={styles.contentWrapperShot}
            >
              <View style={styles.image}>
                <View style={styles.containerHeader}>
                  <OBLWalletNameIcon />
                </View>
                <View style={styles.row}>
                  <View style={[styles.center, styles.icon]}>
                    {getIconNetworkWithNetworkID(tokenID)}
                  </View>
                  <Text
                    lineHeight={24}
                    variant="medium"
                    style={[styles.textNetwork, styles.center]}
                  >
                    {tokenPlatform.networkName}
                  </Text>
                </View>
                <View style={[styles.center, styles.boxQRCode]}>
                  <View style={styles.marginBoxQR}>
                    <QRCode
                      value={address}
                      size={normalize(150)('horizontal')}
                      quietZone={20}
                    />
                  </View>
                </View>
                <Text lineHeight={16} variant="regular" style={styles.textScan}>
                  Scan address to receive payment
                </Text>
                <TouchableOpacity
                  style={styles.copyClipboard}
                  onPress={handleCopyToClipBoard}
                >
                  <Text
                    variant="medium"
                    numberOfLines={2}
                    style={styles.copyClipboardText}
                    isHighlight
                    lineHeight={24}
                    fontSize={16}
                  >
                    {address}
                  </Text>
                </TouchableOpacity>
              </View>
            </ViewShot>
          </View>
        </View>
      </TouchableWithoutFeedback>
      <View style={styles.bottom}>
        <View style={styles.groupButton}>
          <Button
            round
            variant={'fulfill'}
            text={'Share Address'}
            onPress={shareAddress}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

const useStyles = makeStyles<ReceivedProps>()(
  ({ normalize, colors, font }) => ({
    root: {
      flexDirection: 'column',
    },
    sendControlContainerOuter: {
      height: height * 0.8,
      zIndex: 100,
    },
    listNetwork: {
      height: normalize(60)('vertical'),
      marginHorizontal: normalize(30)('horizontal'),
      marginTop: normalize(20)('horizontal'),
      zIndex: 100,
    },
    bottom: {
      flex: 0.94,
      alignItems: 'center',
      justifyContent: 'flex-end',
      zIndex: 100,
    },
    groupButton: {
      width: width - normalize(30)('vertical'),
      zIndex: 100,
    },
    contentWrapper: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    contentWrapperShot: {
      position: 'absolute',
      alignSelf: 'center',
      borderRadius: normalize(12)('vertical'),
      zIndex: -100,
      backgroundColor: colors.white,
    },
    layout: {
      position: 'absolute',
      alignSelf: 'center',
      width: normalize(364)('moderate'),
      height: height,
      paddingTop: normalize(20)('moderate'),
      borderRadius: normalize(12)('vertical'),
      zIndex: -10,
      backgroundColor: colors.white,
      top: normalize(-30)('moderate'),
    },
    image: {
      alignSelf: 'center',
      borderRadius: normalize(12)('vertical'),
      width: normalize(343)('moderate'),
      height: normalize(460)('moderate'),
    },
    text: {
      textAlign: 'center',
      color: colors.grey4,
      marginTop: normalize(5)('vertical'),
      marginBottom: normalize(10)('vertical'),
      fontSize: font.size.s4,
    },
    textScan: {
      textAlign: 'center',
      color: colors.grey4,
      marginTop: normalize(5)('vertical'),
      marginBottom: normalize(10)('vertical'),
      fontSize: font.size.s4,
    },
    textNetwork: {
      textAlign: 'center',
      fontSize: font.size.s2,
      marginLeft: normalize(5)('moderate'),
    },
    copyClipboard: {
      zIndex: 1000,
      flexDirection: 'row',
      alignSelf: 'center',
      paddingVertical: normalize(3)('vertical'),
      paddingHorizontal: normalize(15)('horizontal'),
      backgroundColor: `${colors.primary}10`,
      borderRadius: normalize(16)('moderate'),
      marginVertical: normalize(5)('horizontal'),
      marginHorizontal: normalize(45)('moderate'),
    },
    copyClipboardText: {
      textAlign: 'center',
    },
    copyIcon: {
      marginLeft: normalize(5)('horizontal'),
    },
    viewShot: {
      marginTop: normalize(30)('vertical'),
    },
    icon: {
      height: normalize(22)('vertical'),
      width: normalize(22)('vertical'),
    },
    center: {
      alignSelf: 'center',
    },
    boxQRCode: {
      borderRadius: normalize(12)('moderate'),
      backgroundColor: colors.white,
      shadowColor: colors.black,
      shadowOffset: {
        width: 0,
        height: normalize(2)('moderate'),
      },
      shadowOpacity: 0.1,
      shadowRadius: normalize(7)('moderate'),
      marginBottom: normalize(20)('moderate'),
    },
    overlay: {
      zIndex: 200,
      width: width,
      height: height,
      position: 'absolute',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignContent: 'center',
      height: normalize(30)('moderate'),
      marginTop: normalize(20)('moderate'),
      marginBottom: normalize(15)('moderate'),
    },
    containerHeader: {
      flexDirection: 'row',
      backgroundColor: colors.primary50,
      height: normalize(58)('moderate'),
      alignItems: 'center',
      justifyContent: 'center',
    },
    marginBoxQR: {
      margin: normalize(10)('moderate'),
    },
  }),
)
