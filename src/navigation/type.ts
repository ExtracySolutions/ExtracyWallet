import React from 'react'

import { BackgroundBridge } from 'core/BackgroundBridge'
import { WebView } from 'react-native-webview'

import {
  FrequentRpc,
  TokenPlatform,
  Token as TokenType,
  NetworkType,
} from '@extracy-wallet-controller'

export const enum FeatParentScreen {
  create = 'create',
  import = 'import',
}

type ActivityType = {
  date?: string
  content?: string
  status?: string
  balance?: string
  icon?: React.ReactElement
}

export type DappType = {
  title?: string | undefined
  description?: string | undefined
  URL?: string
  image?: string | undefined
  networkID?: string
  networkType?: NetworkType
}

export type AppStackParamsList = {
  Main?: {}
  Disconnection?: {}
  MainStack?: {}
  StartUp?: {}
  ManagerAsset: {
    token: FrequentRpc
    routeName: string
    tokenList: TokenPlatform[]
  }
  Legal?: {}
  TransactionDetail?: {
    item: ActivityType[]
  }
  AddToken?: {}
  ViewSeedPhrase?: {}
  Activity?: {}
  ConfirmSeedPhrase: {
    mnemonicArray: any
    mnemonic: string
  }
  DApp?: {}
  ImportWallet?: {}
  Received?: {}
  SendToken?: {}
  Setting?: {}
  Token?: {}
  WhiteList?: {
    routeName?: string
  }
  Backup?: {}
  AddEditWhiteList?: {
    routeName?: string
  }
  Browser?: {}
  PortalDapps: {}
  DappList: {
    DappList?: DappType[]
    routeName?: string
    bookmarkId?: string
  }
  Bookmark?: {}
  FilterToken?: {}
  PasswordSettings?: {}
  CreatePassword: {
    seedPhrase: string
    parentScreen: FeatParentScreen.create | FeatParentScreen.import
  }
  ChangePassword?: {}
  RevealSeedPhrase?: {}
  SelectedNetwork?: {}
  Filter?: { activeTokens?: TokenType[] }
  Background?: {}
  DappHistory?: {}
  SecuritySettings?: {}
  CurrencyConversion?: {}
  Language?: {}
  DeleteHistory?: {}
  DeleteCookie?: {}
  AskUpdateSeedPhrase?: {}
  Setup2FA?: {}
  SetupPassword?: {}
  SetupBiometric?: {}
}
