import React, { FC, useCallback, useMemo } from 'react'

import { Text } from '@components'
import { useAppSelector } from '@hooks'
import { makeStyles, theme } from '@themes'
import {
  ToastCancelIcon,
  ToastCompleteIcon,
  ToastSubmitIcon,
  CancelIcon,
} from 'assets'
import { isEmpty } from 'lodash'
import { View, TouchableWithoutFeedback, Dimensions } from 'react-native'

const width = Dimensions.get('screen').width

export type ToastType = 'submited' | 'completed' | 'cancelled' | 'limited'

export type ToastPayload = {
  /**
   * status of the toast
   */
  type: ToastType
  /**
   * nounce number of the transaction
   */
  nounce?: number
  /**
   * transaction hash return when making transaction
   */
  transactionHash?: string
  /**
   * message
   */
  message?: string
}

export type ToastNotificationProps = {
  toast: {
    /**
     * Payload data for custom toasts. You can pass whatever you want
     */
    data: ToastPayload
    /**
     * Id is optional, you may provide an id only if you want to update toast later using toast.update()
     */
    id?: string
    /**
     * Customize toast icon
     */
    icon?: React.ReactElement
    /**
     * In ms, How long toast will stay before it go away
     */
    duration?: number
    /**
     * Customize when toast should be placed
     */
    placement?: 'top' | 'bottom'
    /**
     * Customize how fast toast will show and hide
     */
    animationDuration?: number
    /**
     * Customize how toast is animated when added or removed
     */
    animationType?: 'slide-in' | 'zoom-in'
    /**
     * Register event for when toast is pressed. If you're using a custom toast you have to pass this to a Touchable.
     */
    onPress?(id: string): void
    /**
     * Execute event after toast is closed
     */
    onClose?(): void

    onHide(): void

    swipeEnabled?: boolean
  }
}

export const ToastNotification: FC<ToastNotificationProps> = (props) => {
  const { theme: themeStore } = useAppSelector((state) => state.root.theme)
  const styles = useStyles(props, themeStore)
  const { toast } = props
  const toastRender = useCallback(
    (data: ToastPayload) => {
      switch (data.type) {
        case 'submited':
          return {
            title: 'Transaction Submitted',
            description: 'Waiting for confirmation',
            icon: (propsIcon: object) => (
              <View style={styles.icon}>
                <ToastSubmitIcon
                  height={26}
                  width={26}
                  {...propsIcon}
                  color={theme.light.colors.primary50}
                />
              </View>
            ),
            styles: styles.submitedBg,
            nounce: data.nounce,
            transactionHash: data.transactionHash,
            colorTitle: { color: theme.light.colors.primary50 },
          }
        case 'completed':
          return {
            title: !isEmpty(data.nounce)
              ? `Transaction #${data.nounce} Complete!`
              : `Transaction Complete!`,
            description: 'Tap to view this transaction',
            icon: (propsIcon: object) => (
              <View style={styles.icon}>
                <ToastCompleteIcon height={26} width={26} {...propsIcon} />
              </View>
            ),
            styles: styles.completeBg,
            nounce: data.nounce,
            transactionHash: data.transactionHash,
            colorTitle: { color: theme.light.colors.profit },
          }
        case 'cancelled':
          return {
            title: data.message ?? 'Transaction cancelled!',
            description: 'Tap to view this transaction',
            icon: (propsIcon: object) => (
              <View style={styles.boxBorderIcon}>
                <CancelIcon
                  color={theme.light.colors.alert}
                  width={10}
                  height={10}
                  {...propsIcon}
                />
              </View>
            ),
            styles: styles.cancelledBg,
            nounce: data.nounce,
            transactionHash: data.transactionHash,
            colorTitle: { color: theme.light.colors.alert },
          }
        case 'limited':
          return {
            title: 'Cannot exceed 8 tabs',
            description: `Please delete the tabs you don't use`,
            icon: (propsIcon: object) => (
              <View style={styles.icon}>
                <ToastCancelIcon
                  {...propsIcon}
                  height={26}
                  width={26}
                  color={theme.light.colors.alert}
                />
              </View>
            ),
            styles: styles.cancelledBg,
            nounce: data.nounce,
            transactionHash: data.transactionHash,
            colorTitle: { color: theme.light.colors.alert },
          }
        default:
          return undefined
      }
    },
    [
      styles.boxBorderIcon,
      styles.cancelledBg,
      styles.completeBg,
      styles.icon,
      styles.submitedBg,
    ],
  )

  const data = useMemo(() => {
    return toastRender(toast.data)
  }, [toast, toastRender])

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        /**
         * TODO : action depend on toast status
         */
      }}
    >
      <View style={styles.itemToast}>
        <View style={[styles.bgToast, data?.styles]}>
          {data?.icon({})}
          <View style={styles.group}>
            <View style={styles.space} />
            <Text
              fontSize={14}
              lineHeight={20}
              variant={'bold'}
              numberOfLines={1}
              style={[styles.title, data?.colorTitle]}
            >
              {data?.title}
            </Text>

            <Text
              variant="medium"
              style={styles.text}
              fontSize={12}
              lineHeight={14}
            >
              {data?.description}
            </Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

const useStyles = makeStyles<ToastNotificationProps>()(
  ({ normalize, colors }) => ({
    itemToast: {
      flex: 1,
      maxWidth: width * 0.94,
      flexDirection: 'row',
      justifyContent: 'center',
      height: normalize(60)('moderate'),
      marginBottom: normalize(-10)('vertical'),
    },
    bgToast: {
      borderRadius: normalize(8)('vertical'),
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      elevation: 2,
      zIndex: 2,
      justifyContent: 'center',
      alignContent: 'center',
    },
    completeBg: {
      backgroundColor: colors.greenBG,
      borderWidth: normalize(1)('moderate'),
      borderColor: colors.profit,
    },
    submitedBg: {
      backgroundColor: colors.primary0,
      borderWidth: normalize(1)('moderate'),
      borderColor: colors.primary50,
    },
    cancelledBg: {
      backgroundColor: colors.alertBG,
      borderWidth: normalize(1)('moderate'),
      borderColor: colors.alert,
    },
    icon: {
      flex: 0.5,
      alignItems: 'center',
      justifyContent: 'center',
    },
    boxBorderIcon: {
      flex: 0.5,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: colors.alert,
      borderRadius: normalize(50)('moderate'),
      width: normalize(30)('moderate'),
      height: normalize(30)('moderate'),
      marginHorizontal: normalize(11)('moderate'),
    },
    group: {
      flex: 3,
      height: normalize(75)('moderate'),
      justifyContent: 'space-between',
    },
    space: {
      flex: 1,
    },
    title: {
      width: '95%',
      flex: 1.5,
    },
    text: {
      flex: 2,
      color: colors.grey4,
    },
  }),
)
