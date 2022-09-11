import React, { useCallback } from 'react'

import { NextIcon } from 'assets'
import { Text } from 'components'
import {
  FlatList,
  FlatListProps,
  ListRenderItem,
  StyleProp,
  TextStyle,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native'
import { makeStyles } from 'themes'

interface ListItemProps {
  title: string
  showSuffix: boolean
  index?: number
  description?: string
  prefix?: React.ReactElement
  suffix?: React.ReactElement
  onPress?: (index?: number) => void
  style?: StyleProp<ViewStyle>
  titleStyle?: StyleProp<TextStyle>
  descriptionStyle?: StyleProp<TextStyle>
  typographyWrapperStyle?: StyleProp<ViewStyle>
  titleWrapperStyle?: StyleProp<ViewStyle>
  descriptionWrapperStyle?: StyleProp<ViewStyle>
  prefixWrapperStyle?: StyleProp<ViewStyle>
  suffixWrapperStyle?: StyleProp<ViewStyle>
}

const ListItem = ({ ...props }: ListItemProps) => {
  const styles = useItemStyles()

  return (
    <TouchableWithoutFeedback
      onPress={() => props.onPress && props.onPress(props.index)}
    >
      <View style={[styles.container, props.style]}>
        {props.prefix && (
          <View style={[styles.prefixWrapper, props.prefixWrapperStyle]}>
            {props.prefix}
          </View>
        )}
        <View style={[styles.typographyWrapper, props.typographyWrapperStyle]}>
          {props.title && (
            <View style={[styles.titleWrapper, props.titleWrapperStyle]}>
              <Text variant="medium" style={[styles.title, props.titleStyle]}>
                {props.title}
              </Text>
            </View>
          )}
          {props.description && (
            <View
              style={[styles.descriptionWrapper, props.descriptionWrapperStyle]}
            >
              <Text style={[styles.description, props.descriptionStyle]}>
                {props.description}
              </Text>
            </View>
          )}
        </View>
        {props.suffix && props.showSuffix && (
          <View style={[styles.suffixWrapper, props.suffixWrapperStyle]}>
            {props.suffix}
          </View>
        )}
        {!props.suffix && props.showSuffix && (
          <View style={[styles.suffixWrapper, props.suffixWrapperStyle]}>
            <NextIcon width={13} height={13} />
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  )
}

interface ListProps<T>
  extends Omit<
    FlatListProps<T>,
    | 'renderItem'
    | 'onEndReached'
    | 'onEndReachedThreshold'
    | 'style'
    | 'contentContainerStyle'
  > {
  enableSeparator: boolean
  pagingEnabled?: boolean
  handleLoadingNextPage?: () => void
  renderItem?: ListRenderItem<T>
  listStyle?: StyleProp<ViewStyle>
  listContentStyle?: StyleProp<ViewStyle>
  containerStyle?: StyleProp<ViewStyle>
}

/**
 *
 * @param {boolean} enableSeparator Whether separator show or not
 * @param {boolean} pagingEnabled Whether using paging or not
 * @param {requestCallback} handleLoadingNextPage Handle rendering next page
 *
 */

const List = <T extends ListItemProps>({ ...props }: ListProps<T>) => {
  const styles = useStyles()

  const renderSeparator = useCallback(() => {
    return <View style={styles.separator} />
  }, [styles.separator])

  return (
    <View style={[styles.container, props.containerStyle]}>
      <FlatList
        {...props}
        ItemSeparatorComponent={
          props.enableSeparator ? renderSeparator : undefined
        }
        onEndReached={
          props.pagingEnabled ? props.handleLoadingNextPage : undefined
        }
        onEndReachedThreshold={props.pagingEnabled ? 0.1 : undefined}
        style={[styles.list, props.listStyle]}
        contentContainerStyle={[
          styles.listContentContainer,
          props.listContentStyle,
        ]}
        renderItem={
          props.renderItem
            ? props.renderItem
            : (data) => {
                return <ListItem {...data.item} index={data.index} />
              }
        }
      />
    </View>
  )
}

const useItemStyles = makeStyles()(({ normalize, font, colors }) => ({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingVertical: normalize(10)('vertical'),
    paddingHorizontal: normalize(10)('horizontal'),
  },
  title: {
    fontSize: font.size.s4,
  },
  titleWrapper: {
    justifyContent: 'center',
  },
  descriptionWrapper: {
    justifyContent: 'center',
    marginTop: normalize(4)('vertical'),
  },
  description: {
    fontSize: font.size.s5,
    color: colors.grey11,
  },
  prefixWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: normalize(2)('horizontal'),
  },
  suffixWrapper: {
    marginLeft: 'auto',
    marginRight: 0,
    minHeight: normalize(30)('horizontal'),
    padding: normalize(5)('moderate'),
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 45,
  },
  typographyWrapper: {
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1,
    paddingLeft: normalize(10)('horizontal'),
  },
}))

const useStyles = makeStyles()(({ normalize, colors }) => ({
  container: {
    borderRadius: normalize(16)('moderate'),
    backgroundColor: colors.transparent,
    padding: normalize(16)('moderate'),
  },
  list: {
    backgroundColor: colors.white,
    borderRadius: normalize(16)('moderate'),
    overflow: 'hidden',
  },
  listContentContainer: {
    backgroundColor: colors.white,
    borderRadius: normalize(16)('moderate'),
    overflow: 'hidden',
  },
  separator: {
    height: normalize(1)('vertical'),
    backgroundColor: colors.grey16,
    marginHorizontal: normalize(12)('horizontal'),
  },
}))

export type { ListProps, ListItemProps }
export { List, ListItem }
