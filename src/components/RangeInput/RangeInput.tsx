import React, { FC, useCallback } from 'react'

import { Text } from '@components'
import { useAppSelector } from '@hooks'
import { makeStyles, useTheme } from '@themes'
import { BigNumber } from 'bignumber.js'
import { View, TextInput, TouchableOpacity } from 'react-native'

export type RangeInputProps = {
  name: string
  label: string
  value: string
  increment?: any
  min: BigNumber
  error?: any
  isDisabledPlus?: boolean
  isDisabledSub?: boolean
  onChangeValue?: (value: string) => void
}

export const RangeInput: FC<RangeInputProps> = (props) => {
  const themeStore = useAppSelector((state) => state.root.theme.theme)
  const styles = useStyles(props, themeStore)
  const { colors } = useTheme(themeStore)
  const {
    label,
    error,
    increment,
    min,
    onChangeValue,
    value,
    isDisabledPlus,
    isDisabledSub,
  } = props

  const increaseNumber = useCallback(() => {
    const newValue = new BigNumber(value).plus(new BigNumber(increment))
    onChangeValue?.(newValue.toString())
  }, [increment, onChangeValue, value])

  const decreaseNumber = useCallback(() => {
    if (new BigNumber(value).isLessThanOrEqualTo(new BigNumber(min))) {
      onChangeValue?.(min.toString())
    } else {
      const newValue = new BigNumber(value).minus(new BigNumber(increment))
      onChangeValue?.(newValue.toString())
    }
  }, [increment, min, onChangeValue, value])

  return (
    <View style={styles.root}>
      <Text
        style={styles.label}
        fontSize={14}
        lineHeight={16}
        color={colors.grey4}
      >
        {`${label} :`}
      </Text>
      <View style={styles.inputWrapper}>
        <TouchableOpacity
          style={[
            styles.rangeButton,
            styles.borderLeft,
            isDisabledSub && styles.disabled,
          ]}
          disabled={isDisabledSub}
          onPress={decreaseNumber}
        >
          <Text
            color={isDisabledSub ? colors.grey11 : colors.white}
            fontSize={27}
            textAlign="center"
            lineHeight={30}
          >
            -
          </Text>
        </TouchableOpacity>
        <TextInput editable={false} style={styles.input} value={value} />
        <TouchableOpacity
          style={[
            styles.rangeButton,
            styles.borderRight,
            isDisabledPlus && styles.disabled,
          ]}
          onPress={increaseNumber}
          disabled={isDisabledPlus}
        >
          <Text
            color={isDisabledPlus ? colors.grey11 : colors.white}
            fontSize={27}
            textAlign="center"
            lineHeight={30}
          >
            +
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.errorText} color={colors.loss} fontSize={14}>
        {error}
      </Text>
    </View>
  )
}

const useStyles = makeStyles<RangeInputProps>()(({ normalize, colors }) => ({
  root: {
    flexDirection: 'column',
  },
  inputWrapper: {
    flexDirection: 'row',
  },
  input: {
    flex: 1,
    height: normalize(47)('moderate'),
    flexDirection: 'row',
    borderColor: colors.grey12,
    borderWidth: 1,
    textAlign: 'center',
  },
  rangeButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: normalize(48)('moderate'),
    width: normalize(48)('moderate'),
    backgroundColor: colors.primary50,
  },

  borderRight: {
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  borderLeft: {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  label: {
    paddingBottom: normalize(5)('vertical'),
  },
  errorText: {
    marginVertical: normalize(3)('vertical'),
  },
  disabled: {
    backgroundColor: colors.grey12,
  },
}))
