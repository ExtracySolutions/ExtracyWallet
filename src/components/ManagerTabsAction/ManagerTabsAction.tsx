import React, { FC, useState } from 'react'

import { FrequentRpc, TokenPlatform } from '@extracy-wallet-controller'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs/lib/typescript/src/types'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { GestureResponderEvent, StyleSheet } from 'react-native'
import Animated from 'react-native-reanimated'

import { CustomTabBar } from './CustomTabBar'

type Network = {
  networkName?: string
  iconNetwork?: React.ReactElement
  balance?: string
  USD?: string
}
export type ManagerTabsActionProps = {
  TabArr: Tab[]
  networkList?: Network[]
  symbol?: string
  rightIconPress?: (event: GestureResponderEvent) => void
  recipientAddressScan?: string
  errorAddressScan?: string
  isValidScan?: boolean
  token?: FrequentRpc
  routeName?: string
  tokenList?: TokenPlatform[]
  setIsMoving: any
  HEIGHT_MOVE_TOP: number
}

type Tab = {
  name: string
  label: string
  component: React.ComponentState
}
export const ManagerTabsAction: FC<ManagerTabsActionProps> = (props) => {
  const {
    TabArr,
    networkList,
    rightIconPress,
    recipientAddressScan,
    errorAddressScan,
    isValidScan,
    token,
    routeName,
    tokenList,
    setIsMoving,
    HEIGHT_MOVE_TOP,
  } = props

  const Tab = createMaterialTopTabNavigator()

  const [heightTabView, setHeightTabView] = useState(0)

  return (
    <Animated.View
      onLayout={(event) => {
        let { height } = event.nativeEvent.layout
        if (heightTabView === 0) {
          setHeightTabView(height + Math.abs(HEIGHT_MOVE_TOP))
        }
      }}
      style={heightTabView !== 0 ? { height: heightTabView } : styles.container}
    >
      <Tab.Navigator
        initialRouteName={routeName}
        tabBar={(propsTab: BottomTabBarProps) => <CustomTabBar {...propsTab} />}
        swipeEnabled={false}
      >
        {TabArr.map((item, index) => {
          return (
            <Tab.Screen
              key={index}
              name={item.name}
              component={item.component}
              initialParams={{
                networkList: networkList,
                rightIconPress: rightIconPress,
                recipientAddressScan: recipientAddressScan,
                errorAddressScan: errorAddressScan,
                isValidScan: isValidScan,
                token: token,
                tokenList: tokenList,
                setIsMoving: setIsMoving,
              }}
              options={{
                tabBarLabel: item.label,
              }}
            />
          )
        })}
      </Tab.Navigator>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
