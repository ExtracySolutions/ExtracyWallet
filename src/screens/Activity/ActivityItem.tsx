import React, { FC, useCallback, useEffect, useState } from 'react'

import { SwapIcon1, ApprovedIcon, ReceivedIcon, SendIcon } from '@assets/icons'
import { Text } from '@components'
import { NetworkType } from '@extracy-wallet-controller'
import { useAppSelector } from '@hooks'
import { makeStyles, colors as Colors, normalize as Normalize } from '@themes'
import {
  TransactionElement,
  DEFAULT_FREQUENT_RPC,
  balanceFormat,
  getIconNetworkWithNetworkID,
} from '@ultils'
import { format as dateFormat } from 'date-fns'
import { useTranslation } from 'react-i18next'
import {
  Dimensions,
  View,
  TouchableOpacity,
  Linking,
  StyleSheet,
} from 'react-native'
import { fromWei, toBN } from 'web3-utils'

export const { width } = Dimensions.get('screen')

export type ActivityItemProps = TransactionElement

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Approved':
    case 'Confirmed':
    case 'Submitted':
      return Colors.light.blue
    case 'Cancelled':
    case 'Failed':
    case 'Rejected':
    case 'Unapproved':
      return Colors.light.loss

    default:
      return Colors.light.yellow
  }
}

const getIconActivityItem = (transactionType: string, status: string) => {
  const isFailedTransaction =
    status === 'cancelled' ||
    status === 'failed' ||
    status === 'rejected' ||
    status === 'unapproved'

  switch (transactionType) {
    case 'transaction_sent':
    case 'transaction_sent_token':
    case 'transaction_sent_collectible':
      return (
        <View style={stylesOther.boxIcon}>
          <SendIcon
            color={Colors.light.primary50}
            height={Normalize(20)('moderate')}
            width={Normalize(20)('moderate')}
          />
        </View>
      )
    case 'transaction_received':
    case 'transaction_received_token':
    case 'transaction_received_collectible':
      return (
        <View style={stylesOther.boxIcon}>
          <ReceivedIcon
            height={Normalize(22)('moderate')}
            width={Normalize(22)('moderate')}
          />
        </View>
      )

    case 'transaction_site_interaction':
      return (
        <View style={stylesOther.boxIcon}>
          <SwapIcon1
            height={Normalize(15)('moderate')}
            width={Normalize(15)('moderate')}
          />
        </View>
      )
    case 'transaction_approve':
      return (
        <View style={stylesOther.boxIcon}>
          <ApprovedIcon
            height={Normalize(18)('moderate')}
            width={Normalize(18)('moderate')}
          />
        </View>
      )
  }
}
const getExplorerUrlWithTransactionHash = (
  chainID: string,
  transactionHash: string,
) => {
  const explorerUrl = DEFAULT_FREQUENT_RPC.find(
    (item) => item.chainID === chainID,
  )
  return `${explorerUrl?.blockExplorerUrl}/tx/${transactionHash}`
}

export const ActivityItem: FC<ActivityItemProps> = (props) => {
  const {
    date,
    actionKey,
    status,
    value,
    ticker,
    networkID,
    transactionHash,
    transactionType,
    networkType,
  } = props

  const themeStore = useAppSelector((state) => state.root.theme.theme)
  const styles = useStyles(props, themeStore)
  const { t } = useTranslation()
  const [amount, setAmount] = useState<string>('0')
  const [isOver, setOver] = useState<boolean>(false)

  const nomalizeValue = useCallback(() => {
    let numberValue = 0
    switch (networkType) {
      case NetworkType.ERC20:
        numberValue = Number(fromWei(toBN(value ? value : '0x'), 'ether'))
        break
      case NetworkType.SOL:
        numberValue = Number(value)
        break
      default:
        numberValue = 0
        break
    }

    numberValue < 0.00001
      ? numberValue === 0
        ? setAmount('0')
        : [setAmount('0.00001'), setOver(true)]
      : setAmount(numberValue.toString())
  }, [networkType, value])

  const openExplorerUrl = useCallback(async () => {
    if (transactionHash) {
      const url = getExplorerUrlWithTransactionHash(
        networkID as string,
        transactionHash as string,
      )

      const isSupported = await Linking.canOpenURL(url)

      if (isSupported) {
        await Linking.openURL(url)
      }
    }
  }, [networkID, transactionHash])

  useEffect(() => {
    nomalizeValue()
  }, [nomalizeValue])

  return (
    <TouchableOpacity style={styles.containerItem} onPress={openExplorerUrl}>
      <Text lineHeight={14} style={styles.textDate}>
        {date ? dateFormat(Number(date), 'dd/MM/yyyy k:mm') : ''}
      </Text>
      <View style={styles.group}>
        <View style={styles.groupLeft}>
          {getIconActivityItem(String(transactionType), status)}
          <View style={styles.groupText}>
            <Text
              lineHeight={16}
              fontSize={14}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {t(`${actionKey}`, { unit: ticker })}
            </Text>
            <Text lineHeight={16} style={styles.textStatus}>
              {status}
            </Text>
          </View>
        </View>

        <View style={styles.groupRight}>
          <Text
            variant={'medium'}
            fontSize={14}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {`${isOver ? '<' : ''}${balanceFormat(amount, 6)} ${ticker}`}
          </Text>
          <View style={styles.logo}>
            {getIconNetworkWithNetworkID(networkID ?? '')}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const useStyles = makeStyles<ActivityItemProps>()(
  ({ colors, normalize, font }) => ({
    containerItem: {
      width: width * 0.93,
      justifyContent: 'center',
      paddingHorizontal: normalize(12)('horizontal'),
      paddingVertical: normalize(12)('vertical'),
      backgroundColor: colors.white,
      marginHorizontal: normalize(16)('moderate'),
      marginVertical: normalize(6)('moderate'),
      borderRadius: normalize(16)('moderate'),
      shadowColor: colors.black,
      shadowOffset: {
        width: 0,
        height: 0.5,
      },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
    group: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: normalize(4)('moderate'),
    },
    groupText: {
      marginLeft: normalize(10)('horizontal'),
    },
    groupLeft: {
      flex: 2,
      flexDirection: 'row',
      alignItems: 'center',
      flexGrow: 0.8,
    },
    textDate: {
      fontSize: font.size.s5,
      color: colors.grey10,
      marginTop: normalize(3)('moderate'),
      paddingLeft: normalize(2)('horizontal'),
    },
    textStatus: ({ status }) => ({
      fontSize: font.size.s4,
      color: getStatusColor(status),
      marginTop: normalize(2)('moderate'),
    }),
    logo: {
      width: normalize(18)('moderate'),
      marginLeft: normalize(8)('moderate'),
    },
    groupRight: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
  }),
)

const stylesOther = StyleSheet.create({
  boxIcon: {
    borderRadius: Normalize(200)('moderate'),
    backgroundColor: Colors.light.primary0,
    width: Normalize(32)('moderate'),
    height: Normalize(32)('moderate'),
    alignItems: 'center',
    justifyContent: 'center',
  },
})
