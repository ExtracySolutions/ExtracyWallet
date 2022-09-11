import React from 'react'

import { colors } from '@themes'
import { ActivityIndicator, StyleSheet, View } from 'react-native'

export const Loading = () => {
  return (
    <View style={styles.activityIndicator}>
      <ActivityIndicator color={colors.dark.primary} size="large" />
    </View>
  )
}

const styles = StyleSheet.create({
  activityIndicator: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    position: 'absolute',
    backgroundColor: 'rgba(143,162,183,0.2)',
    width: '100%',
  },
})
