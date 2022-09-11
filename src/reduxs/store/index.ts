import AsyncStorage from '@react-native-community/async-storage'
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import EngineService from 'core/EngineService'
// import EncryptedStorage from 'react-native-encrypted-storage'
import { combineReducers } from 'redux'
import {
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  persistReducer,
} from 'redux-persist'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'

import {
  AuthReducer,
  ThemeReducer,
  EngineReducer,
  TokenPlatformReducer,
  OpenWalletReducer,
  AppSettingReducer,
  ContactReducer,
  BrowserReducer,
  PrivacyReducer,
  TokenListReducer,
  AddTokenReducer,
  OnBoardingReducer,
  NotLoginReducer,
} from '../reducers'
// import rootSaga from '../saga'
import { PriceTokenApi, GasTrackerApi, ListSearchTokenApi } from '../services'
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  timeout: 30000,
  whitelist: ['engine', 'browser', 'privacy', 'tokenList', 'notLogin'],
  stateReconciler: autoMergeLevel2,
}

const rootReducer = combineReducers({
  auth: AuthReducer,
  theme: ThemeReducer,
  engine: EngineReducer,
  tokenPlatformReducer: TokenPlatformReducer,
  openWalletReducer: OpenWalletReducer,
  setting: AppSettingReducer,
  contact: ContactReducer,
  browser: BrowserReducer,
  privacy: PrivacyReducer,
  tokenList: TokenListReducer,
  addTokenList: AddTokenReducer,
  onboarding: OnBoardingReducer,
  notLogin: NotLoginReducer,
  // ...other reducers here
})

export type RootState = ReturnType<typeof rootReducer>

const persistedReducer = persistReducer<RootState>(persistConfig, rootReducer)

let middleware = [
  ...getDefaultMiddleware({
    thunk: true,
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }),
]
if (__DEV__) {
  const createDebugger = require('redux-flipper').default
  middleware.push(createDebugger())
}

const store = configureStore({
  reducer: {
    root: persistedReducer,
    [GasTrackerApi.reducerPath]: GasTrackerApi.reducer,
    [PriceTokenApi.reducerPath]: PriceTokenApi.reducer,
    [ListSearchTokenApi.reducerPath]: ListSearchTokenApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(middleware)
      .concat(GasTrackerApi.middleware)
      .concat(PriceTokenApi.middleware)
      .concat(ListSearchTokenApi.middleware),
})

setupListeners(store.dispatch)
/**
 * Initialize services after persist is completed
 */
const onPersistComplete = () => {
  EngineService.initalizeEngine(store)
}

const persistor = persistStore(store, null, onPersistComplete)

export { store, persistor }
