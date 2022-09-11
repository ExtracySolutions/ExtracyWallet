import { randomBytes } from 'crypto'

import React from 'react'

import {
  AVAXIcon,
  BNBIcon,
  ETHIcon,
  CELOIcon,
  TRONIcon,
  POLYGONIcon,
  SOLIcon,
  OBLIcon,
  KCCIcon,
  CROIcon,
  FTMIcon,
  ArbitrumIcon,
  AuroraIcon,
  OPIcon,
} from '@assets/icons'
import {
  TokenPlatform,
  NetworkType,
  FrequentRpc,
} from '@extracy-wallet-controller'
import { PublicKey } from '@solana/web3.js'
import { isEmpty } from 'lodash'

const tokensSupported = require('../../mock.json')

/**
 * APP_CONSTANT
 */

export const SEARRCHPAGE_URL = 'https://www.google.com/'
// export const HOMEPAGE_URL = 'https://www.google.com/'
export const HOMEPAGE_URL = 'HOMEPAGE_URL'

export const IMAGE_TOKEN_DEFAULT = 'https://i.ibb.co/jTLwHKV/default-token.png'
export const NOTIFICATION_NAMES = {
  accountsChanged: 'extracy_accountsChanged',
  unlockStateChanged: 'extracy_unlockStateChanged',
  chainChanged: 'extracy_chainChanged',
}

export const delay = (ms: number) =>
  new Promise<void>((res) => setTimeout(res, ms))

/**
 *
 * @param _
 * @param index
 * @returns return unique key, this function use for Flatlist
 */
export const keyExtractor = (_: any, index: number) => `${index}${Date.now()}`

/**
 * format balance
 */
// export const balanceFormat = new Intl.NumberFormat('en-IN', {})

/**
 * list of Network Icon supported
 */
const NetworkIconListWithNetworkID = {
  binance_smart_chain: <BNBIcon />,
  solana: <SOLIcon />,
  avalanche: <AVAXIcon />,
  ethereum: <ETHIcon />,
  celo: <CELOIcon />,
  tron: <TRONIcon />,
  matic: <POLYGONIcon />,
  cronos: <CROIcon />,
  kcc: <KCCIcon />,
  fantom: <FTMIcon />,
  arbitrum: <ArbitrumIcon />,
  aurora: <AuroraIcon />,
  optimism: <OPIcon />,
  other: <OBLIcon />,
}

const NetworkIconListWithChainID = {
  56: <BNBIcon />,
  97: <BNBIcon />,
  solana: <SOLIcon />,
  43114: <AVAXIcon />,
  1: <ETHIcon />,
  42220: <CELOIcon />,
  tron: <TRONIcon />,
  137: <POLYGONIcon />,
  321: <KCCIcon />,
  25: <CROIcon />,
  250: <FTMIcon />,
  42161: <ArbitrumIcon />,
  1313161554: <AuroraIcon />,
  10: <OPIcon />,
  other: <OBLIcon />,
}

const NetworkIdWithChainId = {
  '1': 'ethereum',
  '56': 'binance_smart_chain',
  '43114': 'avalanche',
  '137': 'matic',
  '25': 'cronos',
  '250': 'fantom',
  '321': 'kcc',
  '42161': 'arbitrum',
  '1313161554': 'aurora',
  '10': 'optimism',
  '42220': 'celo',
}

type NetworkIconListWithNetworkIDType =
  keyof typeof NetworkIconListWithNetworkID

type NetworkIconListWithChainIDType = keyof typeof NetworkIconListWithChainID

type NetworkIdWithChainIdType = keyof typeof NetworkIdWithChainId

/**
 * get icon network with networkID
 * @param networkID
 * @returns
 */

export const getIconNetworkWithNetworkID = (networkID: string) => {
  if (!NetworkIconListWithNetworkID.hasOwnProperty(networkID)) {
    return NetworkIconListWithNetworkID.other
  }
  return NetworkIconListWithNetworkID[
    networkID as NetworkIconListWithNetworkIDType
  ]
}

export const getIconNetworkWithChainID = (chainID: string) => {
  if (!NetworkIconListWithChainID.hasOwnProperty(chainID)) {
    return NetworkIconListWithChainID.other
  }
  return NetworkIconListWithChainID[chainID as NetworkIconListWithChainIDType]
}

export const amountInputFormat = (value: string) => {
  if (!isEmpty(value)) {
    const splitString = value.split(/[^0-9]/g)

    if (value[0] === '.') {
      return '0.'
      // setSendValue('0.')
    } else if (value.length === 1) {
      if (value[1] === '.') {
        return [splitString[0].replace('', ''), splitString[1]].join('')
      } else if (value[0] === ',') {
        return value.replace(',', '.')
      } else {
        return [
          splitString[0].replace(/\B(?=(\d{3})+(?!\d))/g, ''),
          splitString[1],
        ].join('')
      }
    }

    if (value.length > 1) {
      if (value.split('.').length > 1) {
        return [
          splitString[0].replace(/\B(?=(\d{3})+(?!\d))/g, ''),
          splitString[1],
        ].join('.')
      } else if (Number(value) === 0) {
        return '0'
      } else if (value[0] === '0' && value[1] !== '0') {
        return value.slice(1)
      } else {
        return value.replace(/[^0-9]/g, '.')
      }
    }
  }
}

export const isAddressSOL = async (address: string) => {
  try {
    let pubkey = new PublicKey(address)
    let isSolana = PublicKey.isOnCurve(pubkey.toBuffer())
    return isSolana
  } catch (error) {
    return false
  }
}

export const balanceFormat = (
  value?: string,
  decimal?: number,
  isFixed?: boolean,
) => {
  const compactValue = Math.pow(10, decimal ? decimal + 1 : 5)
  if (!value) {
    return
  }
  if (isFixed) {
    return (
      Math.round(
        Number(parseFloat(value).toFixed(decimal ? decimal + 1 : 5)) *
          compactValue +
          Number.EPSILON,
      ) / compactValue
    )
  }

  if (value.toString().indexOf('.') !== undefined) {
    return value.toString().indexOf('.') !== -1
      ? (
          (Number(
            value.slice(0, value.indexOf('.') + (decimal ? decimal + 1 : 5)),
          ) *
            compactValue +
            Number.EPSILON) /
          compactValue
        ).toLocaleString('en-EN', {
          maximumFractionDigits: decimal ? decimal + 1 : 5,
        })
      : value
  }
}

type TokenFromJSON = {
  token_id: string
  chainID: string
  networkName: string
  networkType: string
  decimals: string
  address: string
  image: string
  coingecko_id: string
}

/**
 * get network name base on ChainID and NetworkType
 * @param param0
 * @returns
 */
export const getNetworkName = ({
  networkType,
  chainID,
}: {
  networkType: NetworkType
  chainID?: string
}) => {
  // console.log(' networkType', networkType)
  // console.log(' chainID', chainID)
  // console.log(' networkType', typeof networkType)
  // console.log('typeof chainID', typeof chainID)
  switch (networkType) {
    case NetworkType.ERC20:
      switch (chainID) {
        case '1':
          return 'Ethereum Mainnet'
        case '56':
          return 'Binance Smart Chain'
        case '43114':
          return 'Avalanche C-Chain'
        case '137':
          return 'Polygon Network'
        case '25':
          return 'Cronos Mainnet'
        case '250':
          return 'Fantom Opera'
        case '42161':
          return 'Arbitrum One'
        case '1313161554':
          return 'Aurora Mainnet'
        case '10':
          return 'Optimism Mainnet'
        case '321':
          return 'KCC Mainnet'
        case '42220':
          return 'Celo Network'
        default:
          return 'This network not supported yet!'
      }
    case NetworkType.SOL:
      switch (chainID) {
        case 'solana':
          return 'Solana Network'
        default:
          return 'This network not supported yet!'
      }
    default:
      return 'This kind of network not supported yet!'
  }
}

export const getNetworkIdByChainId = ({ chainID }: { chainID: string }) => {
  if (!NetworkIdWithChainId.hasOwnProperty(chainID)) {
    // if network does not supported return default ethereum
    return
  }
  return NetworkIdWithChainId[chainID as NetworkIdWithChainIdType]
}

type TokenSupportedParams = {
  chainID: string
  address: string
  networkType: NetworkType
  symbol: string
  decimals: string
}

/**
 * check token is supported or not
 * if not supported return token with random token_id
 * @param {TokenSupportedParams}
 * @returns
 */
export const validateTokenSupported = ({
  chainID,
  address,
  networkType,
  symbol,
  decimals,
}: TokenSupportedParams): TokenPlatform => {
  const token = (tokensSupported as TokenFromJSON[]).find(
    (item) =>
      item.networkType === networkType &&
      item.chainID === chainID &&
      item.address.toLocaleLowerCase() === address.toLocaleLowerCase(),
  )
  if (!token) {
    return {
      token_id: randomBytes(8).toString(),
      chainID,
      networkType,
      symbol,
      address,
      decimals,
      image: IMAGE_TOKEN_DEFAULT,
      networkName: getNetworkName({ networkType, chainID }),
      isHide: false,
    }
  }
  return { ...token, networkType, symbol, isHide: false }
}

export const DEFAULT_FREQUENT_RPC: FrequentRpc[] = [
  {
    token_id: 'ethereum',
    coingecko_id: 'ethereum',
    type: NetworkType.ERC20,
    rpcUrl: 'YOUR_RPC',
    chainID: '1',
    chainSymbol: 'ERC20',
    nickname: 'Ethereum Mainnet',
    symbol: 'ETH',
    blockExplorerUrl: 'https://etherscan.io/',
    image: 'https://i.ibb.co/VV569MH/ethereum.png',
    layer2UseETH: false,
    isHide: false,
    name: 'Ethereum',
  },
  {
    token_id: 'arbitrum',
    coingecko_id: '',
    type: NetworkType.ERC20,
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    chainID: '42161',
    chainSymbol: 'ARBITRUM',
    nickname: 'Arbitrum One',
    symbol: 'ETH',
    blockExplorerUrl: 'https://arbiscan.io',
    image: 'https://i.ibb.co/B2kVLDr/arbitrum.png',
    layer2UseETH: true,
    isHide: false,
    name: 'Arbitrum',
  },
  {
    token_id: 'aurora',
    coingecko_id: 'aurora-near',
    type: NetworkType.ERC20,
    rpcUrl: 'https://mainnet.aurora.dev',
    chainID: '1313161554',
    chainSymbol: 'AURORA',
    nickname: 'Aurora Mainnet',
    symbol: 'ETH',
    blockExplorerUrl: 'https://aurorascan.dev/',
    image: 'https://i.ibb.co/jg2kyqb/aurora.png',
    layer2UseETH: true,
    isHide: false,
    name: 'Aurora',
  },
  {
    token_id: 'optimism',
    coingecko_id: 'optimism',
    type: NetworkType.ERC20,
    rpcUrl: 'https://mainnet.optimism.io',
    chainID: '10',
    chainSymbol: 'OP',
    nickname: 'Optimism Mainnet',
    symbol: 'ETH',
    blockExplorerUrl: 'https://optimistic.etherscan.io/',
    image: 'https://i.ibb.co/nPvY8DK/op.jpg',
    layer2UseETH: true,
    isHide: false,
    name: 'Optimism',
  },

  {
    token_id: 'binance_smart_chain',
    coingecko_id: 'binancecoin',
    type: NetworkType.ERC20,
    rpcUrl: 'https://bsc-dataseed.binance.org',
    chainID: '56',
    chainSymbol: 'BEP20',
    nickname: 'Binance Smart Chain',
    symbol: 'BNB',
    blockExplorerUrl: 'https://bscscan.com',
    image: 'https://i.ibb.co/t40GfQs/binance.png',
    layer2UseETH: false,
    isHide: false,
    name: 'BNB',
  },
  {
    token_id: 'avalanche',
    coingecko_id: 'avalanche-2',
    type: NetworkType.ERC20,
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    chainID: '43114',
    chainSymbol: 'ARC20',
    nickname: 'Avalanche C-Chain',
    symbol: 'AVAX',
    blockExplorerUrl: 'https://avascan.info/',
    image: 'https://i.ibb.co/60DpMVx/avalanche.png',
    layer2UseETH: false,
    isHide: false,
    name: 'Avalanche',
  },
  {
    token_id: 'matic',
    coingecko_id: 'matic-network',
    type: NetworkType.ERC20,
    rpcUrl: 'https://matic-mainnet.chainstacklabs.com',
    chainID: '137',
    chainSymbol: 'POLYGON',
    nickname: 'Polygon Network',
    symbol: 'MATIC',
    blockExplorerUrl: 'https://polygonscan.com/',
    image: 'https://i.ibb.co/f9Dmw98/polygon.png',
    layer2UseETH: false,
    isHide: false,
    name: 'Polygon',
  },
  {
    token_id: 'cronos',
    coingecko_id: 'crypto-com-chain',
    type: NetworkType.ERC20,
    rpcUrl: 'https://evm-cronos.crypto.org',
    chainID: '25',
    chainSymbol: 'CRO',
    nickname: 'Cronos Mainnet',
    symbol: 'CRO',
    blockExplorerUrl: 'https://cronoscan.com/',
    image: 'https://i.ibb.co/4KNXwq4/cronos.png',
    layer2UseETH: false,
    isHide: false,
    name: 'Cronos',
  },
  {
    token_id: 'fantom',
    coingecko_id: 'fantom',
    type: NetworkType.ERC20,
    rpcUrl: 'https://rpc.ftm.tools',
    chainID: '250',
    chainSymbol: 'FANTOM',
    nickname: 'Fantom Opera',
    symbol: 'FTM',
    blockExplorerUrl: 'https://ftmscan.com/',
    image: 'https://i.ibb.co/MnLFbxM/fantom.png',
    layer2UseETH: false,
    isHide: false,
    name: 'Fantom',
  },
  {
    token_id: 'kcc',
    coingecko_id: 'kucoin-shares',
    type: NetworkType.ERC20,
    rpcUrl: 'https://rpc-mainnet.kcc.network',
    chainID: '321',
    chainSymbol: 'KCC',
    nickname: 'KCC Mainnet',
    symbol: 'KCC',
    blockExplorerUrl: 'https://scan.kcc.io/',
    image: 'https://i.ibb.co/HPxtGT6/kcc.jpg',
    layer2UseETH: false,
    isHide: false,
    name: 'KuCoin',
  },
  {
    token_id: 'celo',
    coingecko_id: 'celo',
    type: NetworkType.ERC20,
    rpcUrl: 'https://forno.celo.org',
    chainID: '42220',
    chainSymbol: 'CELO',
    nickname: 'Celo Network',
    symbol: 'CELO',
    blockExplorerUrl: 'https://explorer.celo.org',
    image: 'https://i.ibb.co/VmdrFtq/celo.png',
    layer2UseETH: false,
    isHide: false,
    name: 'Celo',
  },
  // {
  //   token_id: 'harmony',
  //   coingecko_id: 'harmony',
  //   type: NetworkType.ERC20,
  //   rpcUrl: 'https://api.harmony.one',
  //   chainID: '1666600000',
  //   chainSymbol: 'HARMONY',
  //   nickname: 'Harmony Mainnet Shard 0',
  //   symbol: 'ONE',
  //   blockExplorerUrl: 'https://explorer.harmony.one/',
  //   image: 'https://i.ibb.co/kHY0bs5/harmony.png',
  // },

  {
    token_id: 'solana',
    type: NetworkType.SOL,
    rpcUrl: 'mainnet-beta',
    coingecko_id: 'solana',
    chainID: 'solana',
    chainSymbol: 'SOL',
    nickname: 'Solana Network',
    symbol: 'SOL',
    blockExplorerUrl: 'https://explorer.solana.com/',
    image: 'https://i.ibb.co/9GxL8xq/solana.png',
    layer2UseETH: false,
    isHide: false,
    name: 'Solana',
  },
]

export type ProviderConfig = {
  chainId: string
  engineParams: {
    pollingInterval: number
  }
  rpcUrl: string
  nickname: string
  ticker: string
}
