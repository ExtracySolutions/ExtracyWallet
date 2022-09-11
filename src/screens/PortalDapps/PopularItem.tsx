import React, { FC, useCallback } from 'react'

import { FastImage, Text } from '@components'
import { makeStyles } from '@themes'
import { useNavigation } from 'navigation'
import { View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

export type PopularItemProps = {
  title?: string
  URL?: string
  image?: string
  description?: string
  isLast?: boolean
}
export const PopularItem: FC<PopularItemProps> = (props) => {
  const styles = useStyles(props)
  const { image, title, description } = props
  const navigation = useNavigation()

  const handleNavigateToBrowserTabs = useCallback(() => {
    navigation.navigate('Browser')
  }, [navigation])

  return (
    <View style={styles.accountWrapper}>
      <TouchableOpacity
        style={styles.accountItem}
        onPress={handleNavigateToBrowserTabs}
      >
        <View style={styles.background}>
          <FastImage
            style={styles.image}
            source={{
              uri: image,
            }}
          />
        </View>
        <View style={styles.titleWrapper}>
          <Text variant="medium" style={styles.nameTitle}>
            {title}
          </Text>
          <Text style={styles.subTitle}>{description}</Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}

const useStyles = makeStyles<PopularItemProps>()(
  ({ font, normalize, colors }) => ({
    accountItem: {
      flexDirection: 'row',
      flex: 1,
    },
    image: {
      height: normalize(32)('moderate'),
      width: normalize(32)('moderate'),
    },
    accountWrapper: ({ isLast }) => ({
      marginHorizontal: normalize(22)('moderate'),
      borderBottomColor: colors.separator,
      borderBottomWidth: isLast ? 0 : 1,
      width: normalize(150)('vertical'),
      paddingVertical: normalize(10)('vertical'),
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
    }),
    titleWrapper: {
      marginLeft: normalize(10)('horizontal'),
      flexDirection: 'column',

      justifyContent: 'center',
    },
    nameTitle: {
      fontSize: font.size.button,
    },
    subTitle: {
      letterSpacing: 0.1,
      fontSize: font.size.caption2,
      color: colors.disabled,
      marginTop: normalize(5)('moderate'),
    },
    background: {
      backgroundColor: colors.backgroundIcon,
      height: normalize(52)('moderate'),
      width: normalize(52)('moderate'),
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: normalize(8)('moderate'),
    },
  }),
)
