import React, { FC, useCallback, useState, useRef, useEffect } from 'react'

import { NetworkType, Token as TokenType } from '@extracy-wallet-controller'
import { useAppDispatch, useAppSelector } from '@hooks'
import { makeStyles } from '@themes'
import { ActionButtonIcon } from 'assets'
import Engine from 'core/Engine'
import { isEmpty } from 'lodash'
import { useNavigation } from 'navigation'
import { Dimensions, Pressable, View, Platform } from 'react-native'
import DraggableFlatList, {
  ScaleDecorator,
  RenderItemParams,
} from 'react-native-draggable-flatlist'
import Animated, {
  Easing,
  useAnimatedStyle,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {
  addTokens,
  changeTokenPlatform,
  addTokenHide,
  reOderTokens,
  addDataAPI,
} from 'reduxs/reducers'

import { usePriceTokensQuery } from '../../reduxs/services'
import { AssetExpandItem } from './AssetExpandItem'

export const { height, width } = Dimensions.get('screen')
export type TokenListProps = {
  coingecko_id: string
  navigation: any
  route: any
} & TokenType

const timingConfig = {
  duration: 500,
  easing: Easing.bezier(0.25, 0.1, 0.25, 1),
}
export const Token: FC<TokenListProps> = (props) => {
  const themeStore = useAppSelector((state) => state.root.theme.theme)
  const tokenRedux = useAppSelector((state) => state.root.tokenList.tokenList)
  const selectedAccount =
    Engine.state.PreferencesController?.selectedAccountIndex
  const inset = useSafeAreaInsets()
  const [activeTokens, setTokens] = useState<TokenType[]>([])
  const styles = useStyles(props, themeStore)
  const dispatch = useAppDispatch()
  const navigation = useNavigation()

  const [selectionTokenID, setSelectionTokenID] = useState<string>('')
  //set animation default open screen
  // const [offset, setOffSet] = useState(0)
  const offset = useSharedValue(1)

  const currentOffset = useRef<number>(1)
  const heightListToken = useRef<number>(0)
  const locationYTouchPage = useRef<number>(0)

  const scrollableListRef = useRef<any>(null)
  const [ids, setIds] = useState<string>('')
  const { data, error, isLoading, isFetching, isSuccess } =
    usePriceTokensQuery(ids)

  const getTokenList = useCallback(async () => {
    if (selectedAccount?.toString()) {
      if (isEmpty(tokenRedux[selectedAccount])) {
        const tokenList =
          await Engine.context.TokensController?.getTokensBySelectAccount()
        if (tokenList) {
          setTokens(tokenList)
          let idsToken = tokenList[0].coingecko_id
          tokenList?.forEach((item) => {
            idsToken = !isEmpty(idsToken)
              ? idsToken + ',' + item.coingecko_id
              : item.coingecko_id
          })
          idsToken && setIds(idsToken)
          dispatch(
            addTokens({
              selectedAccount,
              tokenParam: tokenList,
            }),
          )
        }
      } else {
        let tokens = []
        let idsToken = ''
        for (let key of Object.keys(tokenRedux[selectedAccount])) {
          idsToken = !isEmpty(idsToken)
            ? idsToken + ',' + tokenRedux[selectedAccount][+key].coingecko_id
            : tokenRedux[selectedAccount][+key].coingecko_id + ''
          if (tokenRedux[selectedAccount][+key].isHide === false) {
            tokens.push(tokenRedux[selectedAccount][+key])
          }
        }
        Promise.all(tokens)

        setTokens(tokens)
        idsToken && setIds(idsToken)
        !isLoading &&
          !error &&
          !isFetching &&
          isSuccess &&
          dispatch(addDataAPI(data))
      }
    }
  }, [
    data,
    dispatch,
    error,
    isFetching,
    isLoading,
    isSuccess,
    selectedAccount,
    tokenRedux,
  ])

  const handleDrag = useCallback(
    (tokenParam: TokenType[]) => {
      if (selectedAccount?.toString()) {
        const temp = []
        for (let key of Object.keys(tokenRedux[selectedAccount])) {
          if (tokenRedux[selectedAccount][+key].isHide === true) {
            temp.push(tokenRedux[selectedAccount][+key])
          }
        }
        const tokenAll = tokenParam.concat(temp)
        dispatch(
          addTokenHide({
            tokenHide: temp,
            selectedAccount: selectedAccount,
          }),
        )
        dispatch(reOderTokens({ tokenParam, selectedAccount }))
        // dispatch(
        //   hideToken({
        //     selectedAccount,
        //   }),
        // )
        setTokens(tokenAll)
      }
    },
    [dispatch, selectedAccount, tokenRedux],
  )

  const handleExpand = useCallback(
    async (tokenID, index, platform) => {
      setSelectionTokenID(tokenID)

      const option1 =
        locationYTouchPage.current - (height - heightListToken.current)

      const option2 =
        platform.length * 50 +
        110 +
        locationYTouchPage.current +
        inset.bottom +
        inset.top +
        (Platform.OS === 'ios' ? 0 : 70)

      // get sum num platform * height item(50) + height component infor token and send, received (140)
      // 40 is height bottom memu

      if (
        option1 < 40 || // when click near top of FlatList || 40 is space item overload under Tabar
        option2 > height // when item expand overload screen
      ) {
        setTimeout(() => {
          scrollableListRef.current?.scrollToIndex({
            index: index,
            viewPosition: 0,
          })
        }, 400)
      }
    },
    [inset.bottom, inset.top],
  )

  const handleScroll = useCallback(
    (event) => {
      const offsetList = event.nativeEvent.locationY

      // set change state, icon add TOKEN
      if (currentOffset.current < offsetList) {
        if (Math.abs(currentOffset.current) - Math.abs(offsetList) < 25) {
          offset.value = 1
          props.route.params.setIsMoving(false) // move bottom
        }
      } else {
        if (Math.abs(currentOffset.current) - Math.abs(offsetList) < 25) {
          offset.value = 0
          props.route.params.setIsMoving(true) // move top
        }
      }
    },
    [offset, props],
  )

  const handelScrollStart = useCallback((event) => {
    const offsetList = event.nativeEvent.locationY

    currentOffset.current = offsetList
  }, [])

  useEffect(() => {
    getTokenList()
  }, [getTokenList])

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(offset.value * -230, timingConfig),
        },
      ],
    }
  })

  const handleAddToken = useCallback(() => {
    navigation.navigate('AddToken')
    dispatch(
      changeTokenPlatform({
        token_id: '',
        networkType: NetworkType.ERC20,
        chainID: '',
        networkName: '',
        symbol: '',
        decimals: '',
        address: '',
        image: '',
        isNative: false,
        isHide: false,
      }),
    )
  }, [dispatch, navigation])

  const renderActiveToken = useCallback(
    ({ item, index, drag, isActive }: RenderItemParams<TokenType>) => {
      return (
        <ScaleDecorator>
          <View
            style={[
              index === 0 ? styles.container : null,
              activeTokens && index === activeTokens?.length - 1,
            ]}
            onTouchStart={(e) => {
              locationYTouchPage.current = e.nativeEvent.pageY
            }}
          >
            <AssetExpandItem
              isActive={isActive}
              onLongPress={drag}
              selectionTokenID={selectionTokenID}
              {...item}
              priceToken={
                !isSuccess && isLoading && isFetching && error
                  ? '---'
                  : !data
                  ? '---'
                  : //@ts-ignore
                    data?.[item.coingecko_id]?.usd ?? 0
              }
              usd_24h_change={
                !isSuccess && isLoading && isFetching && error
                  ? '---'
                  : !data
                  ? '---'
                  : //@ts-ignore
                    data?.[item.coingecko_id]?.usd_24h_change ?? 0
              }
              onPress={() => {
                handleExpand(item.token_id, index, item.platform)
              }}
            />
          </View>
        </ScaleDecorator>
      )
    },
    [
      activeTokens,
      data,
      error,
      handleExpand,
      isFetching,
      isLoading,
      isSuccess,
      selectionTokenID,
      styles.container,
    ],
  )

  const keyExtractor = useCallback((item) => item.token_id.toString(), [])

  const getItemLayout = useCallback(
    (data, index) => ({ length: 60, offset: 60 * index, index }),
    [],
  )

  const renderDraggableFlatList = useCallback(() => {
    return (
      <DraggableFlatList
        ref={scrollableListRef}
        onTouchMove={handleScroll}
        onTouchStart={handelScrollStart}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={1}
        renderItem={renderActiveToken}
        data={activeTokens}
        onDragEnd={({ data }) => handleDrag(data)}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        maxToRenderPerBatch={15}
        windowSize={13}
      />
    )
  }, [
    activeTokens,
    getItemLayout,
    handelScrollStart,
    handleDrag,
    handleScroll,
    keyExtractor,
    renderActiveToken,
  ])

  const renderAddToken = useCallback(() => {
    return (
      <Animated.View style={[styles.groupButton, animatedStyles]}>
        <Pressable style={styles.icon} onPress={handleAddToken}>
          <ActionButtonIcon fill="red" />
        </Pressable>
      </Animated.View>
    )
  }, [animatedStyles, handleAddToken, styles.groupButton, styles.icon])

  return (
    <View
      style={styles.root}
      onLayout={(event) => {
        var { height } = event.nativeEvent.layout
        heightListToken.current = height + 50
      }}
    >
      {activeTokens && renderDraggableFlatList()}
      {renderAddToken()}
    </View>
  )
}

const useStyles = makeStyles<TokenListProps>()(({ colors, normalize }) => ({
  root: {
    backgroundColor: colors.grey16,
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },

  container: {
    marginTop: normalize(8)('vertical'),
    width: width,
  },
  groupButton: {
    height: normalize(44)('moderate'),
    width: normalize(44)('moderate'),
    borderRadius: normalize(12)('moderate'),
    position: 'absolute',
    bottom: normalize(-110)('moderate'),
    right: normalize(17)('moderate'),
  },
  icon: {
    height: normalize(40)('moderate'),
    width: normalize(45)('moderate'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  plus: {
    fontSize: normalize(45)('moderate'),
    position: 'absolute',
    color: colors.white,
  },
}))
