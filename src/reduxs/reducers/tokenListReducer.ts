import { TokenPlatform, Token } from '@extracy-wallet-controller'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { isEmpty } from 'lodash'

export type TokenParam = {
  [selectedAccount: number]: Token[]
}
type NetworkParam = {
  [selectedAccount: number]: TokenPlatform[]
}
type TotalPrice = {
  [selectedAccount: number]: string
}
type tokenListReducerState = {
  tokenList: TokenParam
  tokenHideList: TokenParam
  networkListActive: NetworkParam[]
  networkListAll: TokenPlatform[]
  totalPrice: TotalPrice[]
  dataAPI: any
  // isSelectedNetwork: boolean
  hideBalance: boolean
  networkTypeChoose: string
}

const defaultTokenListState: tokenListReducerState = {
  tokenList: {},
  tokenHideList: [],
  networkListActive: [],
  networkListAll: [],
  dataAPI: [],
  totalPrice: [],
  // isSelectedNetwork: true,
  hideBalance: false,
  networkTypeChoose: '',
}

const TokenListSlice = createSlice({
  name: 'tokenList',
  initialState: defaultTokenListState,
  reducers: {
    addTokens(
      state: tokenListReducerState,
      action: PayloadAction<{
        tokenParam: Token[]
        selectedAccount: number
      }>,
    ) {
      let tokens: { [accountIndex: number]: Token[] } = {}
      tokens[action.payload.selectedAccount] = action.payload.tokenParam
      Object.assign(state.tokenList, tokens)
    },
    addToken(
      state: tokenListReducerState,
      action: PayloadAction<{
        tokenParam: Token[]
        selectedAccount: number
      }>,
    ) {
      const indexItemRemove = state.tokenList[
        action.payload.selectedAccount
      ].findIndex((token) => {
        return (
          token.token_id ===
          action.payload.tokenParam[action.payload.tokenParam.length - 1]
            .token_id
        )
      })
      if (indexItemRemove !== -1) {
        state.tokenList[action.payload.selectedAccount][
          indexItemRemove
        ].platform =
          action.payload.tokenParam[
            action.payload.tokenParam.length - 1
          ].platform
      } else {
        state.tokenList[action.payload.selectedAccount].push(
          action.payload.tokenParam[action.payload.tokenParam.length - 1],
        )
      }
    },
    reOderTokens(
      state: tokenListReducerState,
      action: PayloadAction<{
        tokenParam: Token[]
        selectedAccount: number
      }>,
    ) {
      const tokenAll = action.payload.tokenParam.concat(
        state.tokenHideList[action.payload.selectedAccount],
      )
      state.tokenList[action.payload.selectedAccount] = tokenAll
    },
    addTokenHide(
      state: tokenListReducerState,
      action: PayloadAction<{
        tokenHide: Token[]
        selectedAccount: number
      }>,
    ) {
      let tokens: { [accountIndex: number]: Token[] } = {}
      tokens[action.payload.selectedAccount] = action.payload.tokenHide
      Object.assign(state.tokenHideList, tokens)
    },
    removeToken(
      state: tokenListReducerState,
      action: PayloadAction<{
        token_id: string
        selectedAccount: number
      }>,
    ) {
      const indexItemRemove = state.tokenList[
        action.payload.selectedAccount
      ].findIndex((token) => {
        return token.token_id === action.payload.token_id
      })
      state.tokenList[action.payload.selectedAccount].splice(indexItemRemove, 1)
    },
    hideToken(
      state: tokenListReducerState,
      action: PayloadAction<{
        token_id?: string
        isHide?: boolean
        selectedAccount: number
      }>,
    ) {
      if (action.payload.token_id && action.payload.isHide !== undefined) {
        for (var key of Object.keys(
          state.tokenList[action.payload.selectedAccount],
        )) {
          if (
            state.tokenList[action.payload.selectedAccount][+key].token_id ===
            action.payload.token_id
          ) {
            state.tokenList[action.payload.selectedAccount][+key].isHide =
              action.payload.isHide
          }
        }
      } else {
        let platformsActive = []
        let platformsAll = []
        for (var key of Object.keys(
          state.tokenList[action.payload.selectedAccount],
        )) {
          let checkNetwork = 0
          for (var keyPlatform of Object.keys(
            state.tokenList[action.payload.selectedAccount][+key].platform,
          )) {
            if (
              state.tokenList[action.payload.selectedAccount][+key].platform[
                +keyPlatform
              ].networkName !== 'This network not supported yet!'
            ) {
              const previousEntry = platformsAll.find((network) => {
                return (
                  network.token_id ===
                  state.tokenList[action.payload.selectedAccount][+key]
                    .platform[+keyPlatform].token_id
                )
              })

              if (isEmpty(previousEntry)) {
                platformsAll.push(
                  state.tokenList[action.payload.selectedAccount][+key]
                    .platform[+keyPlatform],
                )
              }

              if (
                state.tokenList[action.payload.selectedAccount][+key].platform[
                  +keyPlatform
                ].isHide === false
              ) {
                platformsActive.push(
                  state.tokenList[action.payload.selectedAccount][+key]
                    .platform[+keyPlatform],
                )
                checkNetwork += 1
              }
            }
          }

          let networksActive: { [accountIndex: number]: TokenPlatform[] } = {}
          let networksAll: { [accountIndex: number]: TokenPlatform[] } = {}

          networksActive[action.payload.selectedAccount] = platformsActive
          networksAll[action.payload.selectedAccount] = platformsAll

          Object.assign(state.networkListActive, networksActive)
          Object.assign(state.networkListAll, networksAll)

          if (checkNetwork === 0) {
            state.tokenList[action.payload.selectedAccount][+key].isHide = true
          } else {
            state.tokenList[action.payload.selectedAccount][+key].isHide = false
          }
        }
      }
    },
    // hideNetwork(
    //   state: tokenListReducerState,
    //   action: PayloadAction<{
    //     token_id: string
    //     isHide: boolean
    //     selectedAccount: number
    //   }>,
    // ) {
    //   for (var keyX of Object.keys(
    //     state.tokenList[action.payload.selectedAccount],
    //   )) {
    //     for (var keyY of Object.keys(
    //       state.tokenList[action.payload.selectedAccount][+keyX].platform,
    //     )) {
    //       if (
    //         state.tokenList[action.payload.selectedAccount][+keyX].platform[
    //           +keyY
    //         ].token_id === action.payload.token_id
    //       ) {
    //         state.tokenList[action.payload.selectedAccount][+keyX].platform[
    //           +keyY
    //         ].isHide = action.payload.isHide
    //       }
    //     }
    //   }
    // },
    addDataAPI(state: tokenListReducerState, action: PayloadAction<any[]>) {
      state.dataAPI = action.payload
    },
    deleteAll(state: tokenListReducerState) {
      state.tokenList = defaultTokenListState.tokenList
      state.dataAPI = defaultTokenListState.dataAPI
      state.networkListActive = defaultTokenListState.networkListActive
      state.networkListAll = defaultTokenListState.networkListAll
      state.tokenHideList = defaultTokenListState.tokenHideList
      state.hideBalance = defaultTokenListState.hideBalance
    },
    // closeSelectedNetwork(state: tokenListReducerState) {
    //   state.isSelectedNetwork = false
    // },
    handleDislayBalance(state: tokenListReducerState) {
      state.hideBalance = !state.hideBalance
    },
    changeNetworkChoose(
      state: tokenListReducerState,
      action: PayloadAction<string>,
    ) {
      state.networkTypeChoose = action.payload
    },
    addTotalPrice(
      state: tokenListReducerState,
      action: PayloadAction<{ totalPrice: string; selectedAccount: number }>,
    ) {
      state.totalPrice[action.payload.selectedAccount] =
        action.payload.totalPrice
    },
  },
})

export const {
  reOderTokens,
  addTokens,
  hideToken,
  addToken,
  removeToken,
  addDataAPI,
  // hideNetwork,
  addTokenHide,
  deleteAll,
  // closeSelectedNetwork,
  handleDislayBalance,
  changeNetworkChoose,
  addTotalPrice,
} = TokenListSlice.actions
export const TokenListReducer = TokenListSlice.reducer
