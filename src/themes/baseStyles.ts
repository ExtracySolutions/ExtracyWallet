import { StyleSheet } from 'react-native'

import { normalize } from './nomalize'

export const baseStyles = StyleSheet.create({
  verticalContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  horizontalContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paddingText: {
    paddingHorizontal: normalize(10)('horizontal'),
  },
})

export type BaseStyles = typeof baseStyles
