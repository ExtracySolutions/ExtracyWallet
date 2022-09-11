import React, { useCallback } from 'react'

import { BottomSheet, Button, Modalize, Text } from '@components'
import { useAppSelector } from '@hooks'
import { makeStyles, useTheme } from '@themes'
import { balanceFormat, calculateTransactionFree } from '@ultils'
import { BigNumber } from 'bignumber.js'
import { Dimensions, View } from 'react-native'

const { width } = Dimensions.get('screen')

export type InvoiceBottomSheetProps = {
  addressFrom: string
  addressTo: string
  gasPrice?: string
  gasLimit?: string
  transactionFee?: string
  networkTicker: string
  tokenTicker: string
  sendValue: string
  handleSendTransaction: () => void
  handleCloseInvoiceBottomSheet: () => void
}

export const InvoiceBottomSheet = React.forwardRef<
  Modalize,
  InvoiceBottomSheetProps
>((props, ref) => {
  const themeStore = useAppSelector((state) => state.root.theme.theme)
  const { colors } = useTheme(themeStore)
  const styles = useStyles(props, themeStore)
  const {
    addressFrom,
    addressTo,
    gasPrice,
    gasLimit,
    networkTicker,
    tokenTicker,
    sendValue,
    handleSendTransaction,
    handleCloseInvoiceBottomSheet,
    transactionFee,
  } = props

  const BNSendValue = new BigNumber(sendValue)
  const BNTransactionFee = new BigNumber(
    gasLimit && gasPrice
      ? calculateTransactionFree({
          gasLimit,
          gasPrice,
        })
      : '0.000005',
  )
  const totalAmount = BNSendValue.plus(BNTransactionFee)
  const HeaderComponent = useCallback(() => {
    return (
      <View style={styles.headerWrapper}>
        <Text style={styles.title} variant="bold" fontSize={14} lineHeight={20}>
          Review Transaction
        </Text>
      </View>
    )
  }, [styles.headerWrapper, styles.title])

  const FooterComponent = useCallback(() => {
    return (
      <View style={styles.buttonBottomSheet}>
        <Button
          onPress={handleSendTransaction}
          text="Confirm"
          containerStyle={styles.button}
        />
        <Button
          onPress={handleCloseInvoiceBottomSheet}
          text={'Reject'}
          textStyle={styles.textButton}
          containerStyle={styles.buttonReject}
          variant="none"
        />
      </View>
    )
  }, [
    handleCloseInvoiceBottomSheet,
    handleSendTransaction,
    styles.button,
    styles.buttonBottomSheet,
    styles.buttonReject,
    styles.textButton,
  ])

  const RowText = ({
    title,
    value,
    type,
  }: {
    title: string
    value: string | number | undefined
    type?: 'bold' | 'medium' | 'regular' | 'light'
  }) => {
    return (
      <View style={styles.rowTextInfo}>
        <Text
          fontSize={14}
          lineHeight={16}
          color={colors.grey4}
          variant={type || 'medium'}
        >
          {title}:
        </Text>
        <Text
          fontSize={14}
          lineHeight={16}
          color={colors.grey4}
          variant={type || 'medium'}
        >
          {value}
        </Text>
      </View>
    )
  }
  return (
    <>
      <BottomSheet
        ref={ref}
        FooterComponent={FooterComponent}
        HeaderComponent={HeaderComponent}
      >
        <View style={styles.bottomSheet}>
          <View style={styles.boxAddress}>
            <Text
              style={styles.box}
              numberOfLines={1}
              ellipsizeMode="middle"
              fontSize={14}
              lineHeight={16}
              textAlign="center"
            >
              {addressFrom}
            </Text>
            <Text style={styles.textIcon}>{'-->'}</Text>
            <Text
              style={styles.box}
              numberOfLines={1}
              ellipsizeMode="middle"
              fontSize={14}
              lineHeight={16}
              textAlign="center"
            >
              {addressTo}
            </Text>
          </View>

          <View style={styles.body}>
            <View style={styles.textSend}>
              <Text
                style={styles.textAmount}
                variant="bold"
                fontSize={16}
                lineHeight={20}
              >{`Sending : ${sendValue} ${tokenTicker} `}</Text>
            </View>

            <View style={styles.info}>
              {gasLimit && gasPrice ? (
                <>
                  <RowText title="Gas Limit" value={balanceFormat(gasLimit)} />
                  <RowText
                    title="Gas Price"
                    value={`${balanceFormat(gasPrice)} GWEI`}
                  />
                  <RowText
                    title="Estimate Fee"
                    value={`${calculateTransactionFree({
                      gasLimit,
                      gasPrice,
                    })} ${networkTicker}`}
                  />
                </>
              ) : (
                <RowText
                  title="Transaction Fee"
                  value={`${transactionFee} ${networkTicker}`}
                  type="bold"
                />
              )}
            </View>

            <View style={[styles.groupText, styles.nonLine]}>
              <View style={styles.groupGas}>
                <Text variant="bold" fontSize={14} lineHeight={20}>
                  Total
                </Text>
                <Text fontSize={14} lineHeight={16} color={colors.grey10}>
                  (Amount + Gas Fee)
                </Text>
              </View>
              <View style={styles.groupGasRight}>
                {tokenTicker === networkTicker ? (
                  <Text
                    variant="bold"
                    fontSize={14}
                    lineHeight={20}
                    textAlign="right"
                  >
                    {`${totalAmount.toString()} ${networkTicker}`}
                  </Text>
                ) : (
                  <>
                    <Text
                      variant="bold"
                      fontSize={14}
                      lineHeight={20}
                      textAlign="right"
                    >{`${sendValue} ${tokenTicker}`}</Text>

                    <>
                      <Text>+</Text>
                      <Text variant="bold" fontSize={14} lineHeight={20}>
                        {`${balanceFormat(
                          gasLimit && gasPrice
                            ? calculateTransactionFree({
                                gasLimit,
                                gasPrice,
                              })
                            : '0.000005',
                          10,
                        )} ${networkTicker}`}
                      </Text>
                    </>
                  </>
                )}
              </View>
            </View>
          </View>
        </View>
      </BottomSheet>
    </>
  )
})

const useStyles = makeStyles<InvoiceBottomSheetProps>()(
  ({ normalize, colors }) => ({
    bottomSheet: {
      textAlign: 'justify',
      paddingHorizontal: normalize(15)('horizontal'),
    },
    headerWrapper: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingBottom: normalize(16)('vertical'),
      paddingTop: normalize(24)('vertical'),
      borderBottomColor: colors.grey14,
      borderBottomWidth: 1,
    },

    groupText: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: normalize(15)('vertical'),
      borderBottomWidth: 0.4,
      borderColor: colors.primary,
      marginTop: normalize(20)('horizontal'),
    },
    box: {
      width: width / 2.5,
    },

    body: {
      shadowColor: 'gray',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      elevation: 5,
      backgroundColor: colors.white,
      borderRadius: normalize(10)('vertical'),
      marginBottom: normalize(15)('vertical'),
      paddingHorizontal: normalize(12)('vertical'),
    },

    textIcon: {
      paddingHorizontal: normalize(5)('horizontal'),
      color: colors.grey11,
    },
    textAmount: {
      color: colors.primary50,
      textAlign: 'center',
    },
    nonLine: {
      borderBottomWidth: 0,
    },
    groupGas: {
      flex: 1,
    },
    groupGasRight: {
      flex: 1,
      alignItems: 'flex-end',
    },
    buttonBottomSheet: {
      paddingBottom: normalize(15)('vertical'),
      paddingHorizontal: normalize(10)('horizontal'),
    },
    button: {
      marginHorizontal: normalize(5)('horizontal'),
    },
    textButton: {
      color: colors.primary,
    },
    buttonReject: {
      paddingTop: normalize(-50)('horizontal'),
    },
    title: {
      color: colors.grey4,
    },
    boxAddress: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: normalize(24)('vertical'),
    },
    textSend: {
      paddingVertical: normalize(16)('vertical'),
      borderBottomColor: colors.grey16,
      borderBottomWidth: 1,
    },
    info: {
      marginTop: normalize(16)('vertical'),
      borderBottomColor: colors.grey16,
      borderBottomWidth: 1,
    },
    rowTextInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: normalize(16)('vertical'),
    },
    boxTotal: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: normalize(16)('vertical'),
    },
  }),
)
