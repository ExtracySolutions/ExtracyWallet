import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type PrivacyState = {
  approveHosts: {
    [key: string]: boolean
  }
}

const defaultPrivacyState: PrivacyState = {
  approveHosts: {},
}

const privacySlice = createSlice({
  name: 'privacy',
  initialState: defaultPrivacyState,
  reducers: {
    setApproveHost(
      state: PrivacyState,
      action: PayloadAction<{ hostname: string }>,
    ) {
      console.log('hostname', action.payload.hostname)
      state.approveHosts = {
        ...state.approveHosts,
        [action.payload.hostname]: true,
      }
    },
  },
})

export const { setApproveHost } = privacySlice.actions
export const PrivacyReducer = privacySlice.reducer
