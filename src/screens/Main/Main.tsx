import React, { FC } from 'react'

import { ManagerTabsAction, Container } from '@components'
import { useAppSelector } from '@hooks'
import { colors, makeStyles } from '@themes'
import { View, Dimensions } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated'

import { Activity } from '../Activity'
import { Token } from '../Token'
import { HeaderInfoAccount } from './HeaderInfoAccount'

export const { width } = Dimensions.get('screen')

export type MainProps = {}

type Tab = {
  name: string
  label: string
  component: React.ComponentType
}

const HEIGHT_MOVE_TOP = -90

export const Main: FC<MainProps> = (props) => {
  const themeStore = useAppSelector((state) => state.root.theme.theme)
  const styles = useStyles(props, themeStore)

  const timingConfig = {
    duration: 500,
  }

  const isMoving = useSharedValue(false) // False when move bottom, True when move top

  const setIsMoving = (_isMoving: boolean) => {
    isMoving.value = _isMoving
  }

  const styleHeader = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(
            isMoving.value ? HEIGHT_MOVE_TOP : 0,
            timingConfig,
          ),
        },
      ],
    }
  })

  const avatarHeader = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withTiming(
            isMoving.value ? -width / 2.4 : 0,
            timingConfig,
          ),
        },
        {
          translateY: withTiming(isMoving.value ? 80 : 0, timingConfig),
        },
        {
          scale: withTiming(isMoving.value ? 0.5 : 1, timingConfig),
        },
      ],
    }
  })

  const boxIconFilter = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(isMoving.value ? 85 : 0, timingConfig),
        },
      ],
    }
  })

  const nameAccount = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isMoving.value ? 0 : 1, timingConfig),
      transform: [
        {
          scale: withTiming(isMoving.value ? 0.5 : 1, timingConfig),
        },
      ],
    }
  })

  const TabArr: Tab[] = [
    {
      name: 'token',
      label: 'Tokens',
      component: Token,
    },
    {
      name: 'activity',
      label: 'Activity',
      component: Activity,
    },
  ]
  return (
    <Container
      statusColor={colors.light.primary50}
      edges={['right', 'left']}
      style={styles.root}
    >
      <Animated.View style={[styles.containerHeader, styleHeader]}>
        <HeaderInfoAccount
          avatarHeader={avatarHeader}
          nameAccount={nameAccount}
          boxIconFilter={boxIconFilter}
        />

        <View style={styles.containerTabView}>
          <View style={styles.boxLeft} />
          <ManagerTabsAction
            TabArr={TabArr}
            setIsMoving={setIsMoving}
            HEIGHT_MOVE_TOP={HEIGHT_MOVE_TOP}
          />
        </View>
      </Animated.View>
    </Container>
  )
}

const useStyles = makeStyles<MainProps>()(({ normalize, colors }) => ({
  root: {
    flex: 1,
    backgroundColor: colors.grey16,
  },
  container: {
    flex: 1,
  },
  containerHeader: {
    flex: 1,
    marginRight: normalize(-1)('moderate'),
  },
  containerTabView: {
    zIndex: -10,
    position: 'relative',
    flex: 1,
    backgroundColor: colors.primary50,
    alignSelf: 'center',
    marginTop: normalize(-1)('moderate'),
  },
  boxLeft: {
    backgroundColor: colors.primary50,
    zIndex: -100,
    position: 'absolute',
    height: normalize(100)('moderate'),
    width: normalize(200)('moderate'),
    top: normalize(-80)('moderate'),
  },
}))
