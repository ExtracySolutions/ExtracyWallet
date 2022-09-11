import React, { FC, ReactNode, useCallback } from 'react'

import { NextIcon } from '@assets/icons'
import { useAppSelector } from '@hooks'
import { useNavigation } from '@react-navigation/native'
import { makeStyles } from '@themes'
import { Dimensions, Pressable, StyleProp, View, ViewStyle } from 'react-native'

import { Text } from '../Text'

export const { height, width } = Dimensions.get('screen')
export type ItemArray = {
  iconComponent?: React.ReactElement
  text?: string
  routeName?: string
  balance?: string
  icon?: boolean
  isRed?: boolean
  param?: string
}
export type ItemProps = {
  arrayItem: ItemArray[]
  title?: string
  styleTitle?: StyleProp<ViewStyle>
  icon?: boolean
  rightTitleComponent?: ReactNode
  textStyle?: StyleProp<ViewStyle>
  itemStyle?: StyleProp<ViewStyle>
  onPress?: () => void
  choose?: React.ReactElement
}

export const Item: FC<ItemProps> = (props) => {
  const themeStore = useAppSelector((state) => state.root.theme.theme)
  const styles = useStyles(props, themeStore)

  const {
    title,
    arrayItem,
    styleTitle,
    rightTitleComponent,
    textStyle,
    itemStyle,
    onPress,
    choose,
  } = props
  const navigation = useNavigation()
  const handleNavigation = useCallback(
    (routeName) => {
      navigation.navigate(routeName)
    },
    [navigation],
  )
  const handleNavigationWithParam = useCallback(
    (routeName, param) => {
      routeName === 'WhiteList'
      navigation.navigate(routeName, { routeName: param })
    },
    [navigation],
  )
  const renderItem = ({ item, index }: { item: ItemArray; index: number }) => {
    return (
      <Pressable
        key={index}
        onPress={() =>
          item.routeName
            ? item.param
              ? handleNavigationWithParam(item.routeName, item.param)
              : handleNavigation(item.routeName)
            : onPress && onPress()
        }
      >
        <View
          key={index}
          style={[
            !title
              ? index === 0
                ? styles.itemTextNotTitle
                : styles.itemText
              : styles.itemText,
            itemStyle,
          ]}
        >
          {props.icon}
          <Text
            style={[
              item.isRed ? styles.textDanger : styles.text,
              textStyle,
              item.balance && index === arrayItem.length - 1
                ? styles.balance
                : null,
            ]}
          >
            {item.text}
          </Text>
          <View style={styles.icon}>
            {item.icon && <NextIcon />}
            {choose && choose}
          </View>
          <View style={styles.icon}>
            {item.balance && (
              <Text
                style={index === arrayItem.length - 1 ? styles.balance : null}
              >
                {item.balance}
              </Text>
            )}
          </View>
        </View>
      </Pressable>
    )
  }
  return (
    <View style={styles.groupText}>
      {title && (
        <View style={styles.groupTitle}>
          <Text variant="bold" style={[styles.title, styleTitle]}>
            {title}
          </Text>
          <View style={styles.rightComponent}>
            {rightTitleComponent && rightTitleComponent}
          </View>
        </View>
      )}
      <View style={styles.optionsWrapper}>
        {arrayItem.map((item, index) => {
          return renderItem({ item, index })
        })}
      </View>
    </View>
  )
}

const useStyles = makeStyles<ItemProps>()(({ normalize, colors, font }) => ({
  optionsWrapper: {
    borderRadius: normalize(16)('moderate'),
    backgroundColor: colors.white,
    marginHorizontal: normalize(16)('horizontal'),
  },
  groupText: {
    width: width,
    justifyContent: 'space-between',
    backgroundColor: colors.transparent,
  },
  title: {
    fontSize: font.size.h6,
    color: colors.primary40,
    backgroundColor: colors.transparent,
    fontWeight: '700',
  },
  groupTitle: {
    alignItems: 'center',
    width: width * 0.9,
    flexDirection: 'row',
    marginVertical: normalize(10)('vertical'),
  },
  rightComponent: {
    flex: 1,
    alignItems: 'flex-end',
  },
  icon: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  itemText: {
    width: width,
    borderTopWidth: 1,
    borderColor: colors.grey16,
    flexDirection: 'row',
  },
  itemTextNotTitle: {
    width: width,
  },
  text: {
    width: '100%',
    paddingVertical: normalize(10)('vertical'),
    fontSize: font.size.s3,
    flex: 9,
  },
  textDanger: {
    width: '100%',
    paddingVertical: normalize(10)('vertical'),
    fontSize: font.size.s3,
    fontWeight: 'bold',
    color: colors.alert,
  },
  balance: {
    color: colors.primary,
    fontWeight: 'bold',
  },
}))
