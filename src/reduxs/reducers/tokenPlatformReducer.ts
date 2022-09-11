import { NetworkType, TokenPlatform } from '@extracy-wallet-controller'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type tokenPlatformState = {
  tokenPlatform: TokenPlatform
}

const defaultTokenPlatformState: tokenPlatformState = {
  tokenPlatform: {
    token_id: '',
    networkType: NetworkType.ERC20,
    chainID: '',
    networkName: '',
    symbol: '',
    decimals: '',
    address: '',
    image: '',
    isNative: false,
    isHide: false,
  },
}

const tokenPlatformSlice = createSlice({
  name: 'tokenPlatform',
  initialState: defaultTokenPlatformState,
  reducers: {
    changeTokenPlatform(
      state: tokenPlatformState,
      action: PayloadAction<TokenPlatform>,
    ) {
      state.tokenPlatform = action.payload
    },
  },
})

export const { changeTokenPlatform } = tokenPlatformSlice.actions
export const TokenPlatformReducer = tokenPlatformSlice.reducer
