import React, { FC } from 'react'

import { RangeInput, Text } from '@components'
import { useAppSelector } from '@hooks'
import { makeStyles, useTheme } from '@themes'
import { calculateTransactionFree } from '@ultils'
import BigNumber from 'bignumber.js'
import { View } from 'react-native'

const GAS_LIMIT_INCREMENT = new BigNumber(1000)
const GAS_PRICE_INCREMENT = new BigNumber(1)
const GAS_LIMIT_MIN = new BigNumber(21000)

export type AdvanceEditProps = {
  gasPrice: string
  handleChangeGasPrice: (value: string) => void
  gasLimit: string
  handleChangeGasLimit: (value: string) => void
  ticker: string
}

export const AdvanceEdit: FC<AdvanceEditProps> = (props) => {
  const themeStore = useAppSelector((state) => state.root.theme.theme)
  const styles = useStyles(props, themeStore)
  const { colors } = useTheme(themeStore)
  const {
    gasLimit,
    gasPrice,
    ticker,
    handleChangeGasLimit,
    handleChangeGasPrice,
  } = props

  return (
    <View style={styles.root}>
      <RangeInput
        name="Gas Limit"
        label="Gas Limit"
        value={gasLimit}
        min={GAS_LIMIT_MIN}
        isDisabledSub={
          new BigNumber(gasLimit).isEqualTo(GAS_LIMIT_MIN) ? true : false
        }
        increment={GAS_LIMIT_INCREMENT}
        onChangeValue={handleChangeGasLimit}
      />

      <RangeInput
        name="Gas Price"
        label="Gas Price (GWEI)"
        value={gasPrice}
        min={new BigNumber(1.1)}
        isDisabledSub={
          !new BigNumber(1.1).isLessThanOrEqualTo(new BigNumber(gasPrice))
        }
        increment={GAS_PRICE_INCREMENT}
        onChangeValue={handleChangeGasPrice}
      />
      <Text
        textAlign="center"
        fontSize={14}
        lineHeight={20}
        color={colors.grey11}
      >
        The network fee covers the cost of processing your transaction on the
        Ethereum network.
      </Text>
      <Text
        fontSize={14}
        lineHeight={16}
        color={colors.grey4}
        textAlign="center"
        style={styles.boxTotal}
      >{`Estimated Fee: ${calculateTransactionFree({
        gasLimit,
        gasPrice,
      })} ${ticker}`}</Text>
    </View>
  )
}

const useStyles = makeStyles<AdvanceEditProps>()(({ normalize }) => ({
  root: { flex: 1 },
  boxTotal: {
    alignSelf: 'center',
    position: 'absolute',
    bottom: normalize(0)('moderate'),
  },
}))
