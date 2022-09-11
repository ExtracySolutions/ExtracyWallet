import { GestureResponderEvent } from 'react-native'

export interface itemTokenResult {
  isTokenNotSupportedYet?: any
  _id: string
  id: string
  coingecko_id: string
  chain_id: number | string
  network_name: string
  type: string
  symbol: string
  name: string
  decimals: number | string
  address: string
  image: string
  status: string
  prv_id: null | string
  ref_ids: Array<string>[] | string
  isHide?: boolean
  isNative?: boolean
  isDataConvert?: boolean
  item?: any
  isTokenNotSupportYet?: boolean
}

export interface AddTokenProps {
  rightIconPress?: (event: GestureResponderEvent) => void
  isValidScan: boolean
  errorAddressScan: string
  recipientAddressScan: string
  tokenName: string
}

export interface Platform {
  token_id: string
  chainID: string
  networkName: string
  networkType: string
  address: string
  decimals: string
  symbol: string
  isNative: boolean
  isHide: boolean
}

export interface TokenItem {
  token_id: string
  symbol: string
  accountIndex: number
  image: string
  coingecko_id: string
  platform: Platform[]
  isHide: boolean
  tokenName?: string
  name?: string
  _id?: string
}
export interface PropsSearch {
  isScan: boolean
  setIsScan: (boolean: boolean) => void
}

export interface resultSort extends itemTokenResult {
  points?: number | undefined
}
