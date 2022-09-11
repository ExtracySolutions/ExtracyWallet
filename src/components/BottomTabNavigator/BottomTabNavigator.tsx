import React, { FC, useCallback, useState } from 'react'

import { useAppSelector } from '@hooks'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { makeStyles, useTheme } from '@themes'
import { DappIcon, SettingIcon, WalletIcon } from 'assets'
import {
  View,
  TouchableHighlight,
  ToastAndroid,
  BackHandler,
  FlatList,
} from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { DappBottomTab } from '../DappBottomTab'
import { Text } from '../Text'

export type BottomTabNavigatorProps = BottomTabBarProps

export const BottomTabNavigator: FC<BottomTabNavigatorProps> = (props) => {
  const themeStore = useAppSelector((state) => state.root.theme.theme)
  const styles = useStyles(props, themeStore)
  const insets = useSafeAreaInsets()
  const theme = useTheme(themeStore)

  const { state, descriptors, navigation } = props

  const [currentCount, setCurrentCount] = useState<number>(0)
  const isMoving = useSharedValue(false)

  const exitApp = useCallback(() => {
    const backAction = () => {
      if (currentCount < 1) {
        setCurrentCount(currentCount + 1)
        ToastAndroid.show('Press again to close !', ToastAndroid.SHORT)
      } else {
        BackHandler.exitApp()
      }
      setTimeout(() => {
        setCurrentCount(0)
      }, 2000)

      return true
    }

    BackHandler.addEventListener('hardwareBackPress', backAction)

    return () =>
      BackHandler.removeEventListener('hardwareBackPress', backAction)
  }, [currentCount])

  exitApp()

  const timingConfig = {
    duration: 500,
  }
  const styleDapp = useAnimatedStyle(() => {
    if (isMoving.value === true) {
      return {
        transform: [
          {
            translateX: withTiming(0, timingConfig),
          },
        ],
      }
    } else {
      return {
        transform: [
          {
            translateX: withTiming(1000, timingConfig),
          },
        ],
      }
    }
  })
  const styleWallet = useAnimatedStyle(() => {
    if (isMoving.value === true) {
      return {
        transform: [
          {
            translateY: withTiming(1000, timingConfig),
          },
        ],
      }
    } else {
      return {
        transform: [
          {
            translateY: withTiming(0, timingConfig),
          },
        ],
      }
    }
  })
  // const styleText = useAnimatedStyle(() => {
  //   if (isMoving.value === true) {
  //     return {
  //       height: withTiming(0, timingConfig),
  //     }
  //   } else {
  //     return {
  //       height: withTiming(16, timingConfig),
  //     }
  //   }
  // })
  const style = useAnimatedStyle(() => {
    if (isMoving.value === true) {
      return {
        transform: [
          {
            translateY: withTiming(1000, timingConfig),
          },
        ],
      }
    } else {
      return {
        transform: [
          {
            translateY: withTiming(0, timingConfig),
          },
        ],
      }
    }
  })
  const styleBrower = useAnimatedStyle(() => {
    if (isMoving.value === true) {
      return {
        transform: [
          {
            translateY: withTiming(200, timingConfig),
          },
        ],
      }
    } else {
      return {
        transform: [
          {
            translateY: withTiming(0, timingConfig),
          },
        ],
      }
    }
  })

  const DappBottomTabWrapper = useCallback(() => {
    return (
      <Animated.View style={[styleDapp]}>
        <DappBottomTab isMoving={isMoving} />
      </Animated.View>
    )
  }, [isMoving, styleDapp])

  const rederRoute = ({ item, index }: { item: any; index: number }) => {
    const { options } = descriptors[item.key]
    const isFocused = state.index === index

    const onPress = () => {
      const event = navigation.emit({
        type: 'tabPress',
        target: item.key,
        canPreventDefault: true,
      })
      if (!isFocused && !event.defaultPrevented) {
        if (item.name === 'Browser') {
          requestAnimationFrame(() => {
            isMoving.value = true
          })
          navigation.navigate(item.name)
        } else {
          isMoving.value = false
          navigation.navigate(item.name)
        }
      }
    }
    return (
      <>
        {item.name === 'Wallet' ? (
          <Animated.View style={[styleWallet, styles.walletIcon]}>
            <TouchableHighlight
              key={item.key}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              underlayColor={theme.colors.transparent}
              style={[styles.tab]}
              onPress={onPress}
            >
              <View style={styles.tabItem}>
                <WalletIcon
                  style={styles.tabItem}
                  color={isFocused ? theme.colors.primary : theme.colors.grey11}
                />
                <Animated.View>
                  <Text
                    style={[styles.tabText, isFocused ? styles.focus : null]}
                  >
                    Wallet
                  </Text>
                </Animated.View>
              </View>
            </TouchableHighlight>
          </Animated.View>
        ) : item.name === 'Browser' ? (
          <Animated.View style={styleBrower}>
            <TouchableHighlight
              key={item.key}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              underlayColor={theme.colors.transparent}
              onPress={onPress}
              style={[styles.tab]}
            >
              <View style={[styles.tabItem, styles.pl5]}>
                <DappIcon
                  color={isFocused ? theme.colors.primary : theme.colors.grey11}
                />
                <Text style={styles.tabText}>Browser</Text>
              </View>
            </TouchableHighlight>
          </Animated.View>
        ) : item.name === 'Setting' ? (
          <Animated.View style={style}>
            <TouchableHighlight
              key={item.key}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              underlayColor={theme.colors.transparent}
              onPress={onPress}
              style={[styles.tab]}
            >
              <View style={styles.tabItem}>
                <SettingIcon
                  color={isFocused ? theme.colors.primary : theme.colors.grey11}
                />
                <Text style={[styles.tabText, isFocused ? styles.focus : null]}>
                  Setting
                </Text>
              </View>
            </TouchableHighlight>
          </Animated.View>
        ) : null}
      </>
    )
  }
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.white,
          marginBottom: insets.bottom > 20 ? insets.bottom - 20 : insets.bottom,
        },
      ]}
    >
      <FlatList
        contentContainerStyle={styles.list}
        horizontal
        scrollEnabled={false}
        data={state.routes}
        renderItem={rederRoute}
        keyExtractor={(item) => item.key}
      />
      <View style={[styles.bottomDapp, state.index === 1 && styles.layout]}>
        {DappBottomTabWrapper()}
      </View>
    </View>
  )
}

const useStyles = makeStyles<BottomTabNavigatorProps>()(
  ({ colors, font, normalize }) => ({
    container: {
      height: normalize(50)('moderate'),
      flexDirection: 'row',
      elevation: 10,
      zIndex: 100,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.1,
      justifyContent: 'space-around',
    },
    tab: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: normalize(10)('vertical'),
      paddingHorizontal: normalize(30)('horizontal'),
    },
    tabText: {
      fontSize: font.size.s5,
      color: colors.grey11,
    },
    focus: {
      color: colors.primary,
    },
    tabItem: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    walletIcon: {
      alignSelf: 'center',
    },
    bottomDapp: {
      height: normalize(50)('moderate'),
      zIndex: -100,
      right: 0,
      bottom: 0,
      position: 'absolute',
    },
    layout: {
      zIndex: 1000,
    },
    list: {
      flex: 1,
      justifyContent: 'space-around',
    },
    pl5: {
      paddingLeft: normalize(5)('horizontal'),
    },
    walletText: {
      color: colors.primary,
      padding: normalize(5)('moderate'),
      borderRadius: normalize(100)('moderate'),
    },
  }),
)
