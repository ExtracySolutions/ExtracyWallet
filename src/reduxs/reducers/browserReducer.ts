import { LIMIT_TABS_BROWSER, NetworkType } from '@extracy-wallet-controller'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { DappBrowsingHistory } from 'screens/DappHistory/models/DappBrowsingHistory'
import { DEFAULT_FREQUENT_RPC, ProviderConfig } from 'ultils'
import { v4 as uuidv4 } from 'uuid'

export type Tabs = {
  id: number
  url?: string
  image?: string
  incognito: boolean
  networkType: NetworkType
  selectedAccountIndex: number
  selectedNetworkID: string
  providerConfig: ProviderConfig
}
export interface Dapp {
  title: string
  description?: string
  image: string
  URL: string
  networkID: string
  networkType: NetworkType
}
export interface Bookmark {
  id?: string
  bookmarkName: string
  Dapp?: Dapp[]
}

export type History = {
  url: string
  name: string
}

type BrowserState = {
  tabs: Array<Tabs>
  activeTabId: number | null
  activeTabNonIncognitoId: number | null
  bookmarks: Bookmark[]
  history: Array<DappBrowsingHistory>
  showTab: boolean
  isTakePhoto: boolean
  isActiveTabIncognito: boolean
}

const defaultBrowserState: BrowserState = {
  activeTabId: null,
  activeTabNonIncognitoId: null,
  tabs: [],
  bookmarks: [{ bookmarkName: 'Favorite', Dapp: [], id: '0' }],
  history: [],
  showTab: false,
  isTakePhoto: false,
  isActiveTabIncognito: false,
}

const browserSlice = createSlice({
  name: 'browser',
  initialState: defaultBrowserState,
  reducers: {
    createNewTab(
      state: BrowserState,
      action: PayloadAction<{
        url: string
        networkID: string
        networkType: NetworkType
        accountIndex: number
        incognito?: boolean
      }>,
    ) {
      // limit 8 tab with queue
      if (state.tabs.length < LIMIT_TABS_BROWSER) {
        // create new ID
        const newID = Date.now()
        // select rpc base on networkID
        const RPC = DEFAULT_FREQUENT_RPC.find(
          (rpc) => rpc.token_id === action.payload.networkID,
        )

        if (RPC) {
          // add new tab
          const limitTabs = [
            ...state.tabs,
            {
              id: newID,
              incognito: action.payload.incognito ?? false,
              networkType: action.payload.networkType,
              selectedNetworkID: action.payload.networkID,
              selectedAccountIndex: action.payload.accountIndex,
              url: action.payload.url,
              providerConfig: {
                chainId: RPC.chainID,
                engineParams: {
                  pollingInterval: 20000,
                },
                nickname: RPC.nickname,
                rpcUrl: RPC.rpcUrl,
                ticker: RPC.symbol,
              },
            },
          ]
          state.tabs = limitTabs

          // set active tab after create
          state.activeTabId = newID
          let temp = action.payload.incognito ?? false
          if (temp === false) {
            state.activeTabNonIncognitoId = newID
          }

          if (action.payload.incognito) {
            state.isActiveTabIncognito = true
          } else {
            state.isActiveTabIncognito = false
          }
        }
      } else {
        throw new Error('Exceed the allowed tabs')
      }
    },
    updateTab(
      state: BrowserState,
      action: PayloadAction<{
        id: number
        url: string
        image?: string
        networkID?: string
      }>,
    ) {
      if (action.payload.networkID) {
        const RPC = DEFAULT_FREQUENT_RPC.find(
          (rpc) => rpc.token_id === action.payload.networkID,
        )

        if (RPC) {
          state.tabs = state.tabs.map((tab) => {
            if (tab.id === action.payload.id) {
              return {
                ...tab,
                ...{
                  url: action.payload.url,
                  image: action.payload.image,
                  selectedNetworkID: String(action.payload.networkID),
                  providerConfig: {
                    chainId: RPC.chainID,
                    engineParams: {
                      pollingInterval: 20000,
                    },
                    nickname: RPC.nickname,
                    rpcUrl: RPC.rpcUrl,
                    ticker: RPC.symbol,
                  },
                },
              }
            }
            return { ...tab }
          })
        }
      } else {
        state.tabs = state.tabs.map((tab) => {
          if (tab.id === action.payload.id) {
            return {
              ...tab,
              ...{
                url: action.payload.url,
                image: action.payload.image,
              },
            }
          }
          return { ...tab }
        })
      }
    },
    closeTab(
      state: BrowserState,
      action: PayloadAction<{ id: number; incognito: boolean }>,
    ) {
      // Get value item current active
      const valueItemActive = state.tabs.find(
        (item) => item.id === state.activeTabId,
      )
      state.tabs = state.tabs.filter((tab) => tab.id !== action.payload.id)

      // Find last value have the same type incognito tab active
      let lastIndexActive = state.tabs
        .map((item) => item.incognito)
        .lastIndexOf(action.payload.incognito)

      // If tabs closed the same type incognito tab current active don't have data
      if (lastIndexActive === -1) {
        lastIndexActive = state.tabs
          .map((item) => item.incognito)
          .lastIndexOf(!action.payload.incognito)
      }
      if (state.tabs.length < 1) {
        state.tabs = []
        state.showTab = false
      } else if (state.isActiveTabIncognito !== action.payload.incognito) {
        //Tab active different tab close

        // If incognito current tab active equal incognito tab closed
        if (valueItemActive?.incognito === action.payload.incognito) {
          state.activeTabId = state.tabs[lastIndexActive].id
        }
        state.isActiveTabIncognito =
          state.tabs[lastIndexActive].incognito || false
      } else if (
        state.tabs.findIndex((item) => state.activeTabId === item.id) === -1
      ) {
        // If closed the fisrt tab in the same type incognito
        state.activeTabId = state.tabs[lastIndexActive].id
      }
    },
    closeAllTab(state: BrowserState) {
      state.tabs = []
    },

    clearIncognitoTab(state: BrowserState) {
      let result = state.tabs.filter((item) => item.incognito === false)
      state.tabs = result
      if (result.length === 0) {
        state.tabs = []
      } else {
        state.activeTabId = state.activeTabNonIncognitoId
      }
    },

    addToBrowserHistory(
      state: BrowserState,
      action: PayloadAction<DappBrowsingHistory>,
    ) {
      if (!state.isActiveTabIncognito) {
        state.history = [action.payload, ...state.history]
      }
    },

    clearBrowserHistory(state: BrowserState) {
      state.history = []
    },

    toggleShowTabs(state: BrowserState, action: PayloadAction<boolean>) {
      state.showTab = action.payload
      state.isActiveTabIncognito =
        state.tabs.find((item) => item.id === state.activeTabId)?.incognito ||
        false
    },
    setActiveTabs(state: BrowserState, action: PayloadAction<{ id: number }>) {
      state.activeTabId = action.payload.id
      const index = state.tabs.findIndex((object) => {
        return object.id === action.payload.id
      })
      if (index >= 0) {
        if (state.tabs[index].incognito === false) {
          state.activeTabNonIncognitoId = state.tabs[index].id
          state.isActiveTabIncognito = false
        } else {
          state.isActiveTabIncognito = true
        }
      }
    },
    changeTakePhoto(
      state: BrowserState,
      action: PayloadAction<{ isTakePhoto: boolean }>,
    ) {
      state.isTakePhoto = action.payload.isTakePhoto
    },
    addBookmark(
      state: BrowserState,
      action: PayloadAction<{ bookmarkName: string; Dapp: Dapp[] }>,
    ) {
      const id = uuidv4()

      state.bookmarks.push({
        id: id,
        bookmarkName: action.payload.bookmarkName,
        Dapp: action.payload.Dapp,
      })
    },

    editBookmarkName(
      state: BrowserState,
      action: PayloadAction<{ bookmarkName: string; bookmarkId: string }>,
    ) {
      state.bookmarks = state.bookmarks.map((bookmark) =>
        bookmark.id === action.payload.bookmarkId
          ? { ...bookmark, bookmarkName: action.payload.bookmarkName }
          : bookmark,
      )
    },

    addDapp(
      state: BrowserState,
      action: PayloadAction<{ bookmarkId: string; Dapp: Dapp }>,
    ) {
      let count = 0
      const bookmarkFilter = state.bookmarks.filter(
        (bookmark) => bookmark.id === action.payload.bookmarkId,
      )

      bookmarkFilter[0].Dapp?.forEach((element) => {
        element.URL === action.payload.Dapp.URL && count++
      })
      if (count === 0) {
        state.bookmarks = state.bookmarks.map((bookmark) =>
          bookmark.id === action.payload.bookmarkId
            ? {
                ...bookmark,
                Dapp: bookmark.Dapp?.concat({
                  URL: action.payload.Dapp.URL,
                  description: action.payload.Dapp.description,
                  image: action.payload.Dapp.image,
                  title: action.payload.Dapp.title,
                  networkID: action.payload.Dapp.networkID,
                  networkType: action.payload.Dapp.networkType,
                }),
              }
            : bookmark,
        )
      } else {
        return
      }
    },

    removeBookmark(state: BrowserState, action: PayloadAction<string>) {
      const previousEntry = state.bookmarks.find(
        (bookmark) => bookmark.id === action.payload,
      )

      if (previousEntry) {
        // remove contact if exist
        const previousIndex = state.bookmarks.indexOf(previousEntry)
        if (previousIndex > -1) {
          state.bookmarks.splice(previousIndex, 1)
        }
      } else {
        throw new Error('Token not exist to delete')
      }
    },

    removeDapp(
      state: BrowserState,
      action: PayloadAction<{ bookmarkId: string; URL: string }>,
    ) {
      const newDapp: Dapp[] = []
      const previousBookmark = state.bookmarks.find(
        (bookmark) => bookmark.id === action.payload.bookmarkId,
      )
      if (previousBookmark?.Dapp) {
        // remove contact if exist
        previousBookmark.Dapp.forEach((dapp) => {
          if (dapp.URL === action.payload.URL) {
            return
          }
          newDapp.push(dapp)
        })
        state.bookmarks = state.bookmarks.map((bookmark) =>
          bookmark.id === action.payload.bookmarkId
            ? {
                ...bookmark,
                Dapp: newDapp,
              }
            : bookmark,
        )
      } else {
        throw new Error('Token not exist to delete')
      }
    },

    removeAllBookmark(state: BrowserState) {
      state.bookmarks = defaultBrowserState.bookmarks
    },

    // Dapp change network
    changeNetwork(
      state: BrowserState,
      action: PayloadAction<{ id: number; networkID: string }>,
    ) {
      const RPC = DEFAULT_FREQUENT_RPC.find(
        (rpc) => rpc.token_id === action.payload.networkID,
      )

      if (RPC) {
        const newTabList = state.tabs.map((tab) => {
          if (tab.id === action.payload.id) {
            return {
              ...tab,
              selectedNetworkID: RPC.token_id,
              providerConfig: {
                ...tab.providerConfig,
                chainId: RPC.chainID,
                rpcUrl: RPC.rpcUrl,
                nickname: RPC.nickname,
                ticker: RPC.symbol,
              },
            }
          }
          return tab
        })

        state.tabs = newTabList
      }
    },

    // Dapp change account
    changeAccount(
      state: BrowserState,
      action: PayloadAction<{ id: number; accountIndex: number }>,
    ) {
      const newTabList = state.tabs.map((tab) => {
        if (tab.id === action.payload.id) {
          return {
            ...tab,
            selectedAccountIndex: action.payload.accountIndex,
          }
        }
        return tab
      })
      state.tabs = newTabList
    },
  },
})

export const {
  addBookmark,
  addDapp,
  editBookmarkName,
  removeBookmark,
  removeDapp,
  addToBrowserHistory,
  clearBrowserHistory,
  closeAllTab,
  closeTab,
  createNewTab,
  removeAllBookmark,
  clearIncognitoTab,
  updateTab,
  toggleShowTabs,
  setActiveTabs,
  changeTakePhoto,
  changeAccount,
  changeNetwork,
} = browserSlice.actions

export const BrowserReducer = browserSlice.reducer
