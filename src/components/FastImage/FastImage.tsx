import React, { FC, memo } from 'react'

import { useAppSelector } from '@hooks'
import { makeStyles } from '@themes'
import RNFastImage, {
  FastImageProps as RNFastImageProps,
  Priority,
} from 'react-native-fast-image'

type Cache = 'immutable' | 'web' | 'cacheOnly'

export declare type FastImageSource =
  | {
      uri?: string | null
      headers?: {
        [key: string]: string
      }
      priority?: Priority
      cache?: Cache
    }
  | number

export type FastImageProps = Omit<RNFastImageProps, 'source'> & {
  source?: FastImageSource
}

export const FastImage: FC<FastImageProps> = memo((props) => {
  const themeStore = useAppSelector((state) => state.root.theme.theme)
  const styles = useStyles(props, themeStore)
  const { style } = props

  return (
    <RNFastImage
      {...props}
      source={
        typeof props.source === 'number'
          ? props.source
          : {
              ...(props.source as any),
              priority: 'high',
              cache: RNFastImage.cacheControl.immutable,
            }
      }
      style={[styles.image, style]}
    />
  )
})

const useStyles = makeStyles<FastImageProps>()(({ normalize }) => ({
  image: {
    height: normalize(10)('moderate'),
    width: normalize(10)('moderate'),
  },
}))
