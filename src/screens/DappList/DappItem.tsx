import React, { FC, useCallback, useEffect, useState } from 'react'

import { FastImage, Text } from '@components'
import { useAppDispatch, useAppSelector } from '@hooks'
import { makeStyles, useTheme } from '@themes'
import { GarbageIcon } from 'assets'
import { useNavigation } from 'navigation'
import { Dimensions, View, Pressable } from 'react-native'
import {
  PanGestureHandler,
  TouchableOpacity,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler'
import Animated, {
  useSharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated'
import { SvgUri } from 'react-native-svg'
import { createNewTab, removeDapp, updateTab, Dapp } from 'reduxs/reducers'

export const Context = React.createContext('token_id')
export const { width } = Dimensions.get('screen')

export type DappItemProps = {
  bookmarkId?: string
  itemDapp: Dapp
  routeName?: string
}
export enum RouteType {
  Favorite = 'Favorite',
  FavoriteDefault = 'FavoriteDefaultWeb',
}

const windowDimensions = Dimensions.get('window')
const BUTTON_WIDTH = 80
const MAX_TRANSLATE = -BUTTON_WIDTH - 70

const timingConfig = {
  duration: 400,
  easing: Easing.bezier(0.25, 0.1, 0.25, 1),
}
const springConfig = (velocity: number) => {
  'worklet'

  return {
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
    velocity,
  }
}

export const DappItem: FC<DappItemProps> = (props) => {
  const themeStore = useAppSelector((state) => state.root.theme.theme)
  const { activeTabId } = useAppSelector((state) => state.root.browser)
  const styles = useStyles(props, themeStore)

  const { bookmarkId, itemDapp, routeName } = props
  const theme = useTheme(themeStore)
  const navigation = useNavigation()
  const dispatch = useAppDispatch()

  const isRemoving = useSharedValue(false)
  const translateX = useSharedValue(0)

  const [description, setDescription] = useState<string>('')
  const popularList: Dapp[] = require('../../../dapp.json')
  const { PreferencesController } = useAppSelector(
    (state) => state.root.engine.backgroundState,
  )

  useEffect(() => {
    popularList.forEach((item) => {
      if (item.URL === itemDapp.URL && item.description) {
        setDescription(item.description)
      }
    })
  }, [itemDapp, itemDapp.URL, popularList])

  type AnimatedGHContext = {
    startX: number
  }
  const handler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    AnimatedGHContext
  >({
    onStart: (_evt, ctx) => {
      ctx.startX = translateX.value
    },

    onActive: (evt, ctx) => {
      const nextTranslate = evt.translationX + ctx.startX
      translateX.value = Math.min(0, Math.max(nextTranslate, MAX_TRANSLATE))
    },

    onEnd: (evt) => {
      if (evt.velocityX < -20) {
        translateX.value = withSpring(
          MAX_TRANSLATE,
          springConfig(evt.velocityX),
        )
      } else {
        translateX.value = withSpring(0, springConfig(evt.velocityX))
      }
    },
  })

  const onRemove = useCallback(async () => {
    dispatch(
      removeDapp({
        bookmarkId: bookmarkId ? bookmarkId : '',
        URL: itemDapp.URL,
      }),
    )
  }, [bookmarkId, dispatch, itemDapp.URL])

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
  const styleButton = useAnimatedStyle(() => {
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
    return {}
  })

  const handleRemove = useCallback(() => {
    isRemoving.value = true
  }, [isRemoving])

  const removeButton = {
    title: 'Delete',
    backgroundColor: theme.colors.red,
    color: 'white',
    onPress: handleRemove,
  }

  const handleNavigateToBrowserTabs = useCallback(() => {
    if (routeName === RouteType.FavoriteDefault) {
      dispatch(
        updateTab({
          id: activeTabId ? activeTabId : 0,
          url: itemDapp.URL,
        }),
      )
    } else {
      dispatch(
        createNewTab({
          url: itemDapp.URL,
          accountIndex: PreferencesController?.selectedAccountIndex ?? 0,
          networkID: itemDapp.networkID,
          networkType: itemDapp.networkType,
        }),
      )
    }
    //@ts-ignore
    navigation.pop(2)
  }, [
    activeTabId,
    routeName,
    PreferencesController?.selectedAccountIndex,
    dispatch,
    navigation,
    itemDapp.URL,
    itemDapp.networkID,
    itemDapp.networkType,
  ])

  return (
    <View>
      <PanGestureHandler
        activeOffsetX={[-10, 10]}
        onGestureEvent={routeName === 'Popular List' ? () => {} : handler}
      >
        <Animated.View style={[style, styles.box]}>
          <Pressable style={styles.item} onPress={handleNavigateToBrowserTabs}>
            {/* <View style={styles.background}> */}
            {itemDapp.image?.includes('.svg') ? (
              <SvgUri
                style={styles.originIcon}
                width="70%"
                height="70%"
                uri={itemDapp.image}
              />
            ) : itemDapp.image === undefined ? (
              <FastImage
                style={styles.originIconScale}
                source={{
                  uri: 'https://i.ibb.co/fdc1wVs/logo.png',
                }}
              />
            ) : (
              <FastImage
                style={styles.originIconScale}
                source={{
                  uri: itemDapp.image,
                }}
              />
            )}
            <View style={styles.titleWrapper}>
              <Text
                variant="medium"
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.nameTitle}
              >
                {itemDapp.title}
              </Text>
              {description ? (
                <Text style={styles.subTitle}>{description}</Text>
              ) : null}
            </View>
          </Pressable>
        </Animated.View>
      </PanGestureHandler>
      <Animated.View style={[styles.boxButton, styleButton]}>
        <View
          style={[
            styles.buttonsContainer,
            {
              backgroundColor: theme.colors.alert,
            },
          ]}
        >
          <View style={[styles.button]}>
            <TouchableOpacity
              onPress={removeButton.onPress}
              style={[styles.buttonInner]}
            >
              <GarbageIcon color={'white'} />
              <Text
                variant="medium"
                style={[styles.text, { color: removeButton.color }]}
              >
                {removeButton.title}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </View>
  )
}

const useStyles = makeStyles<DappItemProps>()(
  ({ colors, normalize, font }) => ({
    item: {
      flex: 1,
      paddingHorizontal: normalize(16)('vertical'),
      marginHorizontal: normalize(16)('vertical'),
      elevation: 3,
      zIndex: 100,
      backgroundColor: 'white',
      borderRadius: normalize(12)('moderate'),
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    box: {
      height: normalize(90)('moderate'),
    },
    containerItem: {
      flex: 1,
      paddingHorizontal: normalize(15)('vertical'),
      height: normalize(84)('vertical'),
      flexDirection: 'row',
      alignItems: 'center',
      zIndex: 100,
    },
    image: {
      height: normalize(32)('moderate'),
      width: normalize(32)('moderate'),
    },
    titleWrapper: {
      flex: 1,
      marginLeft: normalize(10)('horizontal'),
      flexDirection: 'column',
    },
    nameTitle: {
      fontSize: font.size.s3,
    },
    subTitle: {
      letterSpacing: 0.1,
      fontSize: font.size.s4,
      color: colors.grey10,
      marginTop: normalize(3)('moderate'),
    },
    button: {
      width: windowDimensions.width,
      paddingRight: windowDimensions.width - BUTTON_WIDTH,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: normalize(12)('moderate'),
    },
    buttonInner: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      flexDirection: 'row',
      width: BUTTON_WIDTH + 90,
      borderRadius: normalize(12)('moderate'),
    },
    buttonsContainer: {
      borderRadius: normalize(12)('moderate'),
      height: normalize(70)('moderate'),
      alignSelf: 'flex-end',
      width: BUTTON_WIDTH + 90,
      paddingLeft: normalize(50)('moderate'),
      marginBottom: normalize(-100)('moderate'),
    },
    text: {
      fontSize: font.size.s3,
      marginLeft: normalize(10)('moderate'),
    },
    boxButton: {
      flex: 1,
      marginHorizontal: normalize(16)('vertical'),
      alignSelf: 'flex-end',
      bottom: normalize(90)('moderate'),
      width: windowDimensions.width,
      zIndex: -100,
    },
    originIcon: {
      height: normalize(105)('moderate'),
      width: normalize(105)('moderate'),
      alignSelf: 'center',
    },
    originIconScale: {
      height: normalize(30)('moderate'),
      width: normalize(30)('moderate'),
      alignSelf: 'center',
    },
  }),
)
