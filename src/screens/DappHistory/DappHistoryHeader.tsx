import React, { FC } from 'react'

import { strings } from 'I18n'
import { Text, View } from 'react-native'
import { makeStyles } from 'themes'

interface DappHistoryHeaderProps {
  date: Date
}

export const DappHistoryHeader: FC<DappHistoryHeaderProps> = (props) => {
  const styles = useStyles()
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {props.date.toDateString() === new Date().toDateString()
          ? strings('datetime.today')
          : props.date.getStringByFormat('dd/MM/yyyy')}
      </Text>
    </View>
  )
}

const useStyles = makeStyles<DappHistoryHeaderProps>()(
  ({ normalize, font, colors }) => ({
    container: {
      justifyContent: 'flex-start',
      alignItems: 'flex-end',
      flexDirection: 'row',
      paddingVertical: normalize(15)('vertical'),
      paddingHorizontal: normalize(32)('horizontal'),
      backgroundColor: colors.grey16,
    },
    text: {
      fontSize: font.size.s3,
      fontWeight: '500',
      color: colors.grey10,
    },
  }),
)
