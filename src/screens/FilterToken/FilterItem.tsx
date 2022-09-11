import React, { FC, useCallback, useState } from 'react'

import { Button, FastImage, Switch, Text } from '@components'
import { useAppDispatch, useAppSelector } from '@hooks'
import { makeStyles } from '@themes'
import { CancelIcon, GarbageIcon } from 'assets/icons'
import Engine from 'core/Engine'
import useWalletInfo from 'hooks/useWalletInfo'
import { Dimensions, View, Pressable, Modal, Platform } from 'react-native'
import { PanGestureHandler } from 'react-native-gesture-handler'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated'
import Tooltip from 'react-native-walkthrough-tooltip'
import { removeToken } from 'reduxs/reducers'
export const Context = React.createContext('token_id')
export const { width } = Dimensions.get('screen')

export type FilterItemProps = {
  isHide: boolean
  image?: string
  symbol: string
  token_id: string
  isDisableDelete?: boolean
  handeScroll?: () => void
}

const windowDimensions = Dimensions.get('window')

export const FilterItem: FC<FilterItemProps> = (props) => {
  const { handleToken } = useWalletInfo()
  const themeStore = useAppSelector((state) => state.root.theme.theme)
  const selectedAccount = useAppSelector(
    (state) =>
      state.root.engine.backgroundState.PreferencesController
        ?.selectedAccountIndex,
  )
  const styles = useStyles(props, themeStore)

  const { isHide, image, symbol, token_id, isDisableDelete, handeScroll } =
    props

  const [isSwitch, setSwitch] = useState<boolean>(isHide)
  const [toolTipVisible, setToolTipVisible] = useState<boolean>(false)
  const [modalVisible, setModalVisible] = useState(false)
  const isRemoving = useSharedValue(false)
  const translateX = useSharedValue(0)
  const dispatch = useAppDispatch()

  const { TokensController } = Engine.context

  const timingConfig = {
    duration: 200,
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  }
  const BUTTON_WIDTH = 80

  const handleHideToken = useCallback(async () => {
    requestAnimationFrame(() => {
      handleToken(token_id, !isSwitch)
    })

    setSwitch(!isSwitch)
  }, [TokensController, dispatch, isSwitch, selectedAccount, token_id])

  const handleDeleteToken = useCallback(() => {
    isRemoving.value = true
    setModalVisible(false)
  }, [isRemoving])

  const handleToolTipVisible = useCallback(() => {
    setToolTipVisible(!toolTipVisible)
  }, [toolTipVisible])

  const onRemove = useCallback(() => {
    TokensController?.deleteToken(token_id)
    selectedAccount?.toString() &&
      dispatch(removeToken({ token_id, selectedAccount }))
  }, [TokensController, dispatch, selectedAccount, token_id])

  const handleOpenConfirmation = useCallback(() => {
    setModalVisible(true)
  }, [])

  const style = useAnimatedStyle(() => {
    if (isRemoving.value) {
      return {
        height: withTiming(0, timingConfig, () => {
          runOnJS(onRemove)()
        }),
        transform: [
          {
            translateX: withTiming(
              -windowDimensions.width - BUTTON_WIDTH,
              timingConfig,
            ),
          },
        ],
      }
    }

    return {
      height: 78,
      transform: [
        {
          translateX: translateX.value,
        },
      ],
    }
  })

  return (
    <PanGestureHandler activeOffsetY={[-100, 100]}>
      <Animated.View style={[style, styles.box]}>
        <View style={styles.item}>
          <FastImage
            resizeMode="cover"
            source={{ uri: image }}
            style={styles.image}
          />

          <View style={styles.titleWrapper}>
            <Text variant="medium" style={styles.nameTitle}>
              {symbol}
            </Text>
          </View>
          <View style={styles.groupIcon}>
            <Tooltip
              isVisible={toolTipVisible}
              content={
                <Text style={styles.textContent}>
                  Could not delete native token
                </Text>
              }
              placement="top"
              arrowStyle={styles.tooltip}
              backgroundColor={'transparent'}
              contentStyle={styles.contentStyle}
              backgroundStyle={styles.backgroundToolTip}
              showChildInTooltip={false}
              onClose={handleToolTipVisible}
            >
              <Pressable
                style={styles.delete}
                onPress={
                  !isDisableDelete
                    ? handleToolTipVisible
                    : handleOpenConfirmation
                }
              >
                <GarbageIcon color={!isDisableDelete ? 'gray' : 'red'} />
              </Pressable>
            </Tooltip>

            <Switch isSwitch={!isSwitch} onPress={handleHideToken} />
          </View>
        </View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible)
          }}
        >
          <View
            style={[
              Platform.OS === 'ios'
                ? styles.iOSBackdrop
                : styles.androidBackdrop,
              styles.backdrop,
            ]}
          />

          <Pressable
            style={styles.containerBox}
            onPress={() => setModalVisible(false)}
          >
            <Pressable onPress={null} style={styles.alertBox}>
              <Pressable
                style={styles.btnCancel}
                onPress={() => setModalVisible(false)}
              >
                <CancelIcon />
              </Pressable>
              <Text style={styles.titleDialog} variant="bold">
                Do you want to delete your token?
              </Text>
              <Button
                round
                variant={'fulfill'}
                text={'OK'}
                containerStyle={styles.button}
                onPress={() => {
                  handleDeleteToken()
                  handeScroll && handeScroll()
                }}
              />
            </Pressable>
          </Pressable>
        </Modal>
      </Animated.View>
    </PanGestureHandler>
  )
}

const useStyles = makeStyles<FilterItemProps>()(
  ({ colors, normalize, font }) => ({
    item: {
      flex: 1,
      paddingHorizontal: normalize(16)('vertical'),
      marginHorizontal: normalize(8)('vertical'),
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      zIndex: 100,
      backgroundColor: 'white',
      borderRadius: normalize(10)('vertical'),
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: normalize(20)('moderate'),
    },
    box: {
      flex: 1,
      height: normalize(90)('moderate'),
    },
    image: {
      height: normalize(32)('moderate'),
      width: normalize(32)('moderate'),
      borderRadius: normalize(50)('moderate'),
    },
    titleWrapper: {
      flex: 1,
      marginLeft: normalize(10)('horizontal'),
      flexDirection: 'column',
    },
    nameTitle: {
      fontSize: font.size.button,
    },
    background: {
      backgroundColor: colors.backgroundIcon,
      height: normalize(52)('moderate'),
      width: normalize(52)('moderate'),
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: normalize(10)('moderate'),
    },
    switch: {
      justifyContent: 'flex-start',
      alignContent: 'flex-start',
    },
    delete: {
      paddingRight: normalize(15)('moderate'),
    },
    groupIcon: {
      alignItems: 'center',
      flexDirection: 'row',
      marginRight: normalize(-10)('horizontal'),
    },
    backgroundToolTip: {
      borderRadius: normalize(14)('moderate'),
    },
    contentStyle: {
      alignSelf: 'center',
      backgroundColor: colors.black_transparent,
      marginTop: Platform.OS === 'ios' ? 0 : normalize(-20)('vertical'),
    },
    tooltip: {
      marginLeft: normalize(7)('moderate'),
      marginTop: Platform.OS === 'ios' ? 1 : normalize(-20)('vertical'),
    },
    textContent: {
      fontSize: font.size.caption1,
      color: colors.white,
    },
    iOSBackdrop: {
      backgroundColor: '#000000',
      opacity: 0.4,
    },
    androidBackdrop: {
      backgroundColor: '#232f34',
      opacity: 0.32,
    },
    backdrop: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    containerBox: {
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    alertBox: {
      width: width * 0.9,
      alignItems: 'center',
      backgroundColor: colors.white,
      justifyContent: 'center',
      elevation: 24,
      borderRadius: 10,
      paddingVertical: normalize(10)('vertical'),
    },
    btnCancel: {
      position: 'absolute',
      right: 10,
      top: 10,
      paddingBottom: normalize(10)('vertical'),
      paddingLeft: normalize(10)('vertical'),
    },
    titleDialog: {
      textAlign: 'center',
      width: width * 0.5,
      margin: normalize(20)('vertical'),
      fontSize: font.size.title1,
    },
    button: {
      width: width * 0.7,
    },
  }),
)
