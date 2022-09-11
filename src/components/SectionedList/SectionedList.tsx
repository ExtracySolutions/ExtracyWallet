import React from 'react'

import { makeStyles } from '@themes'
import { isEmpty } from 'lodash'
import { SectionList, SectionListProps, Text, View } from 'react-native'

export interface SectionedListItem {
  title: string
  data: any[]
}

export interface SectionedListProps<T> extends SectionListProps<T> {
  enableSeparator: boolean
  data: SectionedListItem[]
}

export const SectionedList = ({
  ...props
}: Omit<SectionedListProps<any>, 'sections'>) => {
  const styles = useStyles()

  const renderTitle = (title: string) => {
    if (!isEmpty(title)) {
      return <Text style={styles.sectionTitle}>{title}</Text>
    }
    return <View style={styles.emptyTitle} />
  }

  return (
    <SectionList
      {...props}
      showsVerticalScrollIndicator={false}
      sections={props.data}
      renderSectionHeader={
        !props.renderSectionHeader
          ? ({ section: { title } }) => renderTitle(title)
          : undefined
      }
      renderItem={(item) => {
        if (item.section.data.length === 1) {
          return (
            <View style={styles.singleItem}>
              {props.renderItem && props.renderItem(item)}
            </View>
          )
        } else if (item.section.data.length > 1) {
          if (item.index === item.section.data.length - 1) {
            return (
              <View style={styles.lastItem}>
                {props.renderItem && props.renderItem(item)}
              </View>
            )
          } else if (item.index === 0) {
            return (
              <View style={styles.firstItem}>
                {props.renderItem && props.renderItem(item)}
              </View>
            )
          } else {
            return (
              <View style={styles.normalItem}>
                {props.renderItem && props.renderItem(item)}
              </View>
            )
          }
        }

        return <></>
      }}
      contentContainerStyle={[styles.container, props.style]}
    />
  )
}

const useStyles = makeStyles()(({ normalize, colors, font }) => ({
  container: {
    backgroundColor: colors.transparent,
  },
  separator: {
    height: normalize(1)('vertical'),
    marginHorizontal: normalize(12)('horizontal'),
    backgroundColor: colors.grey16,
  },
  sectionContainer: {
    borderRadius: normalize(16)('moderate'),
  },
  sectionTitle: {
    backgroundColor: colors.grey16,
    color: colors.primary40,
    fontSize: font.size.s3,
    paddingVertical: normalize(15)('vertical'),
    paddingLeft: normalize(10)('horizontal'),
  },
  singleItem: {
    borderRadius: normalize(16)('moderate'),
    backgroundColor: colors.white,
  },
  normalItem: {
    backgroundColor: colors.white,
  },
  firstItem: {
    borderTopLeftRadius: normalize(16)('moderate'),
    borderTopRightRadius: normalize(16)('moderate'),
    backgroundColor: colors.white,
  },
  lastItem: {
    borderBottomLeftRadius: normalize(16)('moderate'),
    borderBottomRightRadius: normalize(16)('moderate'),
    backgroundColor: colors.white,
  },
  emptyTitle: {
    backgroundColor: colors.grey16,
    height: normalize(15)('vertical'),
  },
}))
