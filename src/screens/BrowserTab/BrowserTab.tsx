import EventEmitter from 'events'

import React, {
  FC,
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react'

import {
  ToastPayload,
  DappSearch,
  BottomSheet,
  Text,
  Modalize,
  TextInput,
  Container,
  Button,
} from '@components'
import {
  Transaction,
  NetworkType,
  FrequentRpc,
  Identity,
} from '@extracy-wallet-controller'
import { useAppSelector, useAppDispatch } from '@hooks'
import crashlytics from '@react-native-firebase/crashlytics'
import { useNavigation } from '@react-navigation/native'
import { makeStyles, useTheme } from '@themes'
import {
  SPA_urlChangeListener,
  JS_WEBVIEW_URL,
  blockTagParamIndex,
  SEARRCHPAGE_URL,
  keyExtractor,
  HOMEPAGE_URL,
  DEFAULT_FREQUENT_RPC,
  NOTIFICATION_NAMES,
} from '@ultils'
import { FavoriteIcon, FolderIcon, SearchIcon } from 'assets'
import { BackgroundBridge } from 'core/BackgroundBridge'
import DappBottomContext from 'core/DappBottomTabContext'
import EntryScriptWeb3 from 'core/EntryScriptWeb3'
import { ethErrors } from 'eth-rpc-errors'
import { createAsyncMiddleware } from 'json-rpc-engine'
import { isEqual, isEmpty } from 'lodash'
import {
  View,
  Dimensions,
  KeyboardAvoidingView,
  TouchableOpacity,
  TextInput as RNTextInput,
  FlatList,
  Platform,
} from 'react-native'
import * as Progress from 'react-native-progress'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { WebView } from 'react-native-webview'
import {
  WebViewErrorEvent,
  WebViewNavigationEvent,
  WebViewMessageEvent,
} from 'react-native-webview/lib/WebViewTypes'
import { store } from 'reduxs/store'
import { DappBrowsingHistory } from 'screens'
import URL from 'url-parse'
import { toHex } from 'web3-utils'

import Engine from '../../core/Engine'
import {
  addBookmark,
  addDapp,
  addToBrowserHistory,
  setApproveHost,
  updateTab,
  Bookmark,
  changeNetwork,
  changeAccount,
} from '../../reduxs/reducers'
import { RootRPCMethodsUI } from '../RootRPCMethodsUI'

type WebViewMessageData = {
  type: string
  name: string
  origin: string
  data: any
  payload: {
    url: string
    dAppData: {
      data: {
        title: string
        description: string
        URL: string
        image: string
        networkID: string
        networkType: NetworkType
        chainID: string
      }
    }
  }
}

export type BrowserTabProps = {
  tabID: number
  initialURL: string
  incognito: boolean
  showTabs: () => void
  updateTabBrowser: ({
    tabID,
    url,
  }: {
    tabID: number
    url: string
  }) => Promise<void>
}

const ApprovalEmitter = new EventEmitter()

// ApprovalEmitter.setMaxListeners(200)

const { width: MAX_WIDTH, height: MAX_HEIGHT } = Dimensions.get('screen')
const keyboardVerticalOffset = Platform.OS === 'ios' ? 'padding' : 'height'

const BrowserTab: FC<BrowserTabProps> = (props) => {
  const themeStore = useAppSelector((state) => state.root.theme.theme)

  const theme = useTheme(themeStore)
  const { activeTabId, showTab, tabs } = useAppSelector(
    (state) => state.root.browser,
  )
  const { approveHosts } = useAppSelector((state) => state.root.privacy)
  const styles = useStyles(props, themeStore)
  const dispatch = useAppDispatch()
  const insets = useSafeAreaInsets()
  const navigation = useNavigation()

  const { initialURL, tabID, incognito, showTabs, updateTabBrowser } = props

  //==================
  // declare variables
  //==================

  const url = useRef('')
  // const title = useRef('')
  // const icon = useRef('')
  const [origin, setOrigin] = useState('')
  const [originIcon, setOriginIcon] = useState('')
  const webviewRef = useRef<WebView>(null)
  let backgroundBridges = useRef<BackgroundBridge | null>(null)
  const webviewUrlPostMessagePromiseResolve = useRef(null)
  const approvalRequest = useRef<{
    resolve:(value: unknown) => void
    reject: (reason?: any) => void
  }>()
  const modalizeRef = useRef<Modalize>(null)
  const inputTextRef = useRef<RNTextInput>(null)
  let canGoBack = useRef<boolean>(false)
  let canGoForward = useRef<boolean>(false)

  const [entryScriptWeb3, setEntryScriptWeb3] = useState<string>('')
  const [loadingProgress, setLoadingProgress] = useState<number>(0)
  const [initURL, setInitURL] = useState<string>('')
  const [searchText, setSearchText] = useState<string>('')
  const [nameInput, setName] = useState<string>('')
  const [searchInputBS, setSearchBS] = useState<string>('')
  const [bookmarkList, setBookmarkList] = useState<any>([])
  const [isFocus, setFocus] = useState<boolean>(false)
  const [isFocusSearch, setFocusSearch] = useState<boolean>(false)
  const [colorPlaceholder, setColor] = useState<string>(theme.colors.black)
  const [dappTitle, setTitle] = useState<string>('')
  const [URLState, setURL] = useState<string>('')
  const [isLoading, setLoading] = useState<boolean>(true)
  const [selectedNetworkInfo, setSelectedNetworkInfo] = useState<{
    networkID: string
    networkType: NetworkType
    symbol: string
    chainID: string
    nickname: string
  }>()

  const bookmarkRedux = useAppSelector((state) => state.root.browser.bookmarks)

  // if this tab is active tab
  const isActiveTab = useMemo(() => activeTabId === tabID, [activeTabId, tabID])

  useEffect(() => {
    const getEntryScriptWeb3 = async () => {
      const entryScriptWeb3 = await EntryScriptWeb3.get()
      setEntryScriptWeb3(entryScriptWeb3 + SPA_urlChangeListener)
    }
    getEntryScriptWeb3()
    isFocus
      ? setColor(theme.colors.disabled)
      : (setName(''), setColor(theme.colors.black))
  }, [
    bookmarkList,
    bookmarkRedux,
    isFocus,
    origin,
    searchText,
    tabID,
    theme.colors.black,
    theme.colors.disabled,
  ])

  const handleSearchFolder = useCallback(() => {
    const newList = bookmarkRedux?.filter((value: Bookmark) => {
      return value.bookmarkName.toLowerCase().match(searchInputBS.toLowerCase())
    })
    setBookmarkList(newList)
  }, [bookmarkRedux, searchInputBS])

  useEffect(() => {
    const reduxStoreListener = store.subscribe(() => {})
    return reduxStoreListener
  })

  const handleGetNetworkInfoById = useCallback((tabID: number) => {
    const tab = store
      .getState()
      .root.browser.tabs.find((tab) => tab.id === tabID)

    const rpcInfo = DEFAULT_FREQUENT_RPC.find(
      (rpc) => rpc.token_id === tab?.selectedNetworkID,
    )

    return {
      networkID: rpcInfo?.token_id,
      networkType: rpcInfo?.type,
      symbol: rpcInfo?.symbol,
      chainID: rpcInfo?.chainID,
      nickname: rpcInfo?.nickname,
    }
  }, [])

  /**
   * Handle RPC methods called by dapp
   */
  const getRpcMethodMiddleware = useCallback(
    ({ hostname }) =>
      // all user facing RPC calls not implemented by the provider
      createAsyncMiddleware(async (req, res, next) => {
        const getAccounts = async () => {
          // get current tab  from store redux
          const tab = store
            .getState()
            .root.browser.tabs.find((tab) => tab.id === tabID)

          if (tab) {
            return Engine.context.PreferencesController?.state.identities[
              tab.selectedAccountIndex
            ].addresses[tab.networkType]
          }
        }

        const getNetworkInfo = async () => {
          return handleGetNetworkInfoById(tabID)
        }
        const rpcMethods = {
          eth_sendTransaction: async () => {
            const { params } = req
            const { TransactionController, TokenBalancesController } =
              Engine.context

            if (TransactionController) {
              try {
                crashlytics().log('User send transaction with browser ')

                const selectedNetwork = await getNetworkInfo()

                await crashlytics().setAttribute(
                  'User send transaction with raw transaction',
                  //@ts-ignore
                  JSON.stringify(params[0]),
                )
                const accountIndex = store
                  .getState()
                  .root.browser.tabs.find(
                    (tab) => tab.id === tabID,
                  )?.selectedAccountIndex

                const { result: transactionHashPromise, transactionMeta } =
                  await TransactionController?.addTransaction(
                    //@ts-ignore
                    selectedNetwork?.networkType,
                    selectedNetwork?.networkID,
                    selectedNetwork?.symbol,
                    //@ts-ignore
                    params[0] as Transaction<NetworkType.ERC20>,
                    hostname,
                    Number(accountIndex),
                  )

                // Promise waiting for transaction confirmation
                const transactionHash = await transactionHashPromise.catch(
                  (error) => {
                    console.log('[ERROR]', error)
                    res.error = error.message
                  },
                )

                if (transactionHash) {
                  await crashlytics().setAttribute(
                    'User send transaction success with transactionHash',
                    JSON.stringify(transactionHash),
                  )

                  // update balance after transaction done
                  TokenBalancesController?.updateBalances()

                  // eslint-disable-next-line no-undef
                  toast.show('', {
                    data: {
                      type: 'completed',
                      nounce: transactionMeta.transaction.nonce,
                      transactionHash,
                    } as ToastPayload,
                  })

                  res.result = transactionHash
                }
              } catch (error) {
                crashlytics().recordError(error as Error)
                res.error = ethErrors.provider.userRejectedRequest(
                  'Transaction failed !',
                )
              }
            }
          },
          eth_getTransactionByHash: async () => {
            console.log('[eth_getTransactionByHash]')
            // res.result = await polyfillGasPrice('getTransactionByHash', req.params);
          },
          eth_getTransactionByBlockHashAndIndex: async () => {
            console.log('[eth_getTransactionByBlockHashAndIndex]')
            // res.result = await polyfillGasPrice('getTransactionByBlockHashAndIndex', req.params);
          },
          eth_getTransactionByBlockNumberAndIndex: async () => {
            console.log('[eth_getTransactionByBlockNumberAndIndex]')
            // res.result = await polyfillGasPrice('getTransactionByBlockNumberAndIndex', req.params);
          },
          eth_chainId: async () => {
            // console.log('[eth_chainId]')
            const selectedNetwork = await getNetworkInfo()

            res.result = toHex(String(selectedNetwork?.chainID))
          },
          net_version: async () => {
            console.log('[net_version]', req)
            // const { networkType } = props;
            // const isInitialNetwork = networkType && getAllNetworks().includes(networkType);
            // if (isInitialNetwork) {
            //   res.result = Networks[networkType].networkId;
            // } else {
            //   return next();
            // }
          },
          eth_requestAccounts: async () => {
            console.log('[eth_requestAccounts]')

            const selectedAddress = await getAccounts()

            if (approveHosts[hostname]) {
              res.result = [selectedAddress]
            } else {
              ApprovalEmitter?.emit('connect_to_dapp')
              const approved = await new Promise((resolve, reject) => {
                approvalRequest.current = { resolve, reject }
              })
              console.log('[approved]', approved)
              if (approved) {
                res.result = selectedAddress ? [selectedAddress] : []
                dispatch(setApproveHost({ hostname: hostname }))
              } else {
                res.error = ethErrors.provider.userRejectedRequest(
                  'User denied account authorization.',
                )
              }
            }
          },
          eth_accounts: async () => {
            const selectedAddress = await getAccounts()

            res.result = selectedAddress ? [selectedAddress] : []
          },
          eth_coinbase: async () => {
            console.log('[eth_coinbase]')
            // const accounts = await getAccounts();
            // res.result = accounts.length > 0 ? accounts[0] : null;
          },
          eth_sign: async () => {
            console.log('[eth_sign]')
            // const { MessageManager } = Engine.context;
            // const pageMeta = {
            //   meta: {
            //     url: url.current,
            //     title: title.current,
            //     icon: icon.current,
            //   },
            // };
            // const rawSig = await MessageManager.addUnapprovedMessageAsync({
            //   data: req.params[1],
            //   from: req.params[0],
            //   ...pageMeta,
            // });
            // res.result = rawSig;
          },
          personal_sign: async () => {
            console.log('[personal_sign]')
            // const { PersonalMessageManager } = Engine.context;
            // const firstParam = req.params[0];
            // const secondParam = req.params[1];
            // const params = {
            //   data: firstParam,
            //   from: secondParam,
            // };
            // if (resemblesAddress(firstParam) && !resemblesAddress(secondParam)) {
            //   params.data = secondParam;
            //   params.from = firstParam;
            // }
            // const pageMeta = {
            //   meta: {
            //     url: url.current,
            //     title: title.current,
            //     icon: icon.current,
            //   },
            // };
            // const rawSig = await PersonalMessageManager.addUnapprovedMessageAsync({
            //   ...params,
            //   ...pageMeta,
            // });
            // res.result = rawSig;
          },
          eth_signTypedData: async () => {
            console.log('[eth_signTypedData]')
            // const { TypedMessageManager } = Engine.context;
            // const pageMeta = {
            //   meta: {
            //     url: url.current,
            //     title: title.current,
            //     icon: icon.current,
            //   },
            // };
            // const rawSig = await TypedMessageManager.addUnapprovedMessageAsync(
            //   {
            //     data: req.params[0],
            //     from: req.params[1],
            //     ...pageMeta,
            //   },
            //   'V1'
            // );
            // res.result = rawSig;
          },
          eth_signTypedData_v3: async () => {
            console.log('[eth_signTypedData_v3]')
            // const { TypedMessageManager } = Engine.context;
            // const data = JSON.parse(req.params[1]);
            // const chainId = data.domain.chainId;
            // const activeChainId =
            //   props.networkType === RPC ? props.network : Networks[props.networkType].networkId;
            // // eslint-disable-next-line
            // if (chainId && chainId != activeChainId) {
            //   throw ethErrors.rpc.invalidRequest(
            //     `Provided chainId (${chainId}) must match the active chainId (${activeChainId})`
            //   );
            // }
            // const pageMeta = {
            //   meta: {
            //     url: url.current,
            //     title: title.current,
            //     icon: icon.current,
            //   },
            // };
            // const rawSig = await TypedMessageManager.addUnapprovedMessageAsync(
            //   {
            //     data: req.params[1],
            //     from: req.params[0],
            //     ...pageMeta,
            //   },
            //   'V3'
            // );
            // res.result = rawSig;
          },
          eth_signTypedData_v4: async () => {
            console.log('[eth_signTypedData_v4]')
            // const { TypedMessageManager } = Engine.context;
            // const data = JSON.parse(req.params[1]);
            // const chainId = data.domain.chainId;
            // const activeChainId =
            //   props.networkType === RPC ? props.network : Networks[props.networkType].networkId;
            // // eslint-disable-next-line eqeqeq
            // if (chainId && chainId != activeChainId) {
            //   throw ethErrors.rpc.invalidRequest(
            //     `Provided chainId (${chainId}) must match the active chainId (${activeChainId})`
            //   );
            // }
            // const pageMeta = {
            //   meta: {
            //     url: url.current,
            //     title: title.current,
            //     icon: icon.current,
            //   },
            // };
            // const rawSig = await TypedMessageManager.addUnapprovedMessageAsync(
            //   {
            //     data: req.params[1],
            //     from: req.params[0],
            //     ...pageMeta,
            //   },
            //   'V4'
            // );
            // res.result = rawSig;
          },
          web3_clientVersion: async () => {
            console.log('[web3_clientVersion]')
            // let version = appVersion;
            // if (!version) {
            //   appVersion = await getVersion();
            //   version = appVersion;
            // }
          },
          wallet_scanQRCode: () =>
            new Promise(() => {
              console.log('[wallet_scanQRCode]')
              // props.navigation.navigate('QRScanner', {
              //   onScanSuccess: (data) => {
              //     const regex = new RegExp(req.params[0]);
              //     if (regex && !regex.exec(data)) {
              //       reject({ message: 'NO_REGEX_MATCH', data });
              //     } else if (!regex && !/^(0x){1}[0-9a-fA-F]{40}$/i.exec(data.target_address)) {
              //       reject({ message: 'INVALID_ETHEREUM_ADDRESS', data: data.target_address });
              //     }
              //     let result = data;
              //     if (data.target_address) {
              //       result = data.target_address;
              //     } else if (data.scheme) {
              //       result = JSON.stringify(data);
              //     }
              //     res.result = result;
              //     resolve();
              //   },
              //   onScanError: (e) => {
              //     throw ethErrors.rpc.internal(e.toString());
              //   },
              // });
            }),
          wallet_watchAsset: async () => {
            console.log('[wallet_watchAsset]')
            // const {
            //   params: {
            //     options: { address, decimals, image, symbol },
            //     type,
            //   },
            // } = req;
            // const { TokensController } = Engine.context;
            // const suggestionResult = await TokensController.watchAsset(
            //   { address, symbol, decimals, image },
            //   type
            // );
            // res.result = suggestionResult.result;
          },
          metamask_removeFavorite: async () => {
            console.log('[metamask_removeFavorite]')
            // if (!isHomepage()) {
            //   throw ethErrors.provider.unauthorized('Forbidden.');
            // }
            // Alert.alert(strings('browser.remove_bookmark_title'), strings('browser.remove_bookmark_msg'), [
            //   {
            //     text: strings('browser.cancel'),
            //     onPress: () => {
            //       res.result = {
            //         favorites: props.bookmarks,
            //       };
            //     },
            //     style: 'cancel',
            //   },
            //   {
            //     text: strings('browser.yes'),
            //     onPress: () => {
            //       const bookmark = { url: req.params[0] };
            //       props.removeBookmark(bookmark);
            //       res.result = {
            //         favorites: props.bookmarks,
            //       };
            //     },
            //   },
            // ]);
          },
          metamask_showTutorial: async () => {
            console.log('[metamask_showTutorial]')
            // wizardScrollAdjusted = false;
            // props.setOnboardingWizardStep(1);
            // props.navigation.navigate('WalletView');
            // res.result = true;
          },
          metamask_showAutocomplete: async () => {
            console.log('[metamask_showAutocomplete]')
            // fromHomepage.current = true;
            // setAutocompleteValue('');
            // setShowUrlModal(true);
            // setTimeout(() => {
            //   fromHomepage.current = false;
            // }, 1500);
            // res.result = true;
          },
          /**
           * This method is used by the inpage provider to get its state on
           * initialization.
           */
          metamask_getProviderState: async () => {
            const selectedAddress = await getAccounts()
            const selectedNetwork = await getNetworkInfo()
            res.result = {
              // ...getProviderState(),
              isUnlocked: true,
              chainId: toHex(String(selectedNetwork?.chainID)),
              accounts: selectedAddress ? [selectedAddress] : [],
            }
          },
          /**
           * This method is sent by the window.web3 shim. It can be used to
           * record web3 shim usage metrics. These metrics are already collected
           * in the extension, and can optionally be added to mobile as well.
           *
           * For now, we need to respond to this method to not throw errors on
           * the page, and we implement it as a no-op.
           */
          // metamask_logWeb3ShimUsage: () => (res.result = null),
          wallet_addEthereumChain: () => {
            // const { params } = req
            // //@ts-ignore
            // const chainId = toDecimal(String(params[0].chainId)).toString()
            // const networkId = getNetworkIdByChainId({ chainID: chainId })
            // if (networkId) {
            //   Engine.context.DappManagerController?.changeNetwork({
            //     id: tabID,
            //     networkID: networkId,
            //   }).then(() => {
            //     webviewRef.current?.reload()
            //   })
            //   res.result = toHex(String(chainId))
            // }
          },
          wallet_switchEthereumChain: () => {
            // TODO: check this to change network
            // const { params } = req
            // const chainId = toDecimal(String(params[0].chainId)).toString()
            // const networkId = getNetworkIdByChainId({ chainID: chainId })
            // if (networkId) {
            //   Engine.context.DappManagerController?.changeNetwork({
            //     id: tabID,
            //     networkID: networkId,
            //   }).then(() => {
            //     backgroundBridges.current.forEach((bridge) => {
            //       bridge.sendNotification({
            //         method: NOTIFICATION_NAMES.chainChanged,
            //         params: {
            //           chainId: toHex(networkId),
            //         },
            //       })
            //     })
            //     webviewRef.current?.reload()
            //   })
            //   res.result = toHex(String(chainId))
            // }
          },
        }
        //
        const blockRefIndex = blockTagParamIndex(req)
        //@ts-ignore
        const blockRef = req.params?.[blockRefIndex]
        // omitted blockRef implies "latest"
        if (blockRef === undefined) {
          //@ts-ignore
          req.params[blockRefIndex] === 'lastest'
        }
        //@ts-ignore
        if (!rpcMethods[req.method]) {
          return next()
        }
        //@ts-ignore
        await rpcMethods[req.method]()
      }),
    [approveHosts, dispatch, handleGetNetworkInfoById, tabID],
  )

  const initializeBackgroundBridge = useCallback(
    async (url: string, isMainFrame: boolean) => {
      const selectedTab = tabs.find((tab) => tab.id === tabID)

      const newBridge = new BackgroundBridge({
        webview: webviewRef,
        url,
        getRpcMethodMiddleware,
        isMainFrame,
        providerConfig: selectedTab?.providerConfig,
      })

      backgroundBridges.current = newBridge
      // Init DappBottomContext
      if (!DappBottomContext.context) {
        DappBottomContext.init()
      }
    },
    [getRpcMethodMiddleware, tabID, tabs],
  )

  /**
   * Website started to load
   */
  const onLoadStart = useCallback(
    ({ nativeEvent }: WebViewNavigationEvent) => {
      const { href } = new URL(nativeEvent.url)
      setSearchText(href)
      setURL(href)

      //=========
      // tracking phishing here (track black list)
      //=========

      webviewUrlPostMessagePromiseResolve.current = null
      if (isActiveTab) {
        updateTabBrowser({ tabID, url: nativeEvent.url })
        dispatch(
          updateTab({
            id: tabID,
            url: nativeEvent.url,
          }),
        )
      }

      // Reset the previous bridges
      // TODO: SEEM LIKE FUNCTION onDisconnect() not work
      backgroundBridges.current?.onDisconnect()

      const origin = new URL(nativeEvent.url).origin
      initializeBackgroundBridge(origin, true)
    },
    [
      dispatch,
      initializeBackgroundBridge,
      isActiveTab,
      tabID,
      updateTabBrowser,
    ],
  )

  const handleNavigationEventStateChange = useCallback(
    async (state: any) => {
      if (activeTabId) {
        canGoBack.current = state.canGoBack
        canGoForward.current = state.canGoForward

        await DappBottomContext.context.onUpdateNavigateStatus({
          activeTabID: Number(activeTabId),
          canGoBack: canGoBack.current,
          canGoForward: canGoForward.current,
        })
      }
    },
    [activeTabId],
  )

  const goBack = useCallback(() => {
    webviewRef.current?.goBack()
  }, [])

  const goForward = useCallback(() => {
    webviewRef.current?.goForward()
  }, [])

  const handleChangeNetwork = useCallback(
    (network: FrequentRpc) => {
      backgroundBridges.current?.sendNotification({
        method: NOTIFICATION_NAMES.chainChanged,
        params: {
          chainId: network.chainID,
        },
      })

      dispatch(
        changeNetwork({
          id: Number(activeTabId),
          networkID: network.token_id,
        }),
      )
      webviewRef.current?.reload()
    },
    [activeTabId, dispatch],
  )

  const handleChangeAccount = useCallback(
    (account: Identity) => {
      if (DappBottomContext.context) {
        // TODO: hard code erc20 here remember clean it
        dispatch(
          changeAccount({
            id: Number(activeTabId),
            accountIndex: account.accountIndex,
          }),
        )
        const selectedAddress = account.addresses[NetworkType.ERC20]

        backgroundBridges.current?.sendNotification({
          method: NOTIFICATION_NAMES.accountsChanged,
          params: [selectedAddress],
        })
      }
    },
    [activeTabId, dispatch],
  )

  /**
   * Update backgroundBridge and webviewRef for bottom tab
   */
  const handleUpdateForBottomtab = useCallback(async () => {
    if (activeTabId === tabID) {
      if (webviewRef.current && backgroundBridges.current) {
        await DappBottomContext.context.onUpdateNetworkCallBack(
          handleChangeNetwork,
          activeTabId,
        )
        await DappBottomContext.context.onUpdateAccountCallBack(
          handleChangeAccount,
          activeTabId,
        )
        await DappBottomContext.context.onUpdateNavigateCallback({
          activeTabID: activeTabId,
          onBack: goBack,
          onForward: goForward,
        })
      }
    }
  }, [
    activeTabId,
    goBack,
    goForward,
    handleChangeAccount,
    handleChangeNetwork,
    tabID,
  ])

  const onLoadEnd = useCallback(
    ({ nativeEvent }: WebViewNavigationEvent | WebViewErrorEvent) => {
      if (nativeEvent.loading) {
        return
      }

      const { hostname, href } = new URL(nativeEvent.url)

      const { current } = webviewRef

      current && current.injectJavaScript(JS_WEBVIEW_URL)

      const promiseResolver = (resolve: any) => {
        webviewUrlPostMessagePromiseResolve.current = resolve
      }

      const promise = current
        ? new Promise(promiseResolver)
        : Promise.resolve(url.current)

      //@ts-ignore
      promise.then((info: { url: string; icon: string }) => {
        if (info.url === nativeEvent.url) {
          setLoading(false)
          setOrigin(hostname)
          setOriginIcon(info.icon)
          setURL(href)
        }

        let date = new Date()
        date.setHours(0, 0, 0, 0)
        let dateStr = date.toISOString()

        let history: DappBrowsingHistory = {
          date: dateStr,
          url: nativeEvent.url,
          imageUrl: info.icon,
        }
        dispatch(addToBrowserHistory(history))
      })

      setTitle(nativeEvent.title)
      const selectedNetworkInfoUpdate = handleGetNetworkInfoById(Number(tabID))
      //@ts-ignore
      setSelectedNetworkInfo(selectedNetworkInfoUpdate)
      handleUpdateForBottomtab()
    },
    [dispatch, handleGetNetworkInfoById, handleUpdateForBottomtab, tabID],
  )

  const onMessage = useCallback(
    ({ nativeEvent }: WebViewMessageEvent) => {
      let data: WebViewMessageData

      try {
        data =
          typeof nativeEvent.data === 'string'
            ? JSON.parse(nativeEvent.data)
            : (nativeEvent.data as WebViewMessageData)
        console.log('[onMessage]', data)
        if (!data || (!data.type && !data.name)) {
          return
        }
        if (data.name) {
          if (backgroundBridges.current?.isMainFrame) {
            const { origin } = new URL(data.origin)

            backgroundBridges.current?.url === origin &&
              backgroundBridges.current?.onMessage(data)
          } else {
            backgroundBridges.current?.url === data.origin &&
              backgroundBridges.current?.onMessage(data)
          }

          return
        }

        switch (data.type) {
          case 'GET_WEBVIEW_URL': {
            const { url } = data.payload
            if (url === nativeEvent.url) {
              webviewUrlPostMessagePromiseResolve.current &&
                //@ts-ignore
                webviewUrlPostMessagePromiseResolve.current(data.payload)
            }
            break
          }
          case 'OPEN_DAPP': {
            const result = data.payload
            dispatch(
              updateTab({
                id: activeTabId ? activeTabId : 0,
                url: result.dAppData.data.URL,
                networkID: result.dAppData.data.networkID,
              }),
            )
            dispatch(
              changeNetwork({
                id: Number(activeTabId),
                networkID: result.dAppData.data.networkID,
              }),
            )

            backgroundBridges.current?.sendNotification({
              method: NOTIFICATION_NAMES.chainChanged,
              params: {
                chainId: result.dAppData.data.chainID,
              },
            })

            break
          }
          case 'HISTORY': {
            navigation.navigate('DappHistory')
            break
          }
          case 'FAVORITE_LIST': {
            if (bookmarkRedux) {
              navigation.navigate('DappList', {
                DappList: bookmarkRedux[0].Dapp,
                routeName: 'FavoriteDefaultWeb',
                bookmarkId: bookmarkRedux[0].id,
              })
            }
            break
          }
          default:
            break
        }
      } catch (error) {
        console.log('[ERROR]:', error)
      }
    },
    [activeTabId, bookmarkRedux, dispatch, navigation],
  )

  // /**
  //  * Stops normal loading when it's ens, instead call go to be properly set up
  //  */
  // const onShouldStartLoadWithRequest = ({ url }) => {
  //   if (isENSUrl(url)) {
  //     go(url.replace(/^http:\/\//, 'https://'))
  //     return false
  //   }
  //   return true
  // }

  const handleSearch = useCallback((searchText: string) => {
    setInitURL(`${SEARRCHPAGE_URL}/search?q=${searchText}`)
  }, [])

  const handleBookmark = useCallback(() => {
    setSearchText('')
    setName('')
    modalizeRef.current?.open()
    bookmarkRedux && setBookmarkList(bookmarkRedux)
  }, [bookmarkRedux])

  const handleAddBookmark = useCallback(async () => {
    const selectNetworkInfo = handleGetNetworkInfoById(Number(tabID))
    if (selectNetworkInfo) {
      dispatch(
        addBookmark({
          bookmarkName: nameInput,
          Dapp: [
            {
              URL: URLState,
              image: originIcon,
              title: dappTitle,
              networkID: String(selectNetworkInfo.networkID),
              networkType: selectNetworkInfo.networkType ?? NetworkType.ERC20,
            },
          ],
        }),
      )
    }
    modalizeRef.current?.close()
  }, [
    URLState,
    dappTitle,
    dispatch,
    handleGetNetworkInfoById,
    nameInput,
    originIcon,
    tabID,
  ])

  const handleAddDapp = useCallback(
    async (bookmarkID) => {
      const selectNetworkInfo = handleGetNetworkInfoById(Number(tabID))
      if (selectNetworkInfo) {
        dispatch(
          addDapp({
            bookmarkId: bookmarkID,
            Dapp: {
              URL: URLState,
              image: originIcon,
              title: dappTitle,
              networkID: String(selectNetworkInfo.networkID),
              networkType: selectNetworkInfo.networkType ?? NetworkType.ERC20,
            },
          }),
        )
      }
      modalizeRef.current?.close()
    },
    [
      URLState,
      dappTitle,
      dispatch,
      handleGetNetworkInfoById,
      originIcon,
      tabID,
    ],
  )

  const hanleFocusInput = useCallback(() => {
    inputTextRef.current?.focus()
  }, [])

  const HeaderCreateFolderComponent = useCallback(() => {
    return (
      <>
        <View style={styles.headerWrapper}>
          <Text variant="medium" fontSize={16}>
            Add to folder
          </Text>
        </View>
        <TextInput
          value={searchInputBS}
          maxLength={16}
          height={48}
          rightIcon={<SearchIcon />}
          onFocus={() => setFocusSearch(true)}
          onBlur={() => setFocusSearch(false)}
          onChangeText={setSearchBS}
          onSelectionChange={handleSearchFolder}
          containerStyle={styles.inputStyle}
          placeholder={'Search folder'}
        />
      </>
    )
  }, [
    handleSearchFolder,
    searchInputBS,
    styles.headerWrapper,
    styles.inputStyle,
  ])

  const FloatingComponent = useCallback(() => {
    if (insets.bottom === 0) {
      return null
    } else {
      return <View style={[styles.floatComponent, { height: insets.bottom }]} />
    }
  }, [insets.bottom, styles.floatComponent])

  const handleAddFavorite = useCallback(async () => {
    const selectNetworkInfo = handleGetNetworkInfoById(Number(tabID))
    if (selectNetworkInfo && bookmarkRedux && bookmarkRedux[0].id) {
      dispatch(
        addDapp({
          bookmarkId: bookmarkRedux[0].id,
          Dapp: {
            URL: URLState,
            image: originIcon,
            title: dappTitle,
            networkID: String(selectNetworkInfo?.networkID),
            networkType: selectNetworkInfo?.networkType ?? NetworkType.ERC20,
          },
        }),
      )
      modalizeRef.current?.close()
    }
  }, [
    URLState,
    bookmarkRedux,
    dappTitle,
    dispatch,
    handleGetNetworkInfoById,
    originIcon,
    tabID,
  ])

  const FooterComponent = useCallback(() => {
    return (
      <View style={styles.bottom}>
        <Button
          round
          text={'Add to Favorite'}
          variant="fulfill"
          onPress={handleAddFavorite}
        />
      </View>
    )
  }, [handleAddFavorite, styles.bottom])

  const renderFolderItem = ({
    item,
    index,
  }: {
    item: Bookmark
    index: number
  }) => {
    return (
      <View key={index}>
        <TouchableOpacity
          style={styles.folderItem}
          onPress={() => handleAddDapp(item.id)}
        >
          {index === 0 ? (
            <FavoriteIcon />
          ) : (
            <FolderIcon width={32} height={32} color={'blue'} />
          )}
          <Text style={styles.textItem}>{item.bookmarkName}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  useEffect(() => {
    handleUpdateForBottomtab()
  }, [handleUpdateForBottomtab])

  // handle action when component unmount
  useEffect(() => {
    return () => {
      backgroundBridges.current?.onDisconnect()
    }
  }, [activeTabId])

  return (
    <>
      <Container
        edges={['right', 'left']}
        style={[styles.root, !isActiveTab || showTab ? styles.hide : null]}
      >
        <View style={styles.searchView}>
          <DappSearch
            webviewRef={webviewRef}
            onShowTab={showTabs}
            searchText={searchText}
            setSearchText={setSearchText}
            handleSearch={handleSearch}
            handleBookmark={handleBookmark}
            loading={isLoading}
            URLState={URLState}
            disableSearch={URLState === HOMEPAGE_URL ? true : false}
            disableBookmark={URLState === HOMEPAGE_URL ? true : false}
          />
        </View>
        <View style={styles.dappView}>
          {loadingProgress >= 0 && loadingProgress < 1 ? (
            <Progress.Bar
              progress={loadingProgress}
              width={MAX_WIDTH}
              height={1}
            />
          ) : null}
          {!isEmpty(entryScriptWeb3) && (
            <WebView
              allowsInlineMediaPlayback
              ref={webviewRef}
              decelerationRate={'fast'}
              source={{ uri: initURL || initialURL }}
              injectedJavaScriptBeforeContentLoaded={entryScriptWeb3}
              // injectedJavaScriptBeforeContentLoadedForMainFrameOnly={
              //   Platform.OS === 'ios' ? false : true
              // }
              // injectedJavaScriptForMainFrameOnly={
              //   Platform.OS === 'ios' ? false : true
              // }
              onLoadStart={onLoadStart}
              onLoadEnd={onLoadEnd}
              onMessage={onMessage}
              onNavigationStateChange={handleNavigationEventStateChange}
              onLoadProgress={({ nativeEvent }) => {
                setLoadingProgress(nativeEvent.progress)
              }}
              incognito={incognito}
              onShouldStartLoadWithRequest={(event) => {
                if (Platform.OS === 'android') {
                  if (event.url.includes('metamask.app.link')) {
                    return false
                  }
                  return true
                } else {
                  return true
                }
              }}
              setSupportMultipleWindows={
                Platform.OS === 'android' ? false : true
              }
            />
          )}
        </View>
      </Container>
      <BottomSheet
        ref={modalizeRef}
        modalHeight={MAX_HEIGHT * 0.7 + insets.bottom}
        adjustToContentHeight={false}
        HeaderComponent={HeaderCreateFolderComponent}
        FloatingComponent={FloatingComponent}
        FooterComponent={isFocus || isFocusSearch ? null : FooterComponent}
        keyboardAvoidingBehavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <KeyboardAvoidingView behavior={keyboardVerticalOffset}>
          <View style={styles.modalContent}>
            <View style={styles.inputBox}>
              <TouchableOpacity
                style={styles.iconBox}
                onPress={hanleFocusInput}
              >
                <Text style={styles.icon} fontSize={20} isHighlight>
                  +
                </Text>
              </TouchableOpacity>
              <RNTextInput
                ref={inputTextRef}
                value={nameInput}
                onChangeText={setName}
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
                onSubmitEditing={handleAddBookmark}
                placeholder="Create new folder"
                placeholderTextColor={colorPlaceholder}
                style={styles.createFolderInput}
              />
            </View>
            <FlatList
              data={bookmarkList}
              renderItem={renderFolderItem}
              keyExtractor={keyExtractor}
            />
          </View>
        </KeyboardAvoidingView>
      </BottomSheet>
      {isActiveTab && (
        <RootRPCMethodsUI
          tabID={tabID}
          origin={origin}
          originIcon={originIcon}
          ApprovalEmitter={ApprovalEmitter}
          approvalRequest={approvalRequest}
          selectedNetworkInfo={selectedNetworkInfo}
        />
      )}
    </>
  )
}

function PropsAreEqual(prevProps: BrowserTabProps, nextProps: BrowserTabProps) {
  return (
    prevProps.tabID === nextProps.tabID &&
    prevProps.initialURL === nextProps.initialURL &&
    prevProps.incognito === nextProps.incognito &&
    isEqual(prevProps.showTabs, nextProps.showTabs) &&
    isEqual(prevProps.updateTabBrowser, nextProps.updateTabBrowser)
  )
}

export const MemoizedBrowserTab = React.memo(BrowserTab, PropsAreEqual)

const useStyles = makeStyles<BrowserTabProps>()(
  ({ normalize, colors, font }) => ({
    root: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'space-around',
    },
    image: {
      width: normalize(50)('moderate'),
      height: normalize(50)('moderate'),
    },
    dappItem: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    dappView: {
      flexGrow: 9.5,
    },
    searchView: {
      flexGrow: 0.5,
      marginTop: normalize(-10)('moderate'),
      flexDirection: 'row',
      backgroundColor: colors.white,

      alignItems: 'center',
    },
    hide: {
      flex: 0,
      opacity: 0,
      display: 'none',
      width: 0,
      height: 0,
    },
    headerWrapper: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: normalize(20)('vertical'),
      paddingBottom: normalize(10)('vertical'),
      borderBottomWidth: 1,
      borderBottomColor: colors.grey14,
    },
    floatComponent: {
      backgroundColor: colors.white,
    },
    modalContent: {
      marginHorizontal: normalize(20)('moderate'),
      marginBottom: normalize(30)('moderate'),
    },
    inputStyle: {
      marginHorizontal: normalize(20)('moderate'),
      width: '90%',
      backgroundColor: colors.transparent,
      borderColor: colors.grey12,
      borderRadius: normalize(16)('moderate'),
      marginVertical: normalize(30)('moderate'),
    },
    inputBox: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconBox: {
      justifyContent: 'center',
      alignItems: 'center',
      width: normalize(32)('moderate'),
      height: normalize(32)('moderate'),
      borderWidth: 1,
      borderColor: colors.primary,
      borderRadius: normalize(7)('moderate'),
    },
    icon: {
      fontSize: font.size.s1,
      color: colors.primary,
    },
    createFolderInput: {
      marginLeft: normalize(15)('moderate'),
      fontSize: font.size.s3,
    },
    textItem: {
      marginLeft: normalize(15)('moderate'),
      fontSize: font.size.s3,
    },
    folderItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: normalize(20)('vertical'),
    },
    bottom: {
      justifyContent: 'flex-end',
      shadowColor: 'black',
      backgroundColor: colors.white,
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      elevation: 10,
      zIndex: 100,
      paddingTop: normalize(20)('vertical'),
      paddingHorizontal: normalize(15)('horizontal'),
    },
  }),
)
