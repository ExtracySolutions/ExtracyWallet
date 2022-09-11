import React, { FC } from 'react'

import { Text } from '@components'
import { useAppSelector } from '@hooks'
import { makeStyles } from '@themes'
import { getIconNetworkWithNetworkID, balanceFormat } from '@ultils'
import { Dimensions, View } from 'react-native'

import { TokenPlatform } from '@extracy-wallet-controller'

export const { width } = Dimensions.get('screen')
export type TokenInnerItemProps = {
  priceToken?: number
} & TokenPlatform

export const TokenInnerItem: FC<TokenInnerItemProps> = (props) => {
  const themeStore = useAppSelector((state) => state.root.theme.theme)
  const styles = useStyles(props, themeStore)
  const tokenBalances = useAppSelector(
    (state) =>
      state.root.engine.backgroundState.TokenBalancesController?.tokenBalances,
  )
  const selectedAccountIndex = useAppSelector(
    (state) =>
      state.root.engine.backgroundState.PreferencesController
        ?.selectedAccountIndex,
  )
  const hideBalance = useAppSelector(
    (state) => state.root.tokenList.hideBalance,
  )

  const { networkName, networkType, token_id, isNative, address, priceToken } =
    props

  return (
    <View style={styles.containerItem}>
      <View style={styles.icon}>{getIconNetworkWithNetworkID(token_id)}</View>

      <View style={styles.token}>
        <Text variant="medium" style={styles.tokenName} numberOfLines={1}>
          {networkName}
        </Text>
      </View>
      <View style={styles.groupText}>
        <Text style={styles.title} variant="medium">
          {!hideBalance
            ? isNative
              ? !isNaN(
                  Number(
                    //@ts-ignore
                    tokenBalances?.[selectedAccountIndex]?.[networkType]?.[
                      token_id
                    ]?.balance,
                  ),
                )
                ? balanceFormat(
                    Number(
                      //@ts-ignore
                      tokenBalances?.[selectedAccountIndex]?.[networkType]?.[
                        token_id
                      ]?.balance,
                    ).toString(),
                  )
                : '---'
              : !isNaN(
                  Number(
                    //@ts-ignore
                    tokenBalances?.[selectedAccountIndex]?.[networkType]?.[
                      token_id
                    ]?.balance,
                  ),
                )
              ? balanceFormat(
                  Number(
                    //@ts-ignore
                    tokenBalances?.[selectedAccountIndex]?.[networkType]?.[
                      address
                    ]?.balance,
                  ).toString(),
                )
              : '---'
            : `****`}
        </Text>
        <Text style={styles.text}>
          {!hideBalance
            ? isNative
              ? !isNaN(
                  Number(
                    //@ts-ignore
                    tokenBalances?.[selectedAccountIndex]?.[networkType]?.[
                      token_id
                    ]?.balance,
                  ) * Number(priceToken),
                )
                ? `$${balanceFormat(
                    (
                      Number(
                        //@ts-ignore
                        tokenBalances?.[selectedAccountIndex]?.[networkType]?.[
                          token_id
                        ]?.balance,
                      ) * Number(priceToken)
                    ).toString(),
                  )}`
                : '---'
              : !isNaN(
                  Number(
                    //@ts-ignore
                    tokenBalances?.[selectedAccountIndex]?.[networkType]?.[
                      address
                    ]?.balance,
                  ) * Number(priceToken),
                )
              ? `$${balanceFormat(
                  (
                    Number(
                      //@ts-ignore
                      tokenBalances?.[selectedAccountIndex]?.[networkType]?.[
                        address
                      ]?.balance,
                    ) * Number(priceToken)
                  ).toString(),
                )}`
              : '---'
            : `****`}
        </Text>
        {/* open when need it */}
      </View>
    </View>
  )
}

const useStyles = makeStyles<TokenInnerItemProps>()(
  ({ normalize, font, colors }) => ({
    containerItem: {
      height: normalize(50)('vertical'),
      paddingLeft: normalize(17)('vertical'),
      paddingRight: normalize(15)('vertical'),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    token: {
      flexGrow: 1,
      flexShrink: 1,
      paddingLeft: normalize(10)('horizontal'),
    },
    tokenName: {
      fontSize: font.size.s4,
    },
    groupText: {
      paddingLeft: normalize(8)('horizontal'),
      flexDirection: 'column',
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
    },
    title: {
      fontSize: font.size.s4,
    },
    icon: {
      height: normalize(26)('vertical'),
      width: normalize(26)('vertical'),
    },
    text: {
      fontSize: font.size.s4,
      color: colors.grey11,
    },
  }),
)
