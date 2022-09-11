import crashlytics from '@react-native-firebase/crashlytics'
import {
  KeyDetails,
  TorusServiceProviderArgs,
  TorusStorageLayerArgs,
} from '@tkey/common-types'
import ThresholdKey from '@tkey/default'
import SecurityQuestionsModule, {
  SECURITY_QUESTIONS_MODULE_NAME,
} from '@tkey/security-questions'
import SeedPhraseModule, { MetamaskSeedPhraseFormat } from '@tkey/seed-phrase'
import { TorusServiceProvider } from '@tkey/service-provider-torus'
import ShareTransferModule from '@tkey/share-transfer'
import TorusStorageLayer from '@tkey/storage-layer-torus'
import WebStorageModule from '@tkey/web-storage'
import * as WebBrowser from '@toruslabs/react-native-web-browser'
import Web3Auth, { OPENLOGIN_NETWORK, State } from '@web3auth/react-native-sdk'
import BN from 'bn.js'

let instance: TKeyContext

export enum TYPEOFLOGIN {
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
  TWITTER = 'twitter',
  APPLE = 'apple',
  JWT = 'jwt',
}
const REDIRECT_URL = 'oblwallet://social'

enum NETWORK {
  MAINNET = 'mainet',
  TESTNET = 'testnet',
}

const TORUS_CLIENTID = 'TORUS_CLIENTID'

type Verifier = {
  name: string
  typeOfLogin: TYPEOFLOGIN
  clientId: string
  verifier: string
  connection: string
  domain: string
  redirect_uri: string
}

type BEResponseType = {
  message: {
    answer: string
    enable_2fa: boolean
    is_active: boolean
    access_token: string
    refresh_token: string
  }
  ok: boolean
}

export enum MODULES_NAME {
  STORAGE_LAYER_MODULE_NAME = 'STORAGE_LAYER_MODULE_NAME',
  SECURITY_QUESTIONS_MODULE_NAME = 'securityQuestions',
  WEB_STORAGE_MODULE_NAME = 'webStorage',
  SHARE_TRANSFER_MODULE_NAME = 'shareTransfer',
  SEED_PHRASE_MODULE_NAME = 'seedPhraseModule',
}

const verifierMap: Record<TYPEOFLOGIN, Verifier> = {
  [TYPEOFLOGIN.GOOGLE]: {
    name: 'Extracy Wallet Login with Google',
    typeOfLogin: TYPEOFLOGIN.JWT,
    clientId: 'clientId',
    verifier: 'google_auth0',
    connection: 'google-oauth2',
    domain: 'domain',
    redirect_uri: 'redirect_uri',
  },
  [TYPEOFLOGIN.APPLE]: {
    name: 'Extracy Wallet Login with Apple',
    typeOfLogin: TYPEOFLOGIN.JWT,
    clientId: 'clientId',
    verifier: 'apple_auth0',
    connection: 'apple',
    domain: 'domain',
    redirect_uri: 'redirect_uri',
  },
}

// type ModulesMap = Record<MODULES_NAME, any>

class TKeyContext {
  /**
   * Instance
   */
  static instance: TKeyContext

  public privateKey?: string
  public answer?: string
  public oAuthIdToken?: string
  public isActive?: boolean
  public accessToken?: string
  modulesMap: Record<MODULES_NAME, any>
  tkey?: ThresholdKey
  manualSync: boolean = false

  constructor() {
    const metamaskSeedPhraseFormat = new MetamaskSeedPhraseFormat('YOUR_RPC')

    this.modulesMap = {
      [MODULES_NAME.SECURITY_QUESTIONS_MODULE_NAME]:
        new SecurityQuestionsModule(),
      [MODULES_NAME.WEB_STORAGE_MODULE_NAME]: new WebStorageModule(),
      [MODULES_NAME.SHARE_TRANSFER_MODULE_NAME]: new ShareTransferModule(),
      [MODULES_NAME.STORAGE_LAYER_MODULE_NAME]: new TorusStorageLayer({
        hostUrl: 'https://metadata.tor.us',
      }),
      [MODULES_NAME.SEED_PHRASE_MODULE_NAME]: new SeedPhraseModule([
        metamaskSeedPhraseFormat,
      ]),
    }
    this.privateKey = ''
    this.answer = ''
    this.oAuthIdToken = ''
    this.accessToken = ''
    this.isActive = false
    // this.tkey = undefined

    return (TKeyContext.instance = this)
  }

  initStorageLayer = async (extraParams: TorusStorageLayerArgs) => {
    return new TorusStorageLayer(extraParams)
  }

  initServiceProvider = async (params: TorusServiceProviderArgs) => {
    return new TorusServiceProvider(params)
  }

  initializeTkey = async (): Promise<KeyDetails> => {
    try {
      crashlytics().log(`User initializeTkey`)
      if (!this.privateKey) {
        throw new Error('You should login with social first!')
      }

      // init Service Provider
      const defaultServiceProvider = await this.initServiceProvider({
        postboxKey: this.privateKey,
        customAuthArgs: {
          baseUrl: REDIRECT_URL,
          network: NETWORK.TESTNET,
          apiKey: TORUS_CLIENTID,
        },
      })

      // create new Tkey
      this.tkey = new ThresholdKey({
        storageLayer: this.modulesMap[MODULES_NAME.STORAGE_LAYER_MODULE_NAME],
        serviceProvider: defaultServiceProvider,
        manualSync: this.manualSync,
        modules: {
          securityQuestions:
            this.modulesMap[MODULES_NAME.SECURITY_QUESTIONS_MODULE_NAME],
          shareTransfer:
            this.modulesMap[MODULES_NAME.SHARE_TRANSFER_MODULE_NAME],
          seedPhrase: this.modulesMap[MODULES_NAME.SEED_PHRASE_MODULE_NAME],
        },
      })

      // initialize
      const keydetails = await this.tkey.initialize({
        importKey: new BN(String(this.privateKey), 'hex'),
      })

      return keydetails
    } catch (error) {
      console.log('[initialize tkey]', error)
      crashlytics().recordError(error as Error, 'initializeTkey error')
      throw new Error('Initialize tkey error')
    }
  }

  triggerLoginSocial = async (loginType: TYPEOFLOGIN) => {
    try {
      crashlytics().log(`User login with ${loginType}  `)

      const {
        clientId,
        name,
        typeOfLogin,
        verifier,
        connection,
        domain,
        redirect_uri,
      } = verifierMap[loginType]
      const web3Auth = new Web3Auth(WebBrowser, {
        sdkUrl: 'https://sdk.openlogin.com',
        clientId: TORUS_CLIENTID,
        network: OPENLOGIN_NETWORK.TESTNET,
        loginConfig: {
          [typeOfLogin]: {
            verifier: verifier,
            typeOfLogin: TYPEOFLOGIN.JWT,
            name: name,
            clientId: clientId,
            jwtParameters: {
              domain: domain,
              client_id: clientId,
              redirect_uri: redirect_uri,
              /**
               * The name of the connection configured for your application.
               * If null, it will redirect to the Auth0 Login Page and show
               * the Login Widget.
               */
              // connection: 'google-oauth2',
              connection: connection,
            },
          },
        },
      })

      const state: State = await web3Auth.login({
        loginProvider: typeOfLogin,
        redirectUrl: REDIRECT_URL,
        mfaLevel: 'none',
      })
      console.log('cmn', JSON.stringify(state, null, 2))
      this.privateKey = state.privKey
      this.oAuthIdToken = state.userInfo.oAuthIdToken
      await this.getAnswer(state.userInfo.oAuthIdToken)
    } catch (error) {
      crashlytics().recordError(error as Error, 'Trigger login error')
      throw new Error('Trigger login error')
    }
  }

  importAnswerKey = async () => {
    try {
      crashlytics().log(`User importAnswerKey}`)
      if (this.tkey) {
        await (
          this.tkey.modules[
            MODULES_NAME.SECURITY_QUESTIONS_MODULE_NAME
          ] as SecurityQuestionsModule
        ).inputShareFromSecurityQuestions(String(this.answer))
      }
    } catch (error) {
      crashlytics().recordError(error as Error, 'importAnswerKey error')
      console.log('[importAnswerKey error]', error)
    }
  }

  setUpAnswerTkey = async () => {
    try {
      crashlytics().log(`User setUpAnswerTkey}`)
      console.log('this.answer', this.answer)
      if (this.tkey && this.answer) {
        await this.tkey.reconstructKey(false)
        await (
          this.tkey.modules[
            SECURITY_QUESTIONS_MODULE_NAME
          ] as SecurityQuestionsModule
        ).generateNewShareWithSecurityQuestions(
          String(this.answer),
          'What is your password?',
        )

        await this.tkey.reconstructKey(false)
      }
    } catch (error) {
      crashlytics().recordError(error as Error, 'setUpAnswerTkey error')
      console.log('[setUpAnswerTkey error]', error)
    }
  }

  importSeedPhraseTkey = async (seedPhrase: string) => {
    try {
      crashlytics().log(`User importSeedPhraseTkey}`)
      if (this.tkey) {
        await this.tkey.reconstructKey(false)
        await (this.tkey.modules.seedPhrase as SeedPhraseModule).setSeedPhrase(
          'HD Key Tree',
        )
        await this.tkey.syncLocalMetadataTransitions()
        const [seed] = await (
          this.tkey.modules.seedPhrase as SeedPhraseModule
        ).getSeedPhrases()

        if (seedPhrase) {
          await (
            this.tkey.modules.seedPhrase as SeedPhraseModule
          ).CRITICAL_changeSeedPhrase(seed.seedPhrase, seedPhrase.toLowerCase())
        }
      }
    } catch (error) {
      crashlytics().recordError(error as Error, 'importSeedPhraseTkey error')
      console.log('[importSeedPhraseTkey error]', error)
    }
  }

  getSeedPhrase = async () => {
    try {
      crashlytics().log(`User getSeedPhrase}`)
      if (this.tkey) {
        await this.tkey.reconstructKey(false)
        await (this.tkey.modules.seedPhrase as SeedPhraseModule).setSeedPhrase(
          'HD Key Tree',
        )
        await this.tkey.syncLocalMetadataTransitions()

        const [seedPhrase] = await (
          this.tkey.modules.seedPhrase as SeedPhraseModule
        ).getSeedPhrases()
        console.log('[SEED new]', seedPhrase)
        return seedPhrase.seedPhrase
      }
    } catch (error) {
      crashlytics().recordError(error as Error, 'getSeedPhrase error')
      console.log('[getSeedPhrase error]', error)
    }
  }

  getAnswer = async (auth0Token: string) => {
    try {
      crashlytics().log(`User getAnswer}`)
      // GET ANSWER
    } catch (error) {
      crashlytics().recordError(error as Error, 'getAnswer error')
      console.log('getAnswer', error)
    }
  }

  setActiveUser = async () => {
    try {
      crashlytics().log(`User setActiveUser}`)
      // SET ACTIVE USER
      console.log('setActiveUser result', result)
    } catch (error) {
      crashlytics().recordError(error as Error, 'setActiveUser error')
      console.log('setActiveUser', error)
    }
  }

  clearTkey = async () => {
    this.privateKey = ''
    this.tkey = undefined
  }
}

export default {
  get context(): TKeyContext {
    return instance
  },
  init() {
    instance = new TKeyContext()
    // Object.freeze(instance)
    return instance
  },
}
