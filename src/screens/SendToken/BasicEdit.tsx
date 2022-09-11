import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'

import { AverageIcon, FastIcon, SlowIcon } from '@assets/icons'
import { Text } from '@components'
import { useAppSelector } from '@hooks'
import { makeStyles, useTheme } from '@themes'
import { isEmpty } from 'lodash'
import { TouchableOpacity, View } from 'react-native'
import { balanceFormat } from 'ultils'

import { GasSpeed, useLazyGasTrackerQuery } from '../../reduxs/services'

/**
 * ethereum: eth
 * binance : bsc
 * avalanche : avax
 * fantom : ftm
 * polygon : poly
 * cronos : cro
 * harmony : one
 * heco : ht
 * celo : celo
 * moonriver : movr
 * fuse : fuse
 */

export const getIDParamsByNetworkID = (networkID: string) => {
  switch (networkID) {
    case '1':
      return 'eth'
    case '56':
      return 'bsc'
    case '43114':
      return 'avax'
    case '137':
      return 'poly'
    case '250':
      return 'ftm'
    case '25':
      return 'cro'
    case '1666600000':
      return 'one'
    case '128':
      return 'ht'
    case '1285':
      return 'movr'
    case '42220':
      return 'celo'
    case '122':
      return 'fuse'
    default:
      return 'NotSupported'
  }
}

interface SpeedType {
  title: string
  backgroundColor: string
  icon: React.ReactElement
  gas: GasSpeed
  textColor: string
  borderColor: string
}

export type BasicEditProps = {
  networkID: string
  ticker: string
  setGasPriceBasic: React.Dispatch<React.SetStateAction<string>>
}

export const BasicEdit: FC<BasicEditProps> = (props) => {
  const themeStore = useAppSelector((state) => state.root.theme.theme)
  const styles = useStyles(props, themeStore)
  const { colors } = useTheme(themeStore)
  const { networkID, setGasPriceBasic } = props

  const [gasSpeeds, setGasSpeeds] = useState<GasSpeed[]>([])
  const [selectedIndex, setSelectedIndex] = useState<number>(0)

  const [trackeGas, { isLoading, data }] = useLazyGasTrackerQuery()

  const hanldeSelectedOption = useCallback(
    (gasPrice: string, selectedIndex: number) => {
      setGasPriceBasic(Number(gasPrice) + '')
      setSelectedIndex(selectedIndex)
    },
    [setGasPriceBasic],
  )
  const dataSpeed: SpeedType[] = useMemo(() => {
    return [
      {
        title: 'Slow',
        backgroundColor: colors.OrangeBG,
        icon: <SlowIcon />,
        gas: gasSpeeds[0],
        textColor: colors.Orange,
        borderColor: colors.Orange,
      },
      {
        title: 'Fast',
        backgroundColor: colors.primary0,
        icon: <FastIcon />,
        gas: gasSpeeds[1],
        textColor: colors.primary50,
        borderColor: colors.primary50,
      },
      {
        title: 'Instant',
        backgroundColor: colors.PinkBG,
        icon: <AverageIcon />,
        gas: gasSpeeds[2],
        textColor: colors.Pink,
        borderColor: colors.Pink,
      },
    ]
  }, [
    colors.Orange,
    colors.OrangeBG,
    colors.Pink,
    colors.PinkBG,
    colors.primary0,
    colors.primary50,
    gasSpeeds,
  ])

  const renderItem = ({ item, index }: { item: SpeedType; index: number }) => {
    const { backgroundColor, gas, icon, textColor, title, borderColor } = item
    return (
      <TouchableOpacity
        onPress={() => hanldeSelectedOption(gasSpeeds[index].gasPrice, index)}
        disabled={isLoading && isEmpty(gasSpeeds)}
      >
        <View
          style={[
            styles.boxOption,
            selectedIndex === index && { borderColor },
            { backgroundColor },
          ]}
        >
          {icon}
          <Text
            variant="bold"
            style={styles.titleOption}
            fontSize={16}
            lineHeight={20}
            color={textColor}
          >
            {title}
          </Text>
          <Text
            style={styles.textOption}
            fontSize={14}
            lineHeight={16}
            color={colors.grey4}
          >
            {isLoading || isEmpty(gasSpeeds)
              ? '---'
              : `${balanceFormat(gas.gasPrice.toString(), 2)} Gwei`}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  /**
   * fetch api when init this component
   */
  useEffect(() => {
    if (networkID) {
      const idParams = getIDParamsByNetworkID(networkID)
      if (idParams !== 'NotSupported') {
        trackeGas(idParams)
      }
    }
  }, [networkID, trackeGas])

  useEffect(() => {
    if (data) {
      setGasSpeeds(data.speeds)
    }
    if (!isEmpty(gasSpeeds) && selectedIndex === 0) {
      hanldeSelectedOption(Number(gasSpeeds[0].gasPrice) + '', 0)
    }
  }, [data, gasSpeeds, hanldeSelectedOption, selectedIndex])

  return (
    <View style={styles.root}>
      <View style={styles.groupOption}>
        {dataSpeed.map((item, index) => {
          return renderItem({ item, index })
        })}
      </View>
      <Text
        style={styles.textBS}
        fontSize={14}
        lineHeight={20}
        color={colors.grey11}
      >
        The network fee covers the cost of processing your transaction on the
        Ethereum network.
      </Text>
    </View>
  )
}

const useStyles = makeStyles<BasicEditProps>()(({ colors, normalize }) => ({
  root: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  groupOption: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  boxOption: {
    width: normalize(100)('horizontal'),
    height: normalize(125)('vertical'),
    borderRadius: normalize(14)('moderate'),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.white,
  },
  boxOverlay: {
    position: 'absolute',
    width: normalize(100)('horizontal'),
    height: normalize(125)('vertical'),
    backgroundColor: `${colors.white}${70}`,
    borderRadius: normalize(14)('moderate'),
  },
  titleOption: {
    paddingTop: normalize(10)('moderate'),
  },
  textOption: {
    paddingTop: normalize(5)('moderate'),
  },

  textBS: {
    textAlign: 'center',
    marginHorizontal: normalize(16)('moderate'),
    paddingTop: normalize(24)('moderate'),
    marginBottom: normalize(32)('moderate'),
  },
}))
