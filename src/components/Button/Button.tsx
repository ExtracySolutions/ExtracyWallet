import React, { FC } from 'react'

import { Text } from '@components'
import { useAppSelector } from '@hooks'
import { makeStyles, useTheme } from '@themes'
import {
  ImageRequireSource,
  ImageURISource as RNImageURISource,
  TouchableOpacityProps as RNTouchableOpacityProps,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native'
import { BallIndicator } from 'react-native-indicators'

export type ImageURISource = {
  /**
   * `uri` is a string representing the resource identifier for the image, which
   * could be an http address, a local file path, or the name of a static image
   * resource (which should be wrapped in the `require('./path/to/image.png')`
   * function).
   */
  uri?: string | null | undefined
} & Omit<RNImageURISource, 'uri'>

export type ImageSourcePropType =
  | ImageURISource
  | ImageURISource[]
  | ImageRequireSource

export type ButtonProps = {
  round?: boolean
  loading?: boolean
  variant?: 'none' | 'fulfill' | 'delete' | 'normal'
  disabled?: boolean
  leftComponent?: React.ReactNode
  icon?: ImageSourcePropType
  text: string
  textStyle?: TextStyle
  fontWeight?: 'bold' | 'medium' | 'regular'
  containerStyle?: ViewStyle & TextStyle
} & Omit<RNTouchableOpacityProps, 'style'>

export const Button: FC<ButtonProps> = (props) => {
  const themeStore = useAppSelector((state) => state.root.theme.theme)
  const styles = useStyles(props, themeStore)
  const theme = useTheme(themeStore)

  const {
    text,
    leftComponent,
    icon,
    textStyle,
    containerStyle,
    disabled,
    loading,
    onPress,
    variant,
  } = props

  const checkVariant = () => {
    if (disabled) {
      return {
        backgroundColor: theme.colors.grey13,
        color: theme.colors.grey11,
      }
    }
    switch (variant) {
      case 'none':
        return {
          backgroundColor: theme.colors.transparent,
          color: theme.colors.primary50,
        }
      case 'delete':
        return {
          backgroundColor: theme.colors.alert,
          color: theme.colors.white,
        }
      case 'normal':
        return {
          backgroundColor: theme.colors.grey14,
          color: theme.colors.black,
        }
      default:
        return {
          backgroundColor: theme.colors.primary,
          color: theme.colors.white,
        }
    }
  }

  const { backgroundColor, color } = checkVariant()

  return (
    <TouchableOpacity
      onPress={!loading ? onPress : () => {}}
      disabled={disabled}
      style={[
        styles.root,
        styles.container,
        containerStyle,
        { backgroundColor },
      ]}
    >
      {icon ? icon : leftComponent}
      {loading ? (
        <BallIndicator
          size={theme.normalize(20)('moderate')}
          color={theme.colors.white}
        />
      ) : (
        <Text
          style={[{ color }, textStyle]}
          fontSize={14}
          lineHeight={16}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {text}
        </Text>
      )}
    </TouchableOpacity>
  )
}

const useStyles = makeStyles<ButtonProps>()(({ normalize }) => ({
  root: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: normalize(14)('vertical'),
    marginVertical: normalize(3)('vertical'),
    marginBottom: normalize(13)('vertical'),
  },
  container: {
    borderRadius: normalize(8)('moderate'),
  },
}))
