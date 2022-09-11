import React, { FC } from 'react'

import { Text } from '@components'
import { useAppSelector } from '@hooks'
import Checkbox from '@react-native-community/checkbox'
import { makeStyles, useTheme } from '@themes'
import { Pressable, View, ViewStyle } from 'react-native'
export type CheckboxProps = {
  backgroundBox?: string
  rightComponent?: React.ReactNode
  text?: string
  isCheck: boolean
  containStyle?: ViewStyle
  checkboxStyle?: ViewStyle
  handleToggleCheckBox: () => void
}

export const CheckboxComponent: FC<CheckboxProps> = (props) => {
  const themeStore = useAppSelector((state) => state.root.theme.theme)
  const styles = useStyles(props, themeStore)
  const theme = useTheme(themeStore)

  const {
    handleToggleCheckBox,
    backgroundBox,
    isCheck,
    text,
    containStyle,
    checkboxStyle,
    rightComponent,
  } = props
  return (
    <Pressable
      style={containStyle && containStyle}
      onPress={handleToggleCheckBox}
    >
      <View style={rightComponent || text ? styles.wrapperCheckBox : null}>
        <Checkbox
          disabled={true}
          value={isCheck}
          boxType={'square'}
          style={checkboxStyle ? checkboxStyle : styles.checkbox}
          tintColors={{
            true: backgroundBox,
            false: theme.colors.grey10,
          }}
          onCheckColor={theme.colors.white}
          onFillColor={backgroundBox}
          onTintColor={backgroundBox}
        />
        {rightComponent ||
          (text && (
            <View style={styles.note}>
              {rightComponent ? (
                rightComponent
              ) : (
                <Text
                  style={styles.normalText}
                  fontSize={14}
                  lineHeight={20}
                  variant="light"
                >
                  {text}
                </Text>
              )}
            </View>
          ))}
      </View>
    </Pressable>
  )
}

const useStyles = makeStyles<CheckboxProps>()(({ normalize }) => ({
  container: {
    flex: 0.2,
    justifyContent: 'flex-end',
    paddingBottom: normalize(30)('vertical'),
    paddingHorizontal: normalize(15)('horizontal'),
  },
  wrapperCheckBox: {
    flex: 0.5,
    flexDirection: 'row',
  },
  checkbox: {
    marginTop: normalize(3)('vertical'),
    width: 20,
    height: 20,
    padding: 5,
  },
  note: {
    flex: 1,
    height: 200,
    marginStart: normalize(5)('horizontal'),
    marginEnd: normalize(5)('horizontal'),
  },
  normalText: {
    flex: 1,
    marginLeft: normalize(5)('horizontal'),
    justifyContent: 'center',
  },
}))
