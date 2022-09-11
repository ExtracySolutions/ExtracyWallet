import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type openWalletReducerState = {
  canOpen: boolean
}

const defaultOpenWalletState: openWalletReducerState = {
  canOpen: false,
}

const OpenWalletSlice = createSlice({
  name: 'openWallet',
  initialState: defaultOpenWalletState,
  reducers: {
    changeScreen(
      state: openWalletReducerState,
      action: PayloadAction<boolean>,
    ) {
      state.canOpen = action.payload
    },
  },
})

export const { changeScreen } = OpenWalletSlice.actions
export const OpenWalletReducer = OpenWalletSlice.reducer
