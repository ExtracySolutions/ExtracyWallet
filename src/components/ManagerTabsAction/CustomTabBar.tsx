import React, { FC } from 'react'

import { useAppSelector } from '@hooks'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { makeStyles } from '@themes'
import { Dimensions, Pressable, View } from 'react-native'

import { Text } from '../Text'
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
                lineHeight={20}
                fontSize={16}
                style={isFocused ? styles.txtFocused : styles.txt}
              >
                {label}
              </Text>
              {isFocused && <View style={styles.lineTab} />}
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}

export const useStyles = makeStyles<CustomTabBarProps>()(
  ({ colors, normalize }) => ({
    lineTab: {
      height: 2,
      width: normalize(24)('moderate'),
      backgroundColor: colors.primary50,
      position: 'absolute',
      bottom: 0,
    },
    btnFocused: {
      width: width * 0.47,
      paddingVertical: normalize(10)('vertical'),
      alignItems: 'center',
      justifyContent: 'center',
      height: normalize(40)('vertical'),
      position: 'relative',
    },
    btn: {
      width: width * 0.47,
      paddingVertical: normalize(10)('vertical'),
      paddingTop: normalize(10)('vertical'),
      alignItems: 'center',
      justifyContent: 'center',
      height: normalize(40)('vertical'),
      position: 'relative',
    },
    txtFocused: {
      color: colors.primary,
    },
    txt: {
      color: colors.grey11,
    },
    root: {
      paddingHorizontal: normalize(16)('horizontal'),
      borderTopLeftRadius: normalize(24)('horizontal'),
      backgroundColor: colors.grey16,
      paddingVertical: normalize(12)('vertical'),
      marginBottom: normalize(-1)('moderate'),
    },
    container: {
      flexDirection: 'row',
      backgroundColor: colors.white,
      borderRadius: normalize(16)('moderate'),
      marginTop: normalize(5)('vertical'),
      flexGrow: 1,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: normalize(1)('moderate'),
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: normalize(3)('moderate'),
      zIndex: 100,
    },
  }),
)
