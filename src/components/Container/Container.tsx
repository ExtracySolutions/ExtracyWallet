import React, { FC } from 'react'

import { StyleSheet, ViewProps } from 'react-native'
import { SafeAreaView, Edge } from 'react-native-safe-area-context'

import { StatusBar } from '../StatusBar'

export type ContainerProps = {
  statusColor?: string
  edges?: Edge[]
} & ViewProps

export const Container: FC<ContainerProps> = (props) => {
  const { statusColor, style, edges, children } = props

  return (
    <SafeAreaView
      edges={edges ?? ['left', 'right', 'bottom']}
      style={[styles.root, style]}
    >
      <StatusBar statusColor={statusColor} />
      {children}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
})
