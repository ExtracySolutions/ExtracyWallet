import React from 'react'

import { OBLWalletIcon } from 'assets'
import { Container } from 'components'
import { View } from 'react-native'
import { makeStyles } from 'themes'

export const Background = () => {
  const styles = useStyles()

  return (
    <Container>
      <View style={styles.container}>
        <OBLWalletIcon width={100} height={100} />
      </View>
    </Container>
  )
}

const useStyles = makeStyles()(({ font, normalize }) => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontWeight: '600',
    fontSize: font.size.title1,
    marginTop: normalize(10)('vertical'),
  },
}))
