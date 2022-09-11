import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type initialStateType = {
  dataSearch: string
  isFirst: boolean
}

const initialState: initialStateType = {
  dataSearch: '',
  isFirst: true,
}

const addToken = createSlice({
  name: 'addToken',
  initialState: initialState,
  reducers: {
    changeDataSearchToken(
      state: initialStateType,
      action: PayloadAction<string>,
    ) {
      state.dataSearch = action.payload
    },
    changeStatusFirst(state: initialStateType, action: PayloadAction<boolean>) {
      state.isFirst = action.payload
    },
  },
})

export const { changeDataSearchToken, changeStatusFirst } = addToken.actions
export const AddTokenReducer = addToken.reducer
