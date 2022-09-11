import * as OblWalletControllers from '@extracy-wallet-controller'
import { DEFAULT_FREQUENT_RPC } from '@ultils'

import AppConstants from './AppConstants'
import Encryptor from './Encryptor'

const NON_EMPTY = 'NON_EMPTY'

const encryptor = new Encryptor()

interface EngineProp extends OblWalletControllers.IObjectKeys {
  PreferencesController?: OblWalletControllers.PreferencesController
  NetworkController?: OblWalletControllers.NetworkController
  AssetsContractController?: OblWalletControllers.AssetsContractController
  KeyringController?: OblWalletControllers.KeyringController
  TokensController?: OblWalletControllers.TokensController
  TokenBalancesController?: OblWalletControllers.TokenBalancesController
  TransactionController?: OblWalletControllers.TransactionController
  WhiteListController?: OblWalletControllers.WhiteListController
}

interface EngineState extends OblWalletControllers.IObjectKeys {
  PreferencesController?: OblWalletControllers.PreferencesState
  NetworkController?: {}
  AssetsContractController?: {}
  KeyringController?: OblWalletControllers.KeyringState
  TokensController?: OblWalletControllers.TokensState
  TokenBalancesController?: OblWalletControllers.TokenBalancesState
  TransactionController?: OblWalletControllers.TransactionState
  WhiteListController?: OblWalletControllers.ContactState
}

/**
 * Core controller responsible for composing other  controllers together
 * and exposing convenience methods for common wallet operations.
 */
class Engine {
  static instance: Engine

  /**
   * Context
   */
  context: EngineProp = {}

  /**
   * ControllerMessenger
   */
  controllerMessenger: any

  /**
   * ComposableController reference containing all child controllers
   */
  datamodel: OblWalletControllers.ComposableController | undefined = undefined

  /**
   * Creates a CoreController instance
   */
  constructor(initialState: EngineState = {}) {
    if (!Engine.instance) {
      const preferencesController =
        new OblWalletControllers.PreferencesController(undefined, {
          frequentRpcList: DEFAULT_FREQUENT_RPC,
          ipfsGateway: AppConstants.IPFS_DEFAULT_GATEWAY_URL,
          ...initialState.PreferencesController,
        })

      const keyringController = new OblWalletControllers.KeyringController(
        {
          removeIdentity: preferencesController.removeIdentity.bind(
            preferencesController,
          ),
          updateIdentities: preferencesController.updateIdentities.bind(
            preferencesController,
          ),
          setSelectedAccountIndex:
            preferencesController.setSelectedAccountIndex.bind(
              preferencesController,
            ),
        },
        { encryptor },
        initialState.KeyringController,
      )
      const networkController = new OblWalletControllers.NetworkController(
        {
          onPreferencesStateChange: (listener) =>
            preferencesController.subscribe(listener),
          frequentRpcList: preferencesController.state.frequentRpcList,
        },
        {
          infuraProjectId: NON_EMPTY,
        },
      )

      const assetsContractController =
        new OblWalletControllers.AssetsContractController({
          onNetworkStateChange: (listener) =>
            networkController.subscribe(listener),
          getProviders: networkController.getProviders.bind(networkController),
        })

      const tokensController = new OblWalletControllers.TokensController(
        {
          getFrequentRpcList: preferencesController.getFrequentRpcList.bind(
            preferencesController,
          ),
          onPreferencesStateChange: (listener) =>
            preferencesController.subscribe(listener),
          getAccountIndexes: preferencesController.getAccountIndexes.bind(
            preferencesController,
          ),
        },
        {
          selectedAccountIndex:
            preferencesController.state.selectedAccountIndex,
        },
        initialState.TokensController,
      )
      const tokenBalancesController =
        new OblWalletControllers.TokenBalancesController(
          {
            getBalanceOf: assetsContractController.getBalanceOf.bind(
              assetsContractController,
            ),
            getBalance: assetsContractController.getBalance.bind(
              assetsContractController,
            ),
            getSelectedAddress: preferencesController.getSelectedAddress.bind(
              preferencesController,
            ),
            onTokensStateChange: (listener) =>
              tokensController.subscribe(listener),
          },
          {
            interval: 15000,
          },

          initialState.TokenBalancesController,
        )

      const transactionController =
        new OblWalletControllers.TransactionController(
          {
            getProvider: networkController.getProviders.bind(networkController),
            onNetworkStateChange: (listener) =>
              networkController.subscribe(listener),
            getSelectedAccountIndex:
              preferencesController.getSelectedAccountIndex.bind(
                preferencesController,
              ),
          },
          {
            sign: keyringController.signTransaction.bind(keyringController),
          },
          initialState.TransactionController,
        )

      const whitelistController = new OblWalletControllers.WhiteListController(
        {
          onPreferencesStateChange: (listener) =>
            preferencesController.subscribe(listener),
          getAccountIndexes: preferencesController.getAccountIndexes.bind(
            preferencesController,
          ),
        },
        {
          selectedAccountIndex:
            preferencesController.state.selectedAccountIndex,
        },
        initialState.WhiteListController,
      )

      this.controllerMessenger = new OblWalletControllers.ControllerMessenger()

      const controllers = [
        keyringController,
        preferencesController,
        networkController,
        assetsContractController,
        tokensController,
        tokenBalancesController,
        transactionController,
        whitelistController,
      ]

      this.datamodel = new OblWalletControllers.ComposableController(
        controllers,
        this.controllerMessenger,
      )
      this.context = controllers.reduce((context, controller) => {
        // @ts-ignore
        context[controller.name] = controller
        return context
      }, {})

      Engine.instance = this
    }
    return Engine.instance
  }

  resetState = async () => {
    // Whenever we are gonna start a new wallet
    // either imported or created, we need to
    // get rid of the old data from state

    const {
      TransactionController,
      TokensController,
      TokenBalancesController,
      WhiteListController,
    } = this.context

    //Clear assets info
    TokensController &&
      TokensController.update({
        allTokens: [],
        activeTokens: [],
        name: '',
      })

    WhiteListController &&
      WhiteListController.update({
        contacts: [],
        name: '',
        selectedAddressContact: '',
      })

    TokenBalancesController &&
      TokenBalancesController.update({ tokenBalances: {} })

    TransactionController &&
      TransactionController.update({
        name: '',
        transactions: {},
        methodData: {},
      })
  }
}

let instance: Engine

export default {
  get context(): EngineProp {
    return instance && instance.context
  },

  get state(): EngineState {
    const {
      PreferencesController,
      NetworkController,
      AssetsContractController,
      KeyringController,
      TokensController,
      TokenBalancesController,
      TransactionController,
      WhiteListController,
    } = instance && instance.datamodel && instance.datamodel.state

    return {
      PreferencesController,
      NetworkController,
      AssetsContractController,
      KeyringController,
      TokensController,
      TokenBalancesController,
      TransactionController,
      WhiteListController,
    }
  },
  get datamodel() {
    return instance.datamodel
  },
  resetState() {
    return instance.resetState()
  },

  init(state: EngineState = {}) {
    instance = new Engine(state)
    Object.freeze(instance)
    return instance
  },
}
