import React, { FC, useCallback, useEffect } from 'react'

import { useAppSelector } from '@hooks'
import { makeStyles, useTheme } from '@themes'
import { Pressable, View, ViewStyle } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated'

export type SwitchProps = {
  disabled?: boolean
  handleTurnOn?: () => void
  handleTurnOff?: () => void
  isOpen?: boolean
  onPress?: () => void
  isSwitch?: boolean
  delay?: number
  btnContainerStyle?: ViewStyle
}

const timingConfig = {
  duration: 100,
}

export const Switch: FC<SwitchProps> = (props) => {
  const { handleTurnOn, handleTurnOff, onPress, isSwitch, btnContainerStyle } =
    props
  const themeStore = useAppSelector((state) => state.root.theme.theme)
  const theme = useTheme(themeStore)
  const styles = useStyles(props, themeStore)

  const isRemoving = useSharedValue(isSwitch)

  const handleInitSwitch = useCallback(() => {
    isRemoving.value = isSwitch
  }, [isRemoving, isSwitch])

  useEffect(() => {
    runOnJS(() => {
      'worklet'
      handleInitSwitch()
    })()
  }, [handleInitSwitch, isRemoving, isSwitch])

  const style = useAnimatedStyle(() => {
    if (isRemoving.value || isSwitch) {
      return {
        transform: [
          {
            translateX: withTiming(17, timingConfig),
          },
        ],
      }
    }

    return {
      transform: [
        {
          translateX: withTiming(-2, timingConfig),
        },
      ],
    }
  })
  const styleBackground = useAnimatedStyle(() => {
    if (isRemoving.value) {
      return {
        backgroundColor: withTiming(theme.colors.primary, timingConfig),
        borderRadius: 80,
      }
    }

    return {
      backgroundColor: withTiming(theme.colors.grey10, timingConfig),
      borderRadius: 80,
    }
  })

  const handleSwitch = useCallback(async () => {
    isRemoving.value = !isRemoving.value
    isRemoving.value === true
      ? [handleTurnOff && handleTurnOff()]
      : [handleTurnOn && handleTurnOn()]
  }, [handleTurnOff, handleTurnOn, isRemoving])

  return (
    <Pressable
      onPress={async () => {
        if (props.delay) {
          await setTimeout(() => {
            handleSwitch()
            onPress && onPress()
          }, props.delay)
        } else {
          handleSwitch()
          onPress && onPress()
        }
      }}
      disabled={props.disabled}
      style={styles.view}
    >
      {props.disabled && (
        <View style={[styles.disabledButtonWrapper, btnContainerStyle]}>
          <View style={styles.background}>
            <View style={styles.tennisBall} />
          </View>
        </View>
      )}
      {!props.disabled && (
        <Animated.View
          style={[styles.btnContainer, btnContainerStyle, styleBackground]}
        >
          <View style={styles.background}>
            <Animated.View style={[styles.tennisBall, style]} />
          </View>
        </Animated.View>
      )}
    </Pressable>
  )
}

const useStyles = makeStyles<SwitchProps>()(({ normalize, colors }) => ({
  tennisBall: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: normalize(100)('moderate'),
    width: normalize(13)('moderate'),
    height: normalize(13)('moderate'),
  },
  button: {
    borderRadius: normalize(100)('moderate'),
    width: normalize(14)('horizontal'),
    height: normalize(20)('moderate'),
  },
  btnContainer: {
    width: normalize(36)('horizontal'),
  },
  background: {
    justifyContent: 'center',
    borderRadius: normalize(80)('moderate'),
    paddingHorizontal: normalize(6)('moderate'),
    paddingVertical: normalize(4)('moderate'),
  },
  view: {
    padding: normalize(5)('moderate'),
  },
  disabledButtonWrapper: {
    width: normalize(36)('horizontal'),
    backgroundColor: colors.grey13,
    borderRadius: normalize(50)('moderate'),
  },
}))
