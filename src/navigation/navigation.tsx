/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useRef } from 'react'

import { BottomTabNavigator } from '@components'
import { useAppDispatch, useAppSelector } from '@hooks'
import analytics from '@react-native-firebase/analytics'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import {
  NavigationContainer,
  NavigationContainerRef,
  LinkingOptions,
} from '@react-navigation/native'
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack'
import {
  Main,
  ManagerAsset,
  Setting,
  StartUp,
  Legal,
  ImportWallet,
  TransactionDetail,
  AddToken,
  ViewSeedPhrase,
  ConfirmSeedPhrase,
  Language,
  WhiteList,
  Currency,
  Backup,
  RevealSeedPhrase,
  AddEditWhiteList,
  MemoizedBrowser,
  Disconnection,
  Bookmark,
  FilterToken,
  DappList,
  ChangePassword,
  CreatePassword,
  SecuritySettings,
  InputPassword,
  DappHistory,
  AskUpdateSeedPhrase,
  Setup2FA,
  SetupPassword,
  SetupBiometric,
} from '@screens'
import { useTheme } from '@themes'
import Engine from 'core/Engine'
import { Host } from 'react-native-portalize'
import SplashScreen from 'react-native-splash-screen'
import { closeAllTab } from 'reduxs/reducers'
import { clearAll, retrieveVault } from 'ultils'

import { useProvider } from '../provider'

const StartUpStack = createStackNavigator()
const WalletStack = createStackNavigator()
const AppStack = createStackNavigator()
const BottomTabs = createBottomTabNavigator()

type AppNavigationProps = {}
type StartUpNavigator = {}
type WalletStackNavigator = {}
type BottomTabsNavigator = {}

const linking: LinkingOptions = {
  prefixes: ['oblwallet://'],
  config: {
    screens: {
      StartUp: {
        path: 'social',
      },
    },
  },
}

const StartUpNavigation: FC<StartUpNavigator> = () => {
  return (
    <StartUpStack.Navigator
      initialRouteName="StartUp"
      headerMode="none"
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      {/**
       *  screen belong to start up navigation
       */}

      <StartUpStack.Screen name={'StartUp'} component={StartUp} />
      <StartUpStack.Screen name={'Legal'} component={Legal} />
      <StartUpStack.Screen name={'Backup'} component={Backup} />
      <StartUpStack.Screen name={'ImportWallet'} component={ImportWallet} />
      <StartUpStack.Screen name={'ViewSeedPhrase'} component={ViewSeedPhrase} />
      <StartUpStack.Screen name="CreatePassword" component={CreatePassword} />
      <StartUpStack.Screen
        name={'ConfirmSeedPhrase'}
        component={ConfirmSeedPhrase}
      />
      <StartUpStack.Screen
        name={'AskUpdateSeedPhrase'}
        component={AskUpdateSeedPhrase}
      />
      <StartUpStack.Screen name={'Setup2FA'} component={Setup2FA} />
      <StartUpStack.Screen name={'SetupPassword'} component={SetupPassword} />
      <StartUpStack.Screen name={'SetupBiometric'} component={SetupBiometric} />
    </StartUpStack.Navigator>
  )
}

const WalletNavigation: FC<WalletStackNavigator> = () => {
  return (
    <WalletStack.Navigator
      initialRouteName="Main"
      headerMode="none"
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <WalletStack.Screen
        name={'Main'}
        component={Main}
        options={{ headerShown: false }}
      />
      <WalletStack.Screen name={'StartUp'} component={StartUp} />
    </WalletStack.Navigator>
  )
}

const BottomTabsNavigation: FC<BottomTabsNavigator> = () => {
  return (
    <BottomTabs.Navigator
      initialRouteName="Wallet"
      tabBar={(props) => <BottomTabNavigator {...props} />}
      tabBarOptions={{
        keyboardHidesTabBar: true,
      }}
    >
      <BottomTabs.Screen
        key="wallet"
        name={'Wallet'}
        component={WalletNavigation}
      />
      <BottomTabs.Screen
        key="browser"
        name={'Browser'}
        component={MemoizedBrowser}
      />
      <BottomTabs.Screen key="setting" name={'Setting'} component={Setting} />
    </BottomTabs.Navigator>
  )
}

const AppNavigation: FC<AppNavigationProps> = () => {
  const dispatch = useAppDispatch()
  const themeStore = useAppSelector((state) => state.root.theme.theme)
  const { processOnboarding } = useAppSelector((state) => state.root.onboarding)
  const { notLogin } = useAppSelector((state) => state.root.notLogin)

  const {
    canOpenWallet,
    loading,
    handleNoInternet,
    isConnected,
    showLockScreen,
    handleRemoveWallet,
    // InitApp,
  } = useProvider()
  const theme = useTheme(themeStore)
  // ref const to log screen view
  const routeNameRef = useRef<string | null | undefined>(null)
  const navigationRef = useRef<NavigationContainerRef | null | undefined>(null)

  const resetWallet = async () => {
    handleRemoveWallet()
    const { KeyringController } = Engine.context
    dispatch(closeAllTab())
    await KeyringController?.setLocked()
    await clearAll()
    await Engine.resetState()
  }

  useEffect(() => {
    if (!loading) {
      SplashScreen.hide()
      // dispatch(setProcessOnBoarding(false))
    }
  }, [loading])

  useEffect(() => {
    handleNoInternet()
  }, [isConnected])

  useEffect(() => {
    retrieveVault().then(async (vault) => {
      if (vault === undefined) {
        await resetWallet()
      }
    })
  }, [])

  return (
    <NavigationContainer
      //@ts-ignore
      ref={navigationRef}
      onReady={() => {
        routeNameRef.current = navigationRef?.current?.getCurrentRoute()?.name
      }}
      onStateChange={async () => {
        const previousRouteName = routeNameRef.current
        const currentRouteName = navigationRef?.current?.getCurrentRoute()?.name

        if (previousRouteName !== currentRouteName) {
          await analytics().logScreenView({
            screen_name: currentRouteName,
            screen_class: currentRouteName,
          })
        }
        routeNameRef.current = currentRouteName
      }}
      theme={{
        //@ts-ignore
        colors: {
          background: theme.colors.background,
          border: theme.colors.background,
          text: theme.colors.text,
          primary: theme.colors.transparent,
          card: theme.colors.secondary,
        },
      }}
      linking={linking}
    >
      <Host>
        <AppStack.Navigator
          initialRouteName="MainStack"
          headerMode={'none'}
          detachInactiveScreens={true}
          screenOptions={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        >
          {isConnected ? (
            canOpenWallet && !processOnboarding && !notLogin ? (
              !showLockScreen ? (
                <>
                  <AppStack.Screen
                    name={'MainStack'}
                    component={BottomTabsNavigation}
                    // options={{
                    //   cardStyleInterpolator: ({ current }) => {
                    //     return {
                    //       cardStyle: {
                    //         opacity: current.progress.interpolate({
                    //           inputRange: [0, 1],
                    //           outputRange: [0, 1],
                    //         }),
                    //         transform: [
                    //           {
                    //             translateY: current.progress.interpolate({
                    //               inputRange: [0, 1],
                    //               outputRange: [1, 0],
                    //             }),
                    //           },
                    //         ],
                    //       },
                    //     }
                    //   },
                    // }}
                  />
                  <AppStack.Screen
                    name={'ManagerAsset'}
                    component={ManagerAsset}
                    options={{ headerShown: false }}
                  />
                  <AppStack.Screen
                    name={'TransactionDetail'}
                    component={TransactionDetail}
                  />
                  <AppStack.Screen name={'AddToken'} component={AddToken} />
                  <AppStack.Screen name={'Language'} component={Language} />
                  <AppStack.Screen name={'WhiteList'} component={WhiteList} />
                  <AppStack.Screen
                    name={'AddEditWhiteList'}
                    component={AddEditWhiteList}
                  />
                  <AppStack.Screen
                    name={'CurrencyConversion'}
                    component={Currency}
                  />
                  <AppStack.Screen
                    name={'RevealSeedPhrase'}
                    component={RevealSeedPhrase}
                  />
                  <AppStack.Screen
                    name={'Browser'}
                    component={MemoizedBrowser}
                  />
                  <AppStack.Screen name={'DappList'} component={DappList} />
                  <AppStack.Screen name={'Bookmark'} component={Bookmark} />
                  <AppStack.Screen
                    name={'FilterToken'}
                    component={FilterToken}
                  />
                  <AppStack.Screen
                    name="SecuritySettings"
                    component={SecuritySettings}
                  />
                  <AppStack.Screen
                    name="ChangePassword"
                    component={ChangePassword}
                  />
                  {/* <AppStack.Screen name="Filter" component={Filter} /> */}
                  <AppStack.Screen
                    name={'DappHistory'}
                    component={DappHistory}
                  />
                </>
              ) : (
                <AppStack.Screen
                  name="InputPassword"
                  component={InputPassword}
                />
              )
            ) : (
              <AppStack.Screen
                name="StartUp"
                component={StartUpNavigation}
                options={{
                  animationEnabled: false,
                }}
              />
            )
          ) : (
            <AppStack.Screen
              name={'Disconnection'}
              component={Disconnection}
              options={{
                animationEnabled: false,
              }}
            />
          )}
        </AppStack.Navigator>
      </Host>
    </NavigationContainer>
  )
}

export default AppNavigation
