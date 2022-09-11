import React from 'react'

import { SearchTokenNotFround } from '@assets/icons'
import { Text } from '@components'
import { useAppSelector } from '@hooks'
import { makeStyles } from '@themes'
import { View } from 'react-native'

export const TokenNotFound = () => {
  const themeStore = useAppSelector((state) => state.root.theme.theme)
  const styles = useStyles(themeStore)
  const title = `Token not found or supported. ${'\n'} Try paste or QR scan the Contract Address for custom tokens.`
  return (
    <View style={styles.container}>
      <SearchTokenNotFround />
      <Text fontSize={14} lineHeight={20} style={styles.text}>
        {title}
      </Text>
    </View>
  )
}

export default TokenNotFound

const useStyles = makeStyles()(({ normalize }) => ({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: normalize(34)('vertical'),
  },
  text: {
    textAlign: 'center',
  },
}))
