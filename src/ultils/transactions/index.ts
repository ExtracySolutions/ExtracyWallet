export const TOKEN_METHOD_TRANSFER = 'transfer'
export const TOKEN_METHOD_APPROVE = 'approve'
export const TOKEN_METHOD_TRANSFER_FROM = 'transferfrom'
export const CONTRACT_METHOD_DEPLOY = 'deploy'
export const CONNEXT_METHOD_DEPOSIT = 'connextdeposit'

export const SEND_ETHER_ACTION_KEY = 'sentEther'
export const DEPLOY_CONTRACT_ACTION_KEY = 'deploy'
export const APPROVE_ACTION_KEY = 'approve'
export const SEND_TOKEN_ACTION_KEY = 'transfer'
export const TRANSFER_FROM_ACTION_KEY = 'transferfrom'
export const UNKNOWN_FUNCTION_KEY = 'unknownFunction'
export const SMART_CONTRACT_INTERACTION_ACTION_KEY = 'smartContractInteraction'
export const SWAPS_TRANSACTION_ACTION_KEY = 'swapsTransaction'

export const TRANSFER_FUNCTION_SIGNATURE = '0xa9059cbb'
export const TRANSFER_FROM_FUNCTION_SIGNATURE = '0x23b872dd'
export const APPROVE_FUNCTION_SIGNATURE = '0x095ea7b3'
export const SWAP_NATIVETOKEN_TO_TOKEN_FUNCTION_SIGNATURE = '0x7ff36ab5'
export const SWAP_TOKEN_TO_NATIVETOKEN_FUNCTION_SIGNATURE = '0x18cbafe5'
export const CONTRACT_CREATION_SIGNATURE = '0x60a060405260046060527f48302e31'

import { rawEncode, rawDecode } from 'ethereumjs-abi'
import { toChecksumAddress, addHexPrefix, BN } from 'ethereumjs-util'
import { TransactionDescription } from 'ethers/lib/utils'
import { balanceFormat } from '@ultils'
import {
  fromWei as fromWeiUnit,
  toWei as toWeiUnit,
  numberToString,
} from 'ethjs-unit'
import numberToBN from 'number-to-bn'
import { fromWei, toBN, toDecimal, toHex } from 'web3-utils'

import {
  NetworkType,
  TransactionMeta,
  util,
  ERC20Transaction,
} from '../@extracy-wallet-controller'
import Engine from '../../core/Engine'
import { strings } from '../../I18n'

export const TRANSACTION_TYPES = {
  SENT: 'transaction_sent',
  SENT_TOKEN: 'transaction_sent_token',
  RECEIVED: 'transaction_received',
  RECEIVED_TOKEN: 'transaction_received_token',
  SENT_COLLECTIBLE: 'transaction_sent_collectible',
  RECEIVED_COLLECTIBLE: 'transaction_received_collectible',
  SITE_INTERACTION: 'transaction_site_interaction', // swap, smartcontract
  APPROVE: 'transaction_approve',
}
type TRANSACTION_TYPES = typeof TRANSACTION_TYPES

/**
 * Object containing all known action keys, to be used in transactions list
 */
const actionKeys = {
  [SEND_TOKEN_ACTION_KEY]: strings('transactions.sent_tokens'),
  [TRANSFER_FROM_ACTION_KEY]: strings('transactions.sent_collectible'),
  [DEPLOY_CONTRACT_ACTION_KEY]: strings('transactions.contract_deploy'),
  [SMART_CONTRACT_INTERACTION_ACTION_KEY]: strings(
    'transactions.smart_contract_interaction',
  ),
  [SWAPS_TRANSACTION_ACTION_KEY]: strings('transactions.swaps_transaction'),
  [APPROVE_ACTION_KEY]: strings('transactions.approve'),
}

/**
 * Transaction element type for transaction history
 * @actionKey {string} ex: 'approve' | 'sent' | 'received' | 'smart_contract_interaction'
 * @status {string} ex: 'confirmed' | 'pending' | 'failed'
 * @transactionType {string}
 * @date date time of transaction
 * @value amount token of transaction
 * @ticker token symbol
 * @networkID networkID ex: 97,36, solana,....
 * @transactionHash transaction hash
 */
export type TransactionElement = {
  actionKey: string
  status: string
  transactionType?: string
  date?: string
  value?: string
  ticker: string
  networkID?: string
  transactionHash?: string
  networkType: NetworkType
}

type DecodeTransaction = {
  tx: TransactionMeta
  selectedAddress: string
}

/**
 * Parse transaction with wallet information to render
 * @param {DecodeTransaction} args
 */
export async function decodeTransaction(
  args: DecodeTransaction,
): Promise<TransactionElement> {
  const {
    selectedAddress,
    tx,
    tx: {
      transaction: { from, to, value },
      time,
      transactionHash,
      status,
      chainId,
      ticker,
      networkType,
      networkID,
    },
  } = args

  const actionKey = await getActionKey(tx, selectedAddress, ticker as string)
  let transactionType

  if (actionKey === strings('transactions.approve')) {
    transactionType = TRANSACTION_TYPES.APPROVE
  } else if (actionKey === strings('transactions.swaps_transaction')) {
    transactionType = TRANSACTION_TYPES.SITE_INTERACTION
  } else if (
    actionKey === strings('transactions.smart_contract_interaction') ||
    (!actionKey.includes(strings('transactions.sent')) &&
      !actionKey.includes(strings('transactions.received')))
  ) {
    transactionType = TRANSACTION_TYPES.SITE_INTERACTION
  } else if (from !== selectedAddress) {
    transactionType = TRANSACTION_TYPES.SENT
  } else if (to === selectedAddress) {
    transactionType = TRANSACTION_TYPES.RECEIVED
  }

  return {
    networkType,
    actionKey,
    transactionType,
    ticker: ticker ?? 'Symbol not founded',
    value,
    status,
    transactionHash,
    networkID: networkID,
    date: time.toString(),
  }
}

/**
 * Returns corresponding transaction type message to show in UI
 * @param {TransactionMeta} tx - Transaction object
 * @param {string} selectedAddress - current account public address
 * @param ticker - Symbol of token
 */
async function getActionKey(
  tx: TransactionMeta,
  selectedAddress: string,
  ticker: string,
) {
  switch (tx.networkType) {
    case NetworkType.ERC20:
      return getActionKeyERC20(tx, selectedAddress, ticker)
    case NetworkType.SOL:
      return getActionKeySOL(tx, selectedAddress, ticker)
    default:
      break
  }
}

async function getActionKeyERC20(
  tx: TransactionMeta,
  selectedAddress: string,
  ticker: string,
) {
  if (tx && tx.isTransfer) {
    const selfSent =
      safeToChecksumAddress(tx.transaction.to) === selectedAddress
    const translationKey = selfSent
      ? 'transactions.self_sent_unit'
      : 'transactions.received_unit'

    return strings(translationKey, { unit: tx.transferInformation?.symbol })
  }
  // get actionKey
  const actionKey = await getTransactionActionKey(tx)
  if (actionKey === SEND_ETHER_ACTION_KEY) {
    // 1. transaction receive
    const receive = safeToChecksumAddress(tx.transaction.to) === selectedAddress
    // 2. self send transaction
    const selfSent =
      receive && safeToChecksumAddress(tx.transaction.from) === selectedAddress
    return receive
      ? selfSent
        ? ticker
          ? strings('transactions.self_sent_unit', { unit: ticker })
          : strings('transactions.self_sent_ether')
        : ticker
        ? strings('transactions.received_unit', { unit: ticker })
        : strings('transactions.received_ether')
      : ticker
      ? strings('transactions.sent_unit', { unit: ticker })
      : strings('transactions.sent_ether')
  }
  const transactionActionKey = (actionKeys as any)[actionKey]
  if (transactionActionKey) {
    return transactionActionKey
  }

  return actionKey
}

async function getActionKeySOL(
  tx: TransactionMeta,
  selectedAddress: string,
  ticker: string,
) {
  return strings('transactions.sent_unit', { unit: ticker })
}

export function safeToChecksumAddress(address?: string) {
  if (!address) {
    return undefined
  }
  return toChecksumAddress(address)
}

/**
 * Returns corresponding transaction action key
 *
 * @param {TransactionMeta} transaction - Transaction object
 * @returns {string} - Corresponding transaction action key
 */
export async function getTransactionActionKey(transaction: TransactionMeta) {
  //@ts-ignore
  const { transaction: { data, to } = {} } = transaction
  if (!to) {
    // 1. contract deploy method
    return CONTRACT_METHOD_DEPLOY
  }

  let ret = ''
  // 2. get methodData with data from transaction
  // if data in transaction try to get method data
  if (data && data !== '0x') {
    const methodData = await getMethodData(data)
    const { name } = methodData
    if (name) {
      return name
    }
  }

  // 3. smart contract interaction
  const toSmartContract =
    transaction.toSmartContract !== undefined
      ? transaction.toSmartContract
      : await isSmartContractAddress(to, transaction?.networkID)

  if (toSmartContract) {
    // There is no data or unknown method data, if is smart contract
    ret = SMART_CONTRACT_INTERACTION_ACTION_KEY
  } else {
    // if there is no data and no smart contract interaction
    ret = SEND_ETHER_ACTION_KEY
  }
  return ret
}

/**
 * Returns method data object for a transaction dat
 *
 * @param {string} data - Transaction data
 * @returns {object} - Method data object containing the name if is valid
 */
export async function getMethodData(data: string) {
  if (data.length < 10) {
    return {}
  }
  const fourByteSignature = data.substr(0, 10)
  if (fourByteSignature === TRANSFER_FUNCTION_SIGNATURE) {
    return { name: TOKEN_METHOD_TRANSFER }
  } else if (fourByteSignature === TRANSFER_FROM_FUNCTION_SIGNATURE) {
    return { name: TOKEN_METHOD_TRANSFER_FROM }
  } else if (fourByteSignature === APPROVE_FUNCTION_SIGNATURE) {
    return { name: TOKEN_METHOD_APPROVE }
  } else if (data.substr(0, 32) === CONTRACT_CREATION_SIGNATURE) {
    return { name: CONTRACT_METHOD_DEPLOY }
  }
  // const { TransactionController } = Engine.context;
  // // If it's a new method, use on-chain method registry
  // try {
  // 	const registryObject = await TransactionController.handleMethodData(fourByteSignature);
  // 	if (registryObject) {
  // 		return registryObject.parsedRegistryMethod;
  // 	}
  // } catch (e) {
  // 	// Ignore and return empty object
  // }
  return {}
}

export async function isSmartContractAddress(
  address: string,
  networkID?: string,
) {
  if (!address) {
    return false
  }
  address = toChecksumAddress(address)
  // if(Engine.context.TokensController?.state.allTokens[address]){
  // mình sẽ có một cái controller get tokenlist từ api
  // }

  const { TransactionController } = Engine.context

  if (networkID) {
    //@ts-ignore
    const code = await TransactionController?.providers[networkID].eth.getCode(
      address,
    )
    const isSmartContract = util.isSmartContractCode(code)
    return isSmartContract
  }
}

function decodeConfirmTx(
  arg: DecodeTransaction & { actionKey: string },
): TransactionElement {
  const {
    tx: {
      transaction: { from, to, value },
      time,
      transactionHash,
      status,
      chainId,
    },

    ticker,
    actionKey,
    selectedAddress,
  } = arg

  let transactionType
  if (actionKey === strings('transactions.approve')) {
    transactionType = TRANSACTION_TYPES.APPROVE
  } else if (actionKey === strings('transactions.swaps_transaction')) {
    transactionType = TRANSACTION_TYPES.SITE_INTERACTION
  } else if (
    actionKey === strings('transactions.smart_contract_interaction') ||
    (!actionKey.includes(strings('transactions.sent')) &&
      !actionKey.includes(strings('transactions.received')))
  ) {
    transactionType = TRANSACTION_TYPES.SITE_INTERACTION
  } else if (from === selectedAddress) {
    transactionType = TRANSACTION_TYPES.SENT
  } else if (to === selectedAddress) {
    transactionType = TRANSACTION_TYPES.RECEIVED
  }

  return {
    actionKey,
    transactionType,
    ticker,
    value,
    status,
    transactionHash,
    networkID: chainId,
    date: time.toString(),
  }
}
function renderFullAddress(address: string) {
  return address
    ? toChecksumAddress(address)
    : strings('transactions.tx_details_not_available')
}

// function decodeTransferTx(
//   args: DecodeTransaction & { actionKey: string },
// ): TransactionElement {
//   const {
//     tx: {
//       transactionHash,
//       transaction: { data, from },
//       status,
//       time,
//       chainId,
//     },
//     ticker,
//     selectedAddress,
//     actionKey,
//   } = args

//   const decodeData = decodeTransferData('transfer', data)
//   const addressTo = decodeData[0]

//   const renderActionKey = `${strings('transaction.sent')} ${ticker}`

//   const { SENT_TOKEN, RECEIVED_TOKEN } = TRANSACTION_TYPES

//   const transactionType =
//     renderFullAddress(from) === selectedAddress ? SENT_TOKEN : RECEIVED_TOKEN

//   const transactionElement: TransactionElement = {
//     actionKey: renderActionKey,
//     date: time.toString(),
//     networkID: chainId,
//     status,
//     ticker,
//     transactionHash,
//     transactionType,
//   }
// }

const BASE = 4 * 16
/**
 * Decode transfer data for specified method data
 *
 * @param {String} type - Method to use to generate data
 * @param {String} data - Data to decode
 * @returns {Object} - Object containing the decoded transfer data
 */
export function decodeTransferData(type: string, data?: string): Array<string> {
  if (data) {
    switch (type) {
      case 'transfer': {
        const encodedAddress = data.substr(10, BASE)
        const encodedAmount = data.substr(74, BASE)
        const bufferEncodedAddress = rawEncode(
          ['address'],
          [addHexPrefix(encodedAddress)],
        )
        return [
          addHexPrefix(rawDecode(['address'], bufferEncodedAddress)[0]),
          parseInt(encodedAmount, 16).toString(),
          encodedAmount,
        ]
      }
      case 'transferFrom': {
        const encodedFromAddress = data.substr(10, BASE)
        const encodedToAddress = data.substr(74, BASE)
        const encodedTokenId = data.substr(138, BASE)
        const bufferEncodedFromAddress = rawEncode(
          ['address'],
          [addHexPrefix(encodedFromAddress)],
        )
        const bufferEncodedToAddress = rawEncode(
          ['address'],
          [addHexPrefix(encodedToAddress)],
        )
        return [
          addHexPrefix(rawDecode(['address'], bufferEncodedFromAddress)[0]),
          addHexPrefix(rawDecode(['address'], bufferEncodedToAddress)[0]),
          parseInt(encodedTokenId, 16).toString(),
        ]
      }
    }
  }
  return []
}

/**
 * Gets the '_value' parameter of the given token transaction data
 * (i.e function call) per the Human Standard Token ABI, if present.
 *
 * @param {TransactionDescription} tokenData - ethers Interface token data.
 * @returns {string | undefined} A decimal string value.
 */
export function getTokenValueParam(tokenData: TransactionDescription) {
  return tokenData?.args?._value?.toString()
}

/**
 * Attempts to get the address parameter of the given token transaction data
 * (i.e. function call) per the Human Standard Token ABI, in the following
 * order:
 *   - The '_to' parameter, if present
 *   - The first parameter, if present
 *
 * @param {TransactionDescription} tokenData - ethers Interface token data.
 * @returns {string | undefined} A lowercase address string.
 */
export function getTokenAddressParam(tokenData: TransactionDescription) {
  const value = tokenData?.args?._to || tokenData?.args?.[0]
  return value?.toString().toLowerCase()
}

/**
 * Gets the '_hex' parameter of the given token transaction data
 * (i.e function call) per the Human Standard Token ABI, if present.
 *
 * @param {TransactionDescription} tokenData - ethers Interface token data.
 * @returns {string | undefined} A hex string value.
 */
export function getTokenValueParamAsHex(tokenData: TransactionDescription) {
  const value = tokenData?.args?._value?._hex || tokenData?.args?.[1]._hex
  return value?.toLowerCase()
}

export function estimateTransactionFeeAsDecimal(
  transactionMeta: TransactionMeta | undefined,
) {
  return transactionMeta
    ? `${fromWei(
        String(
          Number(
            toDecimal(
              String(
                (transactionMeta.transaction as ERC20Transaction).gasLimit,
              ),
            ),
          ) *
            Number(
              fromWei(
                String(
                  toDecimal(
                    String(
                      (transactionMeta.transaction as ERC20Transaction)
                        .gasPrice,
                    ),
                  ),
                ).split('.')[0],
                'gwei',
              ),
            ),
        ).split('.')[0],
        'gwei',
      )} ${transactionMeta?.ticker} ≈ $5`
    : ''
}

export function normalizeValueFromUnapproveTransactionMeta(
  transactionMeta: TransactionMeta | undefined,
) {
  return transactionMeta
    ? `${balanceFormat(
        transactionMeta.transaction.value
          ? fromWei(toBN(String(transactionMeta.transaction.value)))
          : '0',
        8,
      )} ${transactionMeta?.ticker}`
    : ''
}

/**
 * Generates ERC20 approve data
 *
 * @param {object} opts - Object containing spender address and value
 * @returns {String} - String containing the generated approce data
 */
export function generateApproveData({
  spender,
  value,
}: {
  spender: string
  value: string
}) {
  if (!spender || !value) {
    throw new Error(
      `[transactions] 'spender' and 'value' must be defined for 'type' approve`,
    )
  }
  return (
    APPROVE_FUNCTION_SIGNATURE +
    Array.prototype.map
      .call(
        rawEncode(['address', 'uint256'], [spender, addHexPrefix(value)]),
        (x) => ('00' + x.toString(16)).slice(-2),
      )
      .join('')
  )
}

export function decodeApproveData(data: any) {
  return {
    spenderAddress: addHexPrefix(data.substr(34, 40)),
    encodedAmount: data.substr(74, 138),
  }
}

/**
 * Converts some unit to token minimal unit
 *
 * @param {number|string|BN} tokenValue - Value to convert
 * @param {string} decimals - Unit to convert from, ether by default
 * @returns {Object} - BN instance containing the new number
 */
export function toTokenMinimalUnit({
  tokenValue,
  decimals,
}: {
  tokenValue: number | string | BN
  decimals: number
}) {
  const base = toBN(Math.pow(10, decimals).toString())
  let value = numberToString(tokenValue)
  const negative = value.substring(0, 1) === '-'
  if (negative) {
    value = value.substring(1)
  }
  if (value === '.') {
    throw new Error(
      '[number] while converting number ' +
        tokenValue +
        ' to token minimal util, invalid value',
    )
  }
  // Split it into a whole and fractional part
  const comps = value.split('.')
  if (comps.length > 2) {
    throw new Error(
      '[number] while converting number ' +
        tokenValue +
        ' to token minimal util,  too many decimal points',
    )
  }
  let whole = comps[0],
    fraction = comps[1]
  if (!whole) {
    whole = '0'
  }
  if (!fraction) {
    fraction = ''
  }
  if (fraction.length > decimals) {
    throw new Error(
      '[number] while converting number ' +
        tokenValue +
        ' to token minimal util, too many decimal places',
    )
  }
  while (fraction.length < decimals) {
    fraction += '0'
  }
  whole = new BN(whole)
  fraction = new BN(fraction)
  let tokenMinimal = whole.mul(base).add(fraction)
  if (negative) {
    tokenMinimal = tokenMinimal.mul(negative)
  }
  return new BN(tokenMinimal.toString(10), 10)
}

/**
 * Converts token minimal unit to readable string value
 *
 * @param {number|string|Object} minimalInput - Token minimal unit to convert
 * @param {string} decimals - Token decimals to convert
 * @returns {string} - String containing the new number
 */
export function fromTokenMinimalUnit({
  minimalInput,
  decimals,
}: {
  minimalInput: number | string | BN
  decimals: number
}) {
  minimalInput = addHexPrefix(Number(minimalInput).toString(16))
  let minimal = safeNumberToBN(minimalInput)
  const negative = minimal.lt(new BN(0))
  const base = toBN(Math.pow(10, decimals).toString())

  if (negative) {
    minimal = minimal.mul(negative)
  }
  let fraction = minimal.mod(base).toString(10)
  while (fraction.length < decimals) {
    fraction = '0' + fraction
  }
  fraction = fraction.match(/^([0-9]*[1-9]|0)(0*)/)[1]
  const whole = minimal.div(base).toString(10)
  let value = '' + whole + (fraction === '0' ? '' : '.' + fraction)
  if (negative) {
    value = '-' + value
  }
  return value
}

/**
 * Wraps 'numberToBN' method to avoid potential undefined and decimal values
 *
 * @param {number|string} value -  number
 * @returns {Object} - The converted value as BN instance
 */
export function safeNumberToBN(value: string | number) {
  const safeValue = fastSplit(value?.toString()) || '0'
  return numberToBN(safeValue)
}

/**
 * Performs a fast string split and returns the first item of the string based on the divider provided
 *
 * @param {number|string} value -  number/string to be splitted
 * @param {string} divider -  string value to use to split the string (default '.')
 * @returns {string} - the selected splitted element
 */

export function fastSplit(value: string, divider = '.') {
  const [from, to] = [value.indexOf(divider), 0]
  return value.substring(from, to) || value
}

/**
 * Calculate transaction fee from gasLimit and gasPrice(gwei)
 *
 * @param {string} gasLimit - number of gas (decimal)
 * @param {string} gasPrice - price gas GWEI
 */
export function calculateTransactionFree({
  gasLimit,
  gasPrice,
}: {
  gasLimit: string
  gasPrice: string
}) {
  const cleanValue = String(
    Number(gasLimit) * toDecimal(toHex(gweiDecToWEIBN(Number(gasPrice)))),
  )
  return `${fromWei(toHex(cleanValue), 'ether')}`
}

/**
 * Used to convert a base-10 number from GWEI to WEI. Can handle numbers with decimal parts.
 *
 * @param n - The base 10 number to convert to WEI.
 * @returns The number in WEI, as a BN.
 */
export function gweiDecToWEIBN(n: number | string) {
  if (Number.isNaN(n)) {
    return new BN(0).toString()
  }

  const parts = n.toString().split('.')
  const wholePart = parts[0] || '0'
  let decimalPart = parts[1] || ''

  if (!decimalPart) {
    return toWeiUnit(wholePart, 'gwei').toString()
  }

  if (decimalPart.length <= 9) {
    return toWeiUnit(`${wholePart}.${decimalPart}`, 'gwei').toString()
  }

  const decimalPartToRemove = decimalPart.slice(9)
  const decimalRoundingDigit = decimalPartToRemove[0]

  decimalPart = decimalPart.slice(0, 9)
  let wei = toWeiUnit(`${wholePart}.${decimalPart}`, 'gwei')

  if (Number(decimalRoundingDigit) >= 5) {
    wei = wei.add(new BN(1))
  }

  return wei.toString()
}
