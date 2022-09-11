import React, { FC, useState } from 'react'

import { useAppSelector } from '@hooks'
import { makeStyles, useTheme } from '@themes'
import {
  ArrowLeftBack,
  CustomMarkerScan,
  FlashOff,
  FlashOn,
  Photos,
} from 'assets'
import { Dimensions, Platform, TouchableOpacity, View } from 'react-native'
import { BarCodeReadEvent } from 'react-native-camera'
import QRCodeScanner from 'react-native-qrcode-scanner'

const { height: windowHeight, width: SCREEN_WIDTH } = Dimensions.get('screen')

export type ScannerProps = {
  onRead: (event: string) => void
  back?: () => void
}

export const Scanner: FC<ScannerProps> = (props) => {
  const { onRead, back } = props
  const themeStore = useAppSelector((state) => state.root.theme.theme)
  const styles = useStyles(props, themeStore)
  const theme = useTheme(themeStore)
  const [flashMode, setFlashMode] = useState<any>(0)
  const _renderButton = (Icon: React.ReactNode, callBack?: () => void) => (
    <TouchableOpacity
      onPress={callBack ? callBack : () => {}}
      style={styles.icon}
    >
      {Icon}
    </TouchableOpacity>
  )
  const [Icon] = useState(() => {
    return {
      back: <ArrowLeftBack color={theme.colors.white} />,
      photos: <Photos />,
    }
  })

  const OnFlash = () => {
    // RNCamera.Constants.FlashMode.off = 0
    // RNCamera.Constants.FlashMode.on = 1
    // RNCamera.Constants.FlashMode.auto = 2
    // RNCamera.Constants.FlashMode.torch = 3

    const statusFlash = Platform.OS === 'ios' ? 3 : 2 // TODO: 3 work on iso and 2 work on android
    setFlashMode((flashMode: any) => (flashMode === 0 ? statusFlash : 0))
  }
  const returnValue = (e: BarCodeReadEvent) => {
    const index = e.data.search(':')
    const address = index === -1 ? e.data.slice(0) : e.data.slice(index + 1)

    onRead(address)
  }

  return (
    <QRCodeScanner
      reactivate={true}
      showMarker
      onRead={returnValue}
      customMarker={
        <View>
          <View style={styles.header}>
            {_renderButton(Icon.back, back)}
            <TouchableOpacity onPress={OnFlash} style={styles.icon}>
              {flashMode === 0 ? <FlashOff /> : <FlashOn />}
            </TouchableOpacity>
            {_renderButton(<View />)}
          </View>
          <CustomMarkerScan width={SCREEN_WIDTH} height={windowHeight} />
        </View>
      }
      fadeIn={true}
      cameraStyle={styles.camera}
      cameraProps={{ flashMode: flashMode }}
    />
  )
}

const useStyles = makeStyles<ScannerProps>()(({ normalize }) => ({
  camera: {
    height: windowHeight,
  },
  icon: {
    padding: normalize(24)('moderate'),
  },
  header: {
    position: 'absolute',
    zIndex: 1,
    flexDirection: 'row',
    top: 0,
    left: 0,
    right: 0,
    justifyContent: 'space-between',
  },
}))
