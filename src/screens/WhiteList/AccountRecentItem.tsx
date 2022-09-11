import React, { FC } from 'react'

import { Text } from '@components'
import { makeStyles } from '@themes'
import { View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Jazzicon from 'react-native-jazzicon'

export type AccountItemRecentProps = {
  index: number
  accountAddressItem?: string
  accountNameItem?: string
  accountAddressList?: string
  address?: string
  handleEdit?: () => void
  isEdit?: boolean
  handleTouchItem?: () => void
}
export const AccountRecentItem: FC<AccountItemRecentProps> = (props) => {
  const styles = useStyles(props)
  const {
    accountNameItem,
    index,
    address,
    handleEdit,
    isEdit,
    handleTouchItem,
  } = props

  return (
    <TouchableOpacity
      style={styles.accountItem}
      onPress={isEdit ? handleEdit : handleTouchItem}
    >
      <Jazzicon size={33} seed={index} containerStyle={styles.jazzicon} />
      <View style={styles.titleWrapper}>
        <Text style={styles.nameTitle} fontSize={16} lineHeight={20}>
          {accountNameItem}
        </Text>
        <Text
          numberOfLines={1}
          style={styles.subTitle}
          fontSize={14}
          lineHeight={16}
        >
          {address}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

const useStyles = makeStyles<AccountItemRecentProps>()(
  ({ normalize, colors }) => ({
    accountItem: {
      flexDirection: 'row',
      padding: normalize(12)('moderate'),
      margin: normalize(16)('moderate'),
      borderRadius: normalize(16)('moderate'),
      backgroundColor: colors.white,
    },
    jazzicon: {
      marginRight: normalize(10)('horizontal'),
    },
    titleWrapper: {
      flex: 1,
    },
    nameTitle: {
      color: colors.grey4,
    },
    subTitle: {
      letterSpacing: 0.1,
      color: colors.grey11,
      maxWidth: '95%',
    },
  }),
)
