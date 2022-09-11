import { FrequentRpc, Identity } from '@extracy-wallet-controller'

class DappBottomTabContext {
  /**
   * Instance
   */
  static instance: DappBottomTabContext

  public changeNetworkWeekMap?: Map<number, any> = undefined
  public changeAccountWeekMap?: Map<number, any> = undefined
  public canGoBackWeekMap?: Map<number, boolean> = undefined
  public goBackWeekMap?: Map<number, any> = undefined
  public canGoForwardWeekMap?: Map<number, boolean> = undefined
  public goForwardWeekMap?: Map<number, any> = undefined

  constructor() {
    if (!DappBottomTabContext.instance) {
      this.changeNetworkWeekMap = new Map()
      this.changeAccountWeekMap = new Map()
      this.canGoForwardWeekMap = new Map()
      this.canGoBackWeekMap = new Map()
      this.goBackWeekMap = new Map()
      this.goForwardWeekMap = new Map()

      DappBottomTabContext.instance = this
    }

    return (DappBottomTabContext.instance = this)
  }

  onUpdateNavigateStatus = async (params: {
    activeTabID: number
    canGoBack: boolean
    canGoForward: boolean
  }) => {
    this.canGoBackWeekMap?.set(params.activeTabID, params.canGoBack)
    this.canGoForwardWeekMap?.set(params.activeTabID, params.canGoForward)
  }

  onGetGoBackStatus = (activeTabID: number) => {
    return this.canGoBackWeekMap?.get(activeTabID)
  }

  onGetGoForwardStatus = (activeTabID: number) => {
    return this.canGoForwardWeekMap?.get(activeTabID)
  }

  onUpdateNavigateCallback = async ({
    activeTabID,
    onBack,
    onForward,
  }: {
    activeTabID: number
    onBack: () => void
    onForward: () => void
  }) => {
    this.goBackWeekMap?.set(activeTabID, onBack)
    this.goForwardWeekMap?.set(activeTabID, onForward)
  }

  onExecuteGoBack = (activeTabID: number) => {
    this.goBackWeekMap?.get(activeTabID)()
  }

  onExecuteGoForward = (activeTabID: number) => {
    this.goForwardWeekMap?.get(activeTabID)()
  }

  onUpdateNetworkCallBack = async (
    callback: (network: FrequentRpc) => void,
    activeTabID: number,
  ) => {
    this.changeNetworkWeekMap?.set(activeTabID, callback)
    console.log('[CHANGE NETWORK]', this.changeNetworkWeekMap)
  }

  onExecuteChangeNetwork = async (
    network: FrequentRpc,
    activeTabID: number,
  ) => {
    this.changeNetworkWeekMap?.get(activeTabID)(network)
  }

  onUpdateAccountCallBack = async (
    callback: (account: Identity) => void,
    activeTabID: number,
  ) => {
    this.changeAccountWeekMap?.set(activeTabID, callback)
  }

  onExecuteChangeAccount = async (account: Identity, activeTabID: number) => {
    this.changeAccountWeekMap?.get(activeTabID)(account)
  }

  onTerminateTabWithID = (activeTabID: number) => {
    this.changeNetworkWeekMap?.delete(activeTabID)
    this.changeAccountWeekMap?.delete(activeTabID)
    this.canGoForwardWeekMap?.delete(activeTabID)
    this.canGoBackWeekMap?.delete(activeTabID)
    this.goBackWeekMap?.delete(activeTabID)
    this.goForwardWeekMap?.delete(activeTabID)
  }
  onTerminateAllTab = () => {
    this.changeNetworkWeekMap?.clear()
    this.changeAccountWeekMap?.clear()
    this.canGoForwardWeekMap?.clear()
    this.canGoBackWeekMap?.clear()
    this.goBackWeekMap?.clear()
    this.goForwardWeekMap?.clear()
  }
}

let instance: DappBottomTabContext

export default {
  get context(): DappBottomTabContext {
    return instance
  },

  init() {
    instance = new DappBottomTabContext()
    Object.freeze(instance)
    return instance
  },
}
