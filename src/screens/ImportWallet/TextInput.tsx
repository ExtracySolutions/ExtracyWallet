import React, { FC, useCallback, useMemo, useRef, useState } from 'react'

import { Text } from '@components'
import { useAppSelector } from '@hooks'
import { makeStyles, useTheme } from '@themes'
import {
  Pressable,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  View,
} from 'react-native'

import { Icon, titleType } from './Icon'

export type TextInputProps = {
  labelText: string
  onFocusInput: () => void
  handReset: () => void
  handPaste: () => void
} & RNTextInputProps

export const TextInput: FC<TextInputProps> = (props) => {
  const themeStore = useAppSelector((state) => state.root.theme.theme)
  const styles = useStyles(props, themeStore)
  const theme = useTheme(themeStore)
  const inputTextRef = useRef<RNTextInput>(null)
  const [isInput, setInput] = useState(true)

  const { placeholder, labelText, onFocusInput, handPaste, handReset } = props

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

  const handleCustomFocus = useCallback(() => {
    inputTextRef?.current?.focus()
    setInput(false)
    onFocusInput()
  }, [onFocusInput])

  const handleCustomBlur = useCallback(() => {
    setInput(true)
  }, [])

  return (
    <Pressable
      onPress={handleCustomFocus}
      style={[styles.container, { borderColor: color.borderColor }]}
    >
      <View style={styles.label}>
        <Text
          variant="bold"
          lineHeight={14}
          fontSize={12}
          style={{ color: color.textColor }}
        >
          {labelText}
        </Text>
      </View>
      <RNTextInput
        {...props}
        style={styles.containerTextInput}
        ref={inputTextRef}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.grey12}
        onFocus={handleCustomFocus}
        onBlur={handleCustomBlur}
      />
      <View style={styles.icon}>
        <Icon callback={handReset} title={titleType.RESET} />
        <Icon callback={handPaste} title={titleType.PASTE} />
      </View>
    </Pressable>
  )
}

const useStyles = makeStyles<TextInputProps>()(({ normalize, colors }) => ({
  container: {
    height: normalize(140)('moderate'),
    borderWidth: 1,
    borderRadius: normalize(8)('moderate'),
  },
  containerTextInput: {
    paddingHorizontal: normalize(12)('horizontal'),
    paddingTop: normalize(10)('vertical'),
    paddingBottom: normalize(-10)('vertical'),
    flex: 3,
  },
  icon: {
    flex: 0.7,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: normalize(12)('horizontal'),
    paddingVertical: normalize(8)('vertical'),
  },
  label: {
    position: 'absolute',
    top: -10,
    backgroundColor: colors.white,
    left: 5,
    paddingHorizontal: normalize(4)('horizontal'),
    paddingBottom: normalize(4)('vertical'),
    zIndex: 1,
  },
}))
