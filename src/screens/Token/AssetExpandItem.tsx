import React, { FC, useCallback, useEffect, useState } from 'react'

import {
  SendIcon,
  SwapIcon,
  ReceivedIcon,
  RaiseIcon,
  ReduceIcon,
} from '@assets/icons'
import { Text, FastImage } from '@components'
import { Token as TokenItem, TokenPlatform } from '@extracy-wallet-controller'
import { useAppDispatch, useAppSelector } from '@hooks'
import { makeStyles, useTheme } from '@themes'
import { keyExtractor, balanceFormat } from '@ultils'
import { isEmpty } from 'lodash'
import {
  Dimensions,
  FlatList,
  TouchableOpacity,
  View,
  Pressable,
} from 'react-native'
import Animated, {
  measure,
  runOnUI,
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { changeTokenPlatform, setSelectContact } from 'reduxs/reducers'
import { RouteTab } from 'screens/ManagerAsset'

import { useNavigation } from '../../navigation/NavigationService'
import { TokenInnerItem } from './TokenInnerItem'

export const Context = React.createContext('token_id')
export const { width } = Dimensions.get('screen')

export type AssetExpandItemProps = TokenItem & {
  onPress?: any
  priceToken?: string
  usd_24h_change?: number
  onLongPress?: any
  isActive?: boolean
  selectionTokenID?: string
}

export const AssetExpandItem: FC<AssetExpandItemProps> = (props) => {
  const themeStore = useAppSelector((state) => state.root.theme.theme)
  const tokenBalances = useAppSelector(
    (state) =>
      state.root.engine.backgroundState.TokenBalancesController?.tokenBalances,
  )
  const selectedAccountIndex = useAppSelector(
    (state) =>
      state.root.engine.backgroundState.PreferencesController
        ?.selectedAccountIndex,
  )
  const hideBalance = useAppSelector(
    (state) => state.root.tokenList.hideBalance,
  )
  const navigation = useNavigation()
  const styles = useStyles(props, themeStore)
  const theme = useTheme(themeStore)
  const dispatch = useAppDispatch()

  const [platformFilter, setPlatformFilter] = useState<any>([])
  const {
    platform,
    symbol,
    name,
    image,
    token_id,
    onPress,
    priceToken,
    usd_24h_change,
    onLongPress,
    isActive,
    selectionTokenID,
  } = props
  const timingConfig = {
    duration: 400,
  }
  const [totalBalance, setTotalBalance] = useState<number>(0)
  const aref = useAnimatedRef<View>()
  const open = useSharedValue(false)
  const progress = useDerivedValue(() =>
    open.value ? withTiming(1, timingConfig) : withTiming(0, timingConfig),
  )
  const height = useSharedValue(0)
  const headerStyle = useAnimatedStyle(() => ({
    borderBottomLeftRadius: progress.value === 0 ? 8 : 0,
    borderBottomRightRadius: progress.value === 0 ? 8 : 0,
  }))
  const handleGetHeight = useCallback(() => {
    if (height.value === 0) {
      runOnUI(() => {
        'worklet'
        height.value = measure(aref).height
      })()
    }
    requestAnimationFrame(() => {
      open.value = !open.value
    })
  }, [aref, height, open])

  const style = useAnimatedStyle(() => {
    return {
      height: height.value * progress.value + 1,
      opacity: progress.value === 0 ? 0 : 1,
    }
  })
  useEffect(() => {
    let result: TokenPlatform[] = []
    for (var key of Object.keys(platform)) {
      if (platform[+key].isHide === false) {
        result.push(platform[+key])
      }
    }
    Promise.all(result)
    setPlatformFilter(result)
  }, [platform])

  useEffect(() => {
    requestAnimationFrame(() => {
      if (selectionTokenID === token_id) {
        open.value = true
        return
      }
      open.value = false
      return
    })
  }, [open, selectionTokenID, token_id])

  useEffect(() => {
    // update total balance
    try {
      if (
        !isEmpty(tokenBalances) &&
        tokenBalances &&
        selectedAccountIndex?.toString() !== undefined
      ) {
        let totalBalanceRaw = 0
        platformFilter.forEach((item: TokenPlatform) => {
          if (item.isNative) {
            totalBalanceRaw +=
              +tokenBalances?.[selectedAccountIndex]?.[item.networkType]?.[
                item.token_id
              ]?.balance
          } else {
            totalBalanceRaw +=
              +tokenBalances?.[selectedAccountIndex]?.[item.networkType]?.[
                item.address
              ]?.balance
          }
        })
        Promise.all(platformFilter)
        setTotalBalance(totalBalanceRaw)
      }
    } catch (error) {
      console.log('Update total balance failed!', error)
    }
  }, [platformFilter, selectedAccountIndex, tokenBalances])

  const handleOpenManagerAsset = useCallback(
    (token, tokenList, routeName) => {
      dispatch(changeTokenPlatform(token))
      dispatch(setSelectContact({ address: '', index: -1, name: '' }))
      navigation.navigate('ManagerAsset', {
        token: token,
        tokenList: tokenList,
        routeName: routeName,
      })
    },
    [dispatch, navigation],
  )

  const renderItem = useCallback(
    ({ item, index }: { item: TokenPlatform; index: number }) => {
      return (
        <Pressable
          onPress={() =>
            handleOpenManagerAsset(item, platformFilter, RouteTab.send)
          }
        >
          <View
            style={[
              styles.itemExpand,
              index === platformFilter.length - 1 && styles.lastItem,
            ]}
          >
            <TokenInnerItem {...item} priceToken={Number(priceToken)} />
          </View>
        </Pressable>
      )
    },
    [
      handleOpenManagerAsset,
      platformFilter,
      priceToken,
      styles.itemExpand,
      styles.lastItem,
    ],
  )

  return (
    <View style={styles.item}>
      <Pressable
        onPress={() => {
          handleGetHeight()
          onPress()
        }}
        onLongPress={onLongPress}
        disabled={isActive}
      >
        <Animated.View style={[styles.containerItem, headerStyle]}>
          <FastImage
            resizeMode="cover"
            source={{ uri: image }}
            style={styles.image}
          />
          <View style={styles.token}>
            <View style={styles.groupRow}>
              <Text variant="medium" numberOfLines={1} style={styles.tokenText}>
                {name}
              </Text>
              <View style={styles.boxSymbol}>
                <Text
                  variant="bold"
                  numberOfLines={1}
                  style={styles.symbolText}
                >
                  {symbol}
                </Text>
              </View>
            </View>
            <View style={styles.groupRow}>
              <Text style={styles.text}>
                {priceToken
                  ? !isNaN(Number(priceToken))
                    ? `$${balanceFormat(
                        priceToken?.toString().toLocaleString(),
                      )}`
                    : '---'
                  : '0'}
              </Text>

              {!isNaN(Number(usd_24h_change)) ? (
                Number(usd_24h_change) > 0 ? (
                  <RaiseIcon
                    style={styles.iconTrend}
                    color={theme.colors.primary50}
                  />
                ) : (
                  <ReduceIcon
                    style={styles.iconTrend}
                    color={theme.colors.primary50}
                  />
                )
              ) : null}

              <Text
                variant="regular"
                numberOfLines={1}
                style={[
                  styles.usdChangeText,
                  Number(usd_24h_change) < 0 && styles.usdNegativeChangeText,
                ]}
              >
                {!isNaN(Number(usd_24h_change))
                  ? `${new Intl.NumberFormat('en-IN', {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 1,
                      useGrouping: true,
                    }).format(Number(usd_24h_change))} %`
                  : '---'}
              </Text>
            </View>
          </View>

          <View style={styles.group}>
            <View style={styles.groupText}>
              <Text style={styles.title} lineHeight={20} variant="medium">
                {!hideBalance
                  ? !isNaN(totalBalance)
                    ? balanceFormat(totalBalance.toString())
                    : 0
                  : `****`}
              </Text>
              <Text style={styles.text} lineHeight={16}>
                {!hideBalance
                  ? `$${
                      !isNaN(Number(priceToken) * totalBalance)
                        ? balanceFormat(
                            (Number(priceToken) * totalBalance).toString(),
                          )
                        : 0
                    }`
                  : `****`}
              </Text>
              {/* open when need it */}
            </View>
          </View>
        </Animated.View>
      </Pressable>

      <Animated.View style={[style, styles.items]}>
        <View style={styles.items} ref={aref}>
          <View style={styles.groupIcon}>
            <View style={styles.boxIconInner}>
              <TouchableOpacity
                onPress={() =>
                  handleOpenManagerAsset(
                    platformFilter[0],
                    platformFilter,
                    RouteTab.send,
                  )
                }
                style={styles.iconInner}
              >
                <SendIcon color={theme.colors.primary50} />
              </TouchableOpacity>
              <Text fontSize={12} lineHeight={14} style={styles.textIconInner}>
                Send
              </Text>
            </View>
            <View style={styles.boxIconInner}>
              <TouchableOpacity
                onPress={() =>
                  handleOpenManagerAsset(
                    platformFilter[0],
                    platformFilter,
                    RouteTab.received,
                  )
                }
                style={styles.iconInner}
              >
                <ReceivedIcon color={theme.colors.primary50} />
              </TouchableOpacity>
              <Text fontSize={12} lineHeight={14} style={styles.textIconInner}>
                Receive
              </Text>
            </View>
            <View style={styles.boxIconInner}>
              <TouchableOpacity style={styles.iconInner}>
                <SwapIcon fill={theme.colors.primary50} />
              </TouchableOpacity>
              <Text fontSize={12} lineHeight={14} style={styles.textIconInner}>
                Swap
              </Text>
            </View>
          </View>

          <FlatList
            renderItem={renderItem}
            data={platformFilter}
            scrollEnabled={false}
            keyExtractor={keyExtractor}
          />
        </View>
      </Animated.View>
    </View>
  )
}

const useStyles = makeStyles<AssetExpandItemProps>()(
  ({ colors, normalize, font }) => ({
    item: {
      flexGrow: 1,
      width: width * 0.93,
      marginHorizontal: normalize(12)('vertical'),
      marginBottom: normalize(12)('vertical'),
      shadowColor: colors.black,
      shadowOffset: {
        width: 0,
        height: normalize(1)('moderate'),
      },
      shadowOpacity: 0.1,
      shadowRadius: normalize(4)('moderate'),
      elevation: 3,
      zIndex: 100,
      backgroundColor: colors.white,
      borderRadius: normalize(10)('moderate'),
    },
    containerItem: {
      paddingHorizontal: normalize(15)('vertical'),
      height: normalize(64)('moderate'),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderTopLeftRadius: normalize(10)('vertical'),
      borderTopRightRadius: normalize(10)('vertical'),
      shadowColor: colors.black,
      shadowOffset: {
        width: 0,
        height: normalize(0.5)('moderate'),
      },
      shadowOpacity: 0.05,
      shadowRadius: normalize(2)('moderate'),
      zIndex: 100,
    },
    lastItem: {
      borderBottomLeftRadius: normalize(10)('vertical'),
      borderBottomRightRadius: normalize(10)('vertical'),
      borderBottomWidth: 0,
      backgroundColor: colors.white,
    },
    itemExpand: {
      borderBottomWidth: 1,
      borderBottomColor: colors.grey15,
    },
    token: {
      flexDirection: 'column',
      flexGrow: 1,
      flexShrink: 1,
      paddingHorizontal: normalize(10)('horizontal'),
    },
    group: {
      flexGrow: 2,
      flexShrink: 0,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    groupText: {
      alignItems: 'flex-end',
      flexDirection: 'column',
    },
    title: {
      fontSize: font.size.s3,
      marginBottom: normalize(4)('moderate'),
    },
    text: {
      fontSize: font.size.s4,
      color: colors.grey11,
    },
    tokenText: {
      fontSize: font.size.s3,
    },
    symbolText: {
      fontSize: font.size.s5,
      color: colors.grey8,
    },
    usdChangeText: {
      fontSize: font.size.s4,
      color: colors.profit,
      paddingLeft: normalize(2)('horizontal'),
    },
    usdNegativeChangeText: {
      color: colors.alert,
    },
    groupRow: {
      flexDirection: 'row',
      alignItems: 'center',
      height: normalize(20)('moderate'),
    },
    groupIcon: {
      height: normalize(78)('vertical'),
      paddingHorizontal: normalize(36)('horizontal'),
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.white,
      justifyContent: 'center',
      borderBottomWidth: 1,
      borderTopWidth: 1,
      borderTopColor: colors.grey15,
      borderBottomColor: colors.grey15,
      shadowColor: colors.black,
    },
    iconInner: {
      width: normalize(44)('horizontal'),
      height: normalize(44)('horizontal'),
      borderRadius: normalize(50)('horizontal'),
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: `${colors.primary50}${10}`,
    },
    boxIconInner: {
      marginHorizontal: normalize(15)('horizontal'),
      justifyContent: 'space-around',
      marginVertical: normalize(8)('vertical'),
      alignItems: 'center',
    },
    textIconInner: {
      color: colors.primary50,
      marginTop: normalize(10)('vertical'),
    },
    items: {
      overflow: 'hidden',
    },
    image: {
      height: normalize(32)('moderate'),
      width: normalize(32)('moderate'),
      borderRadius: normalize(50)('moderate'),
    },
    boxSymbol: {
      backgroundColor: colors.grey14,
      borderRadius: normalize(4)('horizontal'),
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: normalize(4)('horizontal'),
      height: normalize(18)('moderate'),
      marginLeft: normalize(5)('horizontal'),
      marginTop: normalize(-4)('horizontal'),
    },
    iconTrend: {
      marginLeft: normalize(10)('moderate'),
      alignSelf: 'center',
      marginBottom: normalize(2)('moderate'),
    },
  }),
)
