import React, { FC, useCallback, useState } from 'react'

import { Switch, Text } from '@components'
import { useAppDispatch, useAppSelector } from '@hooks'
import { makeStyles } from '@themes'
import Engine from 'core/Engine'
import { Dimensions, View, Pressable } from 'react-native'
import { hideToken } from 'reduxs/reducers'
import { getIconNetworkWithNetworkID } from 'ultils'

export const Context = React.createContext('token_id')
export const { width } = Dimensions.get('screen')

export type SelectedNetworkItemProps = {
  isHide: boolean
  networkName: string
  token_id: string
  nickname: string
}

export const SelectedNetworkItem: FC<SelectedNetworkItemProps> = (props) => {
  const themeStore = useAppSelector((state) => state.root.theme.theme)
  const selectedAccount = useAppSelector(
    (state) =>
      state.root.engine.backgroundState.PreferencesController
        ?.selectedAccountIndex,
  )
  const styles = useStyles(props, themeStore)

  const { isHide, token_id, networkName, nickname } = props

  const [isSwitch, setSwitch] = useState<boolean>(isHide)

  const dispatch = useAppDispatch()

  // change name functions to handleNetwork

  const handleHideToken = useCallback(() => {
    setSwitch(!isSwitch)

    if (selectedAccount?.toString()) {
      Engine.context.TokensController?.hideToken(token_id, !isSwitch)
      // dispatch(
      //   hideNetwork({
      //     isHide: !isSwitch,
      //     selectedAccount: selectedAccount,
      //     token_id: token_id,
      //   }),
      // )
      dispatch(
        hideToken({
          selectedAccount: selectedAccount,
        }),
      )
    }
  }, [dispatch, isSwitch, selectedAccount, token_id])

  return (
    <View style={styles.box}>
      <View style={styles.item}>
        <View style={styles.icon}>{getIconNetworkWithNetworkID(token_id)}</View>

        <View style={styles.titleWrapper}>
          <Text variant="medium" style={styles.nameTitle}>
            {!nickname ? (!networkName ? nickname : networkName) : nickname}
          </Text>
        </View>
        <View style={styles.groupIcon}>
          <Pressable style={styles.switch}>
            <Switch isSwitch={!isSwitch} onPress={handleHideToken} />
          </Pressable>
        </View>
      </View>
    </View>
  )
}

const useStyles = makeStyles<SelectedNetworkItemProps>()(
  ({ normalize, font }) => ({
    item: {
      flex: 1,
      paddingHorizontal: normalize(8)('vertical'),
      marginHorizontal: normalize(8)('vertical'),
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      zIndex: 100,
      backgroundColor: 'white',
      borderRadius: normalize(10)('vertical'),
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: normalize(20)('moderate'),
    },
    box: {
      flex: 1,
      width: width,
      height: normalize(90)('moderate'),
    },

    titleWrapper: {
      flex: 1,
      marginLeft: normalize(10)('horizontal'),
      flexDirection: 'column',
    },
    nameTitle: {
      fontSize: font.size.button,
    },
    switch: {
      justifyContent: 'flex-start',
      alignContent: 'flex-start',
    },
    groupIcon: {
      alignItems: 'center',
      flexDirection: 'row',
    },
    icon: {
      height: normalize(32)('vertical'),
      width: normalize(32)('vertical'),
    },
  }),
)
