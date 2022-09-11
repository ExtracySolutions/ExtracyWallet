import React, { FC } from 'react'

import { Paste, ResetIcon } from '@assets/icons'
import { Text } from '@components'
import { useAppSelector } from '@hooks'
import { makeStyles } from '@themes'
import { TouchableOpacity } from 'react-native'

export enum titleType {
  RESET = 'Reset',
  PASTE = 'Paste',
}
interface IconProps {
  callback: () => void
  title: titleType
}

export const Icon: FC<IconProps> = (props) => {
  const { callback, title } = props
  const themeStore = useAppSelector((state) => state.root.theme.theme)
  const styles = useStyles(props, themeStore)

  return (
    <TouchableOpacity onPress={callback} style={styles.groupReset}>
      {title === titleType.RESET ? <ResetIcon /> : <Paste />}
      <Text fontSize={14} lineHeight={20} style={styles.textReset}>
        {title}
      </Text>
    </TouchableOpacity>
  )
}

const useStyles = makeStyles<IconProps>()(({ normalize, colors }) => ({
  groupReset: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textReset: {
    paddingLeft: normalize(5)('horizontal'),
    color: colors.grey11,
  },
}))
