import React, { FC, useCallback, useMemo, useRef, useState } from 'react'

import { EyeClose, EyeVisble } from '@assets/icons'
import { Text } from '@components'
import { useAppSelector } from '@hooks'
import { makeStyles, useTheme } from '@themes'
import {
  View,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  ViewStyle,
  Pressable,
  TouchableOpacity,
  Dimensions,
} from 'react-native'

export type TextInputProps = {
  rightIcon?: React.ReactNode
  leftIcon?: React.ReactNode
  rightIconPress?: React.ReactElement
  containerStyle?: ViewStyle
  inputStyle?: ViewStyle
  labelStyle?: ViewStyle
  labelText?: string
  height?: number
  onBlurInput?: any
  isSecure?: boolean
  suffixItem?: React.ReactNode
  biometryEnabled?: boolean
  onFocusInput?: () => void
  radius?: number
} & RNTextInputProps

const { width: SCREEN_WIDTH } = Dimensions.get('screen')

export const TextInput: FC<TextInputProps> = (props) => {
  const themeStore = useAppSelector((state) => state.root.theme.theme)
  const styles = useStyles(props, themeStore)
  const theme = useTheme(themeStore)

  const {
    placeholder,
    rightIcon,
    leftIcon,
    containerStyle,
    labelText,
    onBlurInput,
    isSecure,
    onFocusInput,
    inputStyle,
    labelStyle,
    secureTextEntry,
    biometryEnabled,
  } = props

  const [isInput, setInput] = useState(true)
  const inputTextRef = useRef<RNTextInput>(null)
  const [secureEye, setSecureEye] = useState(!secureTextEntry)

  const handleFocusInputText = useCallback(() => {
    inputTextRef ? inputTextRef?.current?.focus() : null
  }, [])

  const handleSecureEye = useCallback(() => {
    setSecureEye(!secureEye)
  }, [secureEye])

  const _renderSecureIcon = () => {
    return (
      <TouchableOpacity
        style={[styles.rightIconStyle]}
        hitSlop={{ left: 5, right: 5, bottom: 5, top: 5 }}
        onPress={handleSecureEye}
      >
        {secureEye ? <EyeClose /> : <EyeVisble />}
      </TouchableOpacity>
    )
  }

  const handleCustomFocus = useCallback(() => {
    setInput(false)
    onFocusInput ? onFocusInput() : null
  }, [onFocusInput])

  const handleCustomBlur = useCallback(() => {
    setInput(true)
    onBlurInput ? onBlurInput() : null
  }, [onBlurInput])

  const color = useMemo(() => {
    if (isInput) {
      return {
        textColor: theme.colors.grey10,
        borderColor: theme.colors.grey12,
      }
    }
    return {
      textColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    }
  }, [isInput, theme])

  return (
    <Pressable onPress={handleFocusInputText}>
      <View
        style={[
          styles.root,
          { borderColor: color.borderColor },
          { ...containerStyle },
        ]}
      >
        {labelText ? (
          <View style={styles.label}>
            <Text
              variant="bold"
              lineHeight={14}
              fontSize={12}
              style={[
                { color: color.textColor },
                styles.labelStyle,
                labelStyle,
              ]}
            >
              {labelText}
            </Text>
          </View>
        ) : null}
        <View style={styles.wrapperContent}>
          <View style={[styles.group, inputStyle]}>
            {leftIcon ? (
              <View style={[styles.leftIconStyle]}>{leftIcon}</View>
            ) : null}
            <View style={[styles.inputBox]}>
              <RNTextInput
                ref={inputTextRef}
                allowFontScaling
                keyboardType="ascii-capable"
                placeholderTextColor={theme.colors.grey12}
                style={[
                  styles.input,
                  biometryEnabled || !isSecure || props.suffixItem
                    ? styles.pr10
                    : null,
                ]}
                onFocus={handleCustomFocus}
                onBlur={handleCustomBlur}
                placeholder={placeholder}
                {...props}
              />
            </View>
            {rightIcon || isSecure ? (
              <View style={[styles.rightIconStyle]}>
                {secureTextEntry ? _renderSecureIcon() : rightIcon}
              </View>
            ) : null}
          </View>
        </View>
        {props.suffixItem && (
          <View style={styles.suffixItemWrapper}>{props.suffixItem}</View>
        )}
      </View>
    </Pressable>
  )
}

const useStyles = makeStyles<TextInputProps>()(({ normalize, colors }) => ({
  root: ({ height, radius }) => ({
    position: 'relative',
    maxHeight: height
      ? normalize(height)('vertical')
      : normalize(50)('horizontal'),
    height: height ? height : normalize(50)('vertical'),
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: normalize(radius || 10)('moderate'),
    backgroundColor: colors.white,
  }),
  label: {
    position: 'absolute',
    top: -15,
    backgroundColor: 'white',
    left: 5,
  },
  input: {
    flex: 1,
    flexDirection: 'row',
  },
  inputBox: {
    flex: 8,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    marginLeft: normalize(10)('moderate'),
  },
  group: {
    flex: 1,
    width: SCREEN_WIDTH * 0.88,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  labelStyle: {
    backgroundColor: colors.transparent,
    marginTop: normalize(5)('vertical'),
    marginHorizontal: normalize(5)('horizontal'),
  },
  rightIconStyle: {
    alignItems: 'center',
    flexDirection: 'row',
    zIndex: 100,
  },
  leftIconStyle: {
    flexGrow: 0.005,
    flexShrink: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    zIndex: -100,
    marginLeft: normalize(10)('horizontal'),
  },
  wrapperContent: {
    flexDirection: 'column',
    zIndex: 0,
  },
  suffixItemWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    marginLeft: 'auto',
    flexDirection: 'row',
  },
  pr10: {
    paddingRight: normalize(10)('horizontal'),
  },
}))
