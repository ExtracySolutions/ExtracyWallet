import { createSlice } from '@reduxjs/toolkit'

import Engine from '../../core/Engine'
// import { store } from '../store'

type EngineState = {
  backgroundState: typeof Engine.state
}

const initialState: EngineState = {
  backgroundState: {},
}

const engineSlice = createSlice({
  name: 'engine',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase('INIT_BG_STATE', (state) => {
      state.backgroundState = Engine.state
    })
    builder.addCase('UPDATE_BG_STATE', (state, action) => {
      // console.log(
      //   '[TransactionController] :',
      //   JSON.stringify(
      //     Engine.state.TokenBalancesController?.tokenBalances,
      //     null,
      //     3,
      //   ),
      // )
      // @ts-ignore
      state.backgroundState[action.key] = Engine.state[action.key]
    })
  },
})

export const {} = engineSlice.actions
export const EngineReducer = engineSlice.reducer
