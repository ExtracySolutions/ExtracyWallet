import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type AuthState = {
  token?: string
}

const defaultAuthState: AuthState = {
  token: undefined,
}

const authSlice = createSlice({
  name: 'auth',
  initialState: defaultAuthState,
  reducers: {
    authToken(state: AuthState, action: PayloadAction<string>) {
      state.token = action.payload
    },
  },
})

export const { authToken } = authSlice.actions
export const AuthReducer = authSlice.reducer
