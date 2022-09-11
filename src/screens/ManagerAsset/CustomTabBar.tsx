import React, { FC } from 'react'

import { Text } from '@components'
import { useAppSelector } from '@hooks'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { makeStyles } from '@themes'
import { Dimensions, Pressable, View } from 'react-native'

export const { width } = Dimensions.get('screen')
export type CustomTabBarProps = BottomTabBarProps & {}

export const CustomTabBar: FC<CustomTabBarProps> = (props) => {
  const themeStore = useAppSelector((state) => state.root.theme.theme)
  const styles = useStyles(props, themeStore)
  const { state, descriptors, navigation } = props

  return (
    <View style={styles.root}>
      <View style={styles.container}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key]
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name

          const isFocused = state.index === index

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            })

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name)
            }
          }

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            })
          }

          return (
            <Pressable
              key={index}
              accessibilityRole="button"
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={isFocused ? styles.btnFocused : styles.btn}
            >
              <Text
                variant="medium"
                style={isFocused ? styles.txtFocused : styles.txt}
              >
                {label}
              </Text>
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}

export const useStyles = makeStyles<CustomTabBarProps>()(
  ({ colors, normalize, font }) => ({
    btnFocused: {
      width: width * 0.5,
      height: normalize(40)('vertical'),
      alignItems: 'center',
      justifyContent: 'center',
      borderBottomWidth: normalize(3)('moderate'),
      borderColor: colors.primary50,
    },
    btn: {
      width: width * 0.5,
      height: normalize(40)('vertical'),
      alignItems: 'center',
      justifyContent: 'center',
      borderBottomWidth: 3,
      borderColor: colors.grey16,
    },
    txtFocused: {
      color: colors.primary,
      fontSize: font.size.s3,
    },
    txt: {
      color: colors.grey11,
      fontSize: font.size.s3,
    },
    root: {
      paddingHorizontal: normalize(16)('horizontal'),
      borderTopLeftRadius: normalize(24)('horizontal'),
      backgroundColor: colors.grey16,
    },
    container: {
      flexDirection: 'row',
      backgroundColor: colors.white,
      borderRadius: normalize(16)('moderate'),
      marginTop: normalize(5)('vertical'),
    },
  }),
)
