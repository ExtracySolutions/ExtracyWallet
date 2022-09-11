import * as React from 'react'

import { NavigationProp } from '@react-navigation/core/lib/typescript/src/types'
import NavigationContext from '@react-navigation/core/src/NavigationContext'
import { RouteProp } from '@react-navigation/core/src/types'
import { useRoute as RNUseRoute } from '@react-navigation/native'

import { AppStackParamsList } from './type'

/**
 * Hook to access the navigation prop of the parent screen anywhere.
 *
 * @returns Navigation prop of the parent screen.
 */
export function useNavigation<
  T extends NavigationProp<AppStackParamsList>,
>(): T {
  const navigation = React.useContext(NavigationContext)

  if (navigation === undefined) {
    throw new Error(
      "Couldn't find a navigation object. Is your component inside a screen in a navigator?",
    )
  }

  return navigation as unknown as T
}

/**
 * Hook to access the route prop of the parent screen anywhere.
 *
 * @returns Route prop of the parent screen.
 */

// export type RouteStack<RouteName extends keyof AppStackParamsList> = RouteProp<
//   AppStackParamsList,
//   RouteName
// >

// export const useRoute = <
//   T extends RouteStack<keyof AppStackParamsList>
// >(): T => {
//   const route = React.useContext(NavigationRouteContext)

//   if (route === undefined) {
//     throw new Error(
//       "Couldn't find a route object. Is your component inside a screen in a navigator?",
//     )
//   }

//   return route as T
// }

export const useRoute = <RouteName extends keyof AppStackParamsList>(
  routeName: RouteName,
): RouteProp<AppStackParamsList, RouteName> => {
  const route = RNUseRoute<any>()

  return route
}
