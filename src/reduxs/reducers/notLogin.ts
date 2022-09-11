import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type NotLoginState = {
  notLogin: boolean
}

const defaultNotLoginState: NotLoginState = {
  notLogin: true,
}

const notLoginSlice = createSlice({
  name: 'notLogin',
  initialState: defaultNotLoginState,
  reducers: {
    setNotLogin(state: NotLoginState, action: PayloadAction<boolean>) {
      state.notLogin = action.payload
    },
  },
})

export const { setNotLogin } = notLoginSlice.actions
export const NotLoginReducer = notLoginSlice.reducer
