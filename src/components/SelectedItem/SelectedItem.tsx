import React, { FC, memo } from 'react'

import { RoundCheckIcon } from '@assets/icons'
import { useAppSelector } from '@hooks'
import { makeStyles, useTheme } from '@themes'
import { View, TouchableOpacity, ViewStyle } from 'react-native'

export type SelectedItemProps = {
  selected: boolean
  onPress?: () => void
  style?: ViewStyle
}

export const SelectedItem: FC<SelectedItemProps> = memo((props) => {
  const themeStore = useAppSelector((state) => state.root.theme.theme)
  const theme = useTheme(themeStore)
  const styles = useStyles(props, themeStore)
  const { selected, onPress, style, children } = props

  return (
    <TouchableOpacity
      style={[styles.root, styles.itemContainer, { ...style }]}
      onPress={onPress}
    >
      <View style={styles.children}>{children}</View>
      {selected && (
        <RoundCheckIcon color={theme.colors.primary} style={styles.leftIcon} />
      )}
    </TouchableOpacity>
  )
})

const useStyles = makeStyles<SelectedItemProps>()(({ normalize, colors }) => ({
  root: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: normalize(15)('horizontal'),
  },
  itemContainer: ({ selected }) => ({
    height: normalize(50)('vertical'),
    backgroundColor: selected ? `${colors.primary}${10}` : colors.background,
    flexDirection: 'row',
    margin: normalize(1)('horizontal'),
    borderRadius: 12,
  }),
  children: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftIcon: {
    position: 'absolute',
    right: 20,
  },
  unLeftIcon: {
    right: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  circle: {
    borderRadius: 20,
    borderColor: colors.primary,
    borderWidth: 1.5,
    height: 18,
    width: 18,
    marginLeft: 20,
    marginVertical: 5,
  },
}))
