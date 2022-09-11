import React, {
  FC,
  useCallback,
  useContext,
  useEffect,
  useState,
  useRef,
} from 'react'

import AsyncStorage from '@react-native-community/async-storage'
import NetInfo from '@react-native-community/netinfo'
import { storeVault, AsyncStorageKeys } from '@ultils'
import EntryScriptWeb3 from 'core/EntryScriptWeb3'
import { useBiometry, useAppDispatch } from 'hooks'
import { isEmpty } from 'lodash'
import { AppState, AppStateStatus } from 'react-native'
import { clearIncognitoTab } from 'reduxs/reducers'

import Engine from '../core/Engine'

export type WalletProviderProps = {}

type ProviderContextType = {
  loading: boolean
  isConnected: boolean
  canOpenWallet: boolean
  showLockScreen: boolean
  handleOpenWallet: () => void
  handleRemoveWallet: () => void
  handleNoInternet: () => void
  handleShowLockScreen: (lock: boolean) => void
  handleCreateWallet: (mnemonic: string, password: string) => Promise<void>
  // InitApp: () => Promise<void>
}

const ProviderContext = React.createContext<ProviderContextType>(null!)

export const WalletProvider: FC<WalletProviderProps> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(true)
  const [canOpenWallet, setOpenWallet] = useState<boolean>(false)
  const [isConnected, setConnected] = useState<boolean>(true)
  const [showLockScreen, setShowLockScreen] = useState(false)

  const appState = useRef(AppState.currentState)
  const {
    getKeychainPassword,
    hasKeychainPassword,
    clearKeychainPassword,
    passwordConfig,
    PASSWORD_KEYCHAIN_NAME,
  } = useBiometry()
  const dispatch = useAppDispatch()

  const handleOpenWallet = useCallback(() => {
    setOpenWallet(true)
  }, [])

  const handleRemoveWallet = useCallback(() => {
    setOpenWallet(false)
  }, [])

  const handleShowLockScreen = useCallback((lock: boolean) => {
    setShowLockScreen(lock)
  }, [])

  const handleNoInternet = () => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      state.isConnected !== null && setConnected(state.isConnected)
    })
    return () => {
      unsubscribe()
    }
  }

  const handleCreateWallet = useCallback(
    async (mnemonic: string, password: string) => {
      try {
        console.log('handleCreateWallet [1]')
        setLoading(true)
        if (Engine.context && Engine.context.KeyringController) {
          console.log('handleCreateWallet [2]')
          await Engine.context.KeyringController?.createNewVaultAndRestore(
            password,
            mnemonic,
          )
          console.log('handleCreateWallet [3]')
          const { vault } = Engine.context.KeyringController?.state
          console.log('handleCreateWallet [4]')
          if (vault) {
            await storeVault(vault)
          }
        }
        handleOpenWallet()
        handleShowLockScreen(false)
        setLoading(false)
      } catch (error) {
        setLoading(false)
        throw new Error('Create wallet error')
      }
    },
    [handleOpenWallet, handleShowLockScreen],
  )

  /**
   * Init provider
   */
  const handleInitProvider = useCallback(async () => {
    console.log('handleInitProvider [1]')
    try {
      const hasLaunched = await AsyncStorage.getItem(
        AsyncStorageKeys.hasLaunched,
      )
      const hasKeychain = await hasKeychainPassword()
      // if not first launch => reset keychain
      if (!isEmpty(hasLaunched)) {
        if (hasKeychain) {
          await clearKeychainPassword()
          // await AsyncStorage.clear()
        }
        await AsyncStorage.setItem(AsyncStorageKeys.hasLaunched, 'true')
        handleShowLockScreen(false)
      } else {
        handleShowLockScreen(false)
      }

      const { KeyringController } = Engine.context
      const keychainPasscode = await getKeychainPassword(
        passwordConfig,
        PASSWORD_KEYCHAIN_NAME,
      )
      console.log('handleInitProvider [2]')
      await KeyringController?.submitPassword(keychainPasscode ?? '')
      console.log('handleInitProvider [3]')
      setOpenWallet(true)
    } catch (e) {
      setOpenWallet(false)
      console.log(e, 'error while trying to add a new account')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  //Init app
  // const InitApp = useCallback(async () => {
  //   requestAnimationFrame(async () => {
  //     //================
  //     // Init provider =
  //     //================
  //     handleInitProvider()
  //       .then(() => {
  //         setLoading(false)
  //       })
  //       .catch((error) => {
  //         console.log('Init provider :', error)
  //       })
  //     //=======================
  //     // Init EntryScriptWeb3 =
  //     //=======================
  //     await EntryScriptWeb3.init()
  //   })
  // }, [handleInitProvider])
  useEffect(() => {
    requestAnimationFrame(async () => {
      //================
      // Init provider =
      //================
      handleInitProvider()
        .then(() => {
          setLoading(false)
        })
        .catch((error) => {
          console.log('Init provider :', error)
        })
      //=======================
      // Init EntryScriptWeb3 =
      //=======================
      await EntryScriptWeb3.init()
    })
  }, [handleInitProvider])

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    const { TokenBalancesController } = Engine.context

    if (appState.current === 'unknown' && nextAppState === 'active') {
      // remove incognito tabs
      dispatch(clearIncognitoTab())
    }
    if (appState.current === 'background' && nextAppState === 'active') {
      handleShowLockScreen(true)
    }
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      TokenBalancesController?.configure({ disabled: false }, false, false)
    } else {
      TokenBalancesController?.configure({ disabled: true }, false, false)
    }

    appState.current = nextAppState
  }

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange)

    return () => {
      AppState.removeEventListener('change', handleAppStateChange)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <ProviderContext.Provider
      value={{
        loading,
        isConnected,
        canOpenWallet,
        showLockScreen,
        handleOpenWallet,
        handleRemoveWallet,
        handleCreateWallet,
        handleNoInternet,
        handleShowLockScreen,
        // InitApp,
      }}
    >
      {children}
    </ProviderContext.Provider>
  )
}

export function useProvider(): ProviderContextType {
  const context = useContext(ProviderContext)
  if (!context) {
    throw new Error('Missing provider context')
  }
  return context
}
