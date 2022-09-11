import React, { FC, useCallback, useState } from 'react'

import { TextInput, Text, Button } from '@components'
import { useAppSelector } from '@hooks'
import { makeStyles } from '@themes'
import { View, TouchableWithoutFeedback } from 'react-native'

const MINIMUM_PROPOSED = '1'

export type EditPermissionSelectionProps = {
  handleSetSpendLimit: (isCustomValue: boolean, customValue?: string) => void
}

export const EditPermissionSelection: FC<EditPermissionSelectionProps> = (
  props,
) => {
  const themeStore = useAppSelector((state) => state.root.theme.theme)
  const styles = useStyles(props, themeStore)

  const { handleSetSpendLimit } = props

  const [indexSelected, setIndexSelected] = useState<number>(0)
  const [spendLimitCustomValue, setSpendLimitCustomValue] =
    useState<string>(MINIMUM_PROPOSED)

  const handleSelectedOption = useCallback((index: number) => {
    setIndexSelected(index)
  }, [])

  const handleSetLimit = useCallback(() => {
    handleSetSpendLimit(
      indexSelected === 1 ? true : false,
      indexSelected === 1 ? spendLimitCustomValue : undefined,
    )
  }, [handleSetSpendLimit, indexSelected, spendLimitCustomValue])

  return (
    <View style={styles.root}>
      <TouchableWithoutFeedback onPress={() => handleSelectedOption(0)}>
        <View style={styles.itemWrapper}>
          <View style={[styles.border, indexSelected !== 0 && styles.disable]}>
            {indexSelected === 0 ? <View style={styles.circle} /> : null}
          </View>
          <Text style={[styles.text, indexSelected === 0 && styles.textSelect]}>
            Proposed approval limit
          </Text>
        </View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={() => handleSelectedOption(1)}>
        <View style={styles.itemWrapper}>
          <View style={[styles.border, indexSelected !== 1 && styles.disable]}>
            {indexSelected === 1 ? <View style={styles.circle} /> : null}
          </View>
          <Text style={[styles.text, indexSelected === 1 && styles.textSelect]}>
            Custom spend limit
          </Text>
        </View>
      </TouchableWithoutFeedback>
      <TextInput
        placeholder="Enter a max spend limit"
        containerStyle={styles.textInput}
        keyboardType="number-pad"
        value={spendLimitCustomValue}
        onChangeText={setSpendLimitCustomValue}
        editable={indexSelected === 1}
      />
      <Button round text="Set" variant="fulfill" onPress={handleSetLimit} />
    </View>
  )
}

const useStyles = makeStyles<EditPermissionSelectionProps>()(
  ({ normalize, colors, font }) => ({
    root: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
    },
    border: {
      height: normalize(15)('moderate'),
      width: normalize(15)('moderate'),
      borderRadius: 12,
      borderWidth: 2,
      borderColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    circle: {
      height: normalize(8)('moderate'),
      width: normalize(8)('moderate'),
      borderRadius: 6,
      backgroundColor: colors.primary,
    },
    disable: {
      borderColor: colors.disabled,
    },
    text: {
      marginLeft: normalize(5)('moderate'),
      fontSize: font.size.button,
    },
    textSelect: {
      color: colors.primary,
    },
    itemWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: normalize(10)('vertical'),
    },
    textInput: {
      marginTop: normalize(10)('moderate'),
      marginBottom: normalize(40)('moderate'),
    },
  }),
)
