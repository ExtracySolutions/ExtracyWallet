import React, { FC, useCallback, useEffect, useRef } from 'react'

import { FrequentRpc, TokenPlatform } from '@extracy-wallet-controller'
import { useAppDispatch, useAppSelector } from '@hooks'
import { useFocusEffect } from '@react-navigation/core'
import { makeStyles } from '@themes'
import { Button, Container, Header, Text } from 'components'
import Engine from 'core/Engine'
import { isEmpty } from 'lodash'
import { useNavigation } from 'navigation'
import { BackHandler, Dimensions, FlatList, View } from 'react-native'
import { addTokens, closeSelectedNetwork } from 'reduxs/reducers'
import { DEFAULT_FREQUENT_RPC } from 'ultils'

import { SelectedNetworkItem } from './SelectedNetworkItem'

const { width } = Dimensions.get('screen')
export type SelectedNetworkProps = {}
export const SelectedNetwork: FC<SelectedNetworkProps> = (props) => {
  const themeStore = useAppSelector((state) => state.root.theme.theme)
  const isSelectedNetwork = useAppSelector(
    (state) => state.root.tokenList.isSelectedNetwork,
  )
  const networkList = useAppSelector(
    (state) => state.root.tokenList.networkListAll,
  )
  const selectedAccount = useAppSelector(
    (state) =>
      state.root.engine.backgroundState.PreferencesController
        ?.selectedAccountIndex,
  )
  const styles = useStyles(props, themeStore)
  const navigation = useNavigation()
  const listRef = useRef<any>(null)
  const dispatch = useAppDispatch()

  const getTokenList = useCallback(async () => {
    if (selectedAccount?.toString() && isSelectedNetwork) {
      const tokenList =
        await Engine.context.TokensController?.getTokensBySelectAccount()

      if (tokenList) {
        dispatch(
          addTokens({
            selectedAccount,
            tokenParam: tokenList,
          }),
        )
      }
    }
  }, [dispatch, isSelectedNetwork, selectedAccount])

  const handleConfirmSelectedNetwork = useCallback(() => {
    dispatch(closeSelectedNetwork())
  }, [dispatch])

  useEffect(() => {
    getTokenList()
  }, [getTokenList])

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.goBack()
        return true
      }
      BackHandler.addEventListener('hardwareBackPress', onBackPress)

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress)
      }
    }, [navigation]),
  )

  const renderItem = ({
    item,
    index,
  }: {
    item: TokenPlatform & FrequentRpc
    index: number
  }) => {
    return (
      <View
        key={index}
        style={index === 0 && !isSelectedNetwork ? styles.container : null}
      >
        <SelectedNetworkItem
          key={index}
          {...item}
          nickname={item.nickname}
          networkName={item.networkName}
        />
      </View>
    )
  }

  return isSelectedNetwork ? (
    <Container style={styles.root}>
      <Header disableBack title={`Choose Network`} />
      <View style={styles.body}>
        <Text style={styles.text}>
          Choose your frequently used networks. You can change this list later.
        </Text>
        <FlatList
          ref={listRef}
          renderItem={renderItem}
          //@ts-ignore
          data={DEFAULT_FREQUENT_RPC}
          keyExtractor={(item) => item.token_id}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <View style={styles.bottom}>
        <Button
          round
          text={'Confirm'}
          variant="fulfill"
          onPress={handleConfirmSelectedNetwork}
        />
      </View>
    </Container>
  ) : (
    <View style={styles.root}>
      <View style={styles.body}>
        <FlatList
          ref={listRef}
          renderItem={renderItem}
          //@ts-ignore
          data={
            selectedAccount?.toString()
              ? isEmpty(networkList[selectedAccount])
                ? DEFAULT_FREQUENT_RPC
                : networkList[selectedAccount]
              : null
          }
          keyExtractor={(item) => item.token_id}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  )
}

const useStyles = makeStyles<SelectedNetworkProps>()(
  ({ colors, normalize, font }) => ({
    root: {
      backgroundColor: colors.background,
      flex: 1,
    },
    text: {
      fontSize: font.size.title2,
      textAlign: 'center',
      paddingHorizontal: normalize(30)('horizontal'),
      paddingTop: normalize(15)('horizontal'),
      paddingBottom: normalize(10)('horizontal'),
    },
    body: {
      flex: 1,
      backgroundColor: colors.backgroundList,
      justifyContent: 'center',
      flexDirection: 'column',
      alignItems: 'center',
    },
    container: {
      width: width,
      paddingTop: normalize(20)('vertical'),
    },
    bottom: {
      justifyContent: 'flex-end',
      shadowColor: 'black',
      backgroundColor: colors.white,
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      elevation: 10,
      zIndex: 100,
      paddingTop: normalize(20)('vertical'),
      paddingHorizontal: normalize(15)('horizontal'),
    },
  }),
)
