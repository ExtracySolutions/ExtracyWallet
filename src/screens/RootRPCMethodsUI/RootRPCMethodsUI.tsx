import EventEmitter from 'events'

import React, {
  FC,
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from 'react'

import {
  BottomSheet,
  Modalize,
  Button,
  Text,
  ToastPayload,
  FastImage,
} from '@components'
import {
  TransactionMeta,
  NetworkType,
  util,
  TransactionStatus,
} from '@extracy-wallet-controller'
import { useAppSelector } from '@hooks'
import { makeStyles, useTheme } from '@themes'
import {
  APPROVE_FUNCTION_SIGNATURE,
  // SWAP_NATIVETOKEN_TO_TOKEN_FUNCTION_SIGNATURE,
  // SWAP_TOKEN_TO_NATIVETOKEN_FUNCTION_SIGNATURE,
  TOKEN_METHOD_TRANSFER,
  // getTokenValueParam,
  getTokenAddressParam,
  getTokenValueParamAsHex,
  getMethodData,
  estimateTransactionFeeAsDecimal,
  normalizeValueFromUnapproveTransactionMeta,
  decodeApproveData,
  fromTokenMinimalUnit,
  toTokenMinimalUnit,
  generateApproveData,
  balanceFormat,
  getIconNetworkWithNetworkID,
} from '@ultils'
import { ArrowLeftBack, DoneIcon, EditIcon } from 'assets'
import { ethers } from 'ethers'
import { TouchableOpacity, View } from 'react-native'
// eslint-disable-next-line import/order
import { useSafeAreaInsets } from 'react-native-safe-area-context'
// import { fromWei, toBN, toDecimal, toWei } from 'web3-utils'

import { SvgUri } from 'react-native-svg'

import Engine from '../../core/Engine'
import { EditPermissionSelection } from './EditPermissionSelection'

const abi = require('human-standard-token-abi')

const hstInterface = new ethers.utils.Interface(abi)

export type RootRPCMethodsUIProps = {
  tabID: number
  origin?: string
  originIcon?: string
  ApprovalEmitter?: EventEmitter
  approvalRequest?: React.MutableRefObject<
    | {
        resolve: (value: unknown) => void
        reject: (reason?: any) => void
      }
    | undefined
  >
  selectedNetworkInfo:
    | {
        networkID: string
        networkType: NetworkType
        symbol: string
        chainID: string
        nickname: string
      }
    | undefined
}

export const RootRPCMethodsUI: FC<RootRPCMethodsUIProps> = (props) => {
  const themeStore = useAppSelector((state) => state.root.theme.theme)
  const { activeTabId, tabs } = useAppSelector((state) => state.root.browser)
  // const tokenBalancesControllerState = useAppSelector(
  //   (state) => state.root.engine.backgroundState.TokenBalancesController,
  // )
  const { PreferencesController: PreferencesControllerState } = useAppSelector(
    (state) => state.root.engine.backgroundState,
  )
  const theme = useTheme(themeStore)
  const styles = useStyles(props, themeStore)
  const insets = useSafeAreaInsets()
  const {
    origin,
    originIcon,
    ApprovalEmitter,
    approvalRequest,
    selectedNetworkInfo,
  } = props

  const {
    PreferencesController,
    TransactionController,
    TokenBalancesController,
    AssetsContractController,
  } = Engine.context

  const [unapprovedTransactionMeta, setUnapprovedTransactionMeta] =
    useState<TransactionMeta>()
  const [
    unapprovedTransactionApproveDappMeta,
    setUnapprovedTransactionApproveDappMeta,
  ] = useState<TransactionMeta>()

  const [proposedApproveAmount, setProposedApproveAmount] = useState<string>('')
  const [spendLimitCustomValue, setSpendLimitCustomValue] =
    useState<string>('1')
  const [isCustomLimit, setCustomLimit] = useState<boolean>(false)
  const [tokenSymbol, setTokenSymbol] = useState<string | undefined>('')
  const [spenderAddress, setSpenderAddress] = useState<string>('')
  const [selectedAccountAddress, setSelectedAccountAddress] =
    useState<string>('')
  const refDappTransactionModal = useRef<Modalize>(null)
  const refDappTransactionApproveModal = useRef<Modalize>(null)
  const refApproveConnectionModal = useRef<Modalize>(null)
  const refEditPermissionModal = useRef<Modalize>(null)

  // const { currentTabNetworkID, selectedAccountIndex, resultSelectedAddress } =
  //   useMemo(() => {
  //     const selectedTab = tabs.find((tab) => tab.id === activeTabId)
  //     if (selectedTab) {
  //       const currentTabNetworkID = selectedTab?.selectedNetworkID
  //       const selectedAccountIndex = selectedTab?.selectedAccountIndex
  //       const resultSelectedAddress =
  //         identities[selectedTab.selectedAccountIndex].addresses[
  //           selectedTab.networkType
  //         ]

  //       return {
  //         currentTabNetworkID,
  //         selectedAccountIndex,
  //         resultSelectedAddress,
  //       }
  //     }
  //   }, [activeTabId, identities, tabs])

  // TODO: continue here
  const currentTabNetworkID = useMemo(() => {
    const selectedTab = tabs.find((tab) => tab.id === activeTabId)

    return selectedTab?.selectedNetworkID
  }, [activeTabId, tabs])

  const selectedAccountIndex = useMemo(() => {
    const selectedTab = tabs.find((tab) => tab.id === activeTabId)
    return selectedTab?.selectedAccountIndex
  }, [activeTabId, tabs])

  const getSelectedAccountAddress = useCallback(async () => {
    if (PreferencesControllerState) {
      const { identities } = PreferencesControllerState
      const selectedTab = tabs.find((tab) => tab.id === activeTabId)
      if (selectedTab) {
        const resultSelectedAddress =
          identities[selectedTab.selectedAccountIndex].addresses[
            selectedTab.networkType
          ]

        if (resultSelectedAddress) {
          setSelectedAccountAddress(resultSelectedAddress)
        }
      }
    }
  }, [PreferencesControllerState, activeTabId, tabs])

  /**
   * this function execute when have 'unsubmited' transaction emit from Transaction controller
   */
  const onUnapprovedTransaction = useCallback(
    async (transactionMeta: TransactionMeta) => {
      // console.log('[[[[--- DAPP TRANSACTION ---]]]]', transactionMeta)
      // const { origin } = transactionMeta
      const { data, value, to } = transactionMeta.transaction

      const fourByteSignature = data?.substring(0, 10)

      // console.log('fourByteSignature', fourByteSignature)

      if (fourByteSignature === APPROVE_FUNCTION_SIGNATURE) {
        /** * * * * * * * *
         *  if transaction from dapp is approve transaction
         * * * * * * * * */

        // get token decimals
        const tokenDecimals = await AssetsContractController?.getTokenDecimals(
          String(selectedNetworkInfo?.networkID),
          String(to),
        )

        // get token symbol
        const tokenSymbol = await AssetsContractController?.getAssetSymbol(
          String(selectedNetworkInfo?.networkID),
          String(to),
        )
        setTokenSymbol(tokenSymbol)

        // decode data transaction
        const { spenderAddress, encodedAmount } = decodeApproveData(data)
        setSpenderAddress(spenderAddress)

        // get approve amount from contract data
        const originalApproveAmount = fromTokenMinimalUnit({
          minimalInput: util.hexToBN(encodedAmount),
          decimals: Number(tokenDecimals),
        })

        setProposedApproveAmount(originalApproveAmount)

        setUnapprovedTransactionApproveDappMeta(transactionMeta)
        getSelectedAccountAddress()
        refDappTransactionApproveModal.current?.open()
      } else {
        /** * * * * * * * *
         *  if transaction from dapp is !=approve transaction
         * * * * * * * * */

        if (
          (value === '0x0' || !value) &&
          data &&
          data !== '0x' &&
          to &&
          (await getMethodData(data)).name === TOKEN_METHOD_TRANSFER
        ) {
          const tokenData = data
            ? hstInterface.parseTransaction({ data })
            : undefined

          if (tokenData) {
            const toAddress = getTokenAddressParam(tokenData)

            transactionMeta.transaction.value =
              getTokenValueParamAsHex(tokenData)

            transactionMeta.transaction.to = toAddress
          }

          setUnapprovedTransactionMeta(transactionMeta)
          getSelectedAccountAddress()
          refDappTransactionModal.current?.open()
        } else {
          setUnapprovedTransactionMeta(transactionMeta)
          getSelectedAccountAddress()
          refDappTransactionModal.current?.open()
        }
      }
    },
    [
      AssetsContractController,
      getSelectedAccountAddress,
      selectedNetworkInfo?.networkID,
    ],
  )

  useEffect(() => {
    TransactionController?.hub.on(
      'unapprovedTransaction',
      onUnapprovedTransaction,
    )
    return () => {
      TransactionController?.hub.on(
        'unapprovedTransaction',
        onUnapprovedTransaction,
      )
    }
  }, [
    getSelectedAccountAddress,
    TransactionController?.hub,
    onUnapprovedTransaction,
    selectedAccountAddress,
  ])

  useEffect(() => {
    const listenerConnectDapp = () => {
      refApproveConnectionModal.current?.open()
    }
    ApprovalEmitter?.on('connect_to_dapp', listenerConnectDapp)
    return () => {
      ApprovalEmitter?.on('connect_to_dapp', listenerConnectDapp)
    }
  }, [ApprovalEmitter, originIcon])

  const FloatingComponent = useCallback(() => {
    if (insets.bottom === 0) {
      return
    } else {
      return <View style={[styles.floatComponent, { height: insets.bottom }]} />
    }
  }, [insets.bottom, styles.floatComponent])

  // ===================== DAPP TRANSACTION =====================

  /**
   * Action confirm transaction from 'unsubmited' transaction emit
   */
  const dappTransactionConfirm = useCallback(async () => {
    // submit toast notification
    // eslint-disable-next-line no-undef
    toast.show('', {
      data: {
        type: 'submited',
      } as ToastPayload,
    })
    refDappTransactionModal.current?.close()

    requestAnimationFrame(async () => {
      if (unapprovedTransactionMeta) {
        const { id } = unapprovedTransactionMeta

        const selectedTab = tabs.find((tab) => tab.id === activeTabId)
        const accountIndex = selectedTab?.selectedAccountIndex
        TransactionController?.approveTransaction(
          //@ts-ignore
          selectedNetworkInfo?.networkType,
          selectedNetworkInfo?.networkID,
          id,
          accountIndex,
        )
      }
    })
  }, [
    unapprovedTransactionMeta,
    tabs,
    TransactionController,
    selectedNetworkInfo?.networkType,
    selectedNetworkInfo?.networkID,
    activeTabId,
  ])

  /**
   * Action reject transaction from 'unsubmited' transaction emit
   */
  const dappTransactionReject = useCallback(() => {
    refDappTransactionModal.current?.close()
    requestAnimationFrame(async () => {
      if (unapprovedTransactionMeta) {
        const newTransactionMeta: TransactionMeta = {
          ...unapprovedTransactionMeta,
          status: TransactionStatus.rejected,
        }

        TransactionController?.updateTransaction(newTransactionMeta)

        TransactionController?.hub.emit(
          `${newTransactionMeta.id}:finished`,
          newTransactionMeta,
        )
      }
    })
  }, [TransactionController, unapprovedTransactionMeta])

  /**
   * render transaction modal when have swap transaction from dapp
   */

  const renderDappTransactionModal = useCallback(() => {
    return (
      <BottomSheet
        ref={refDappTransactionModal}
        FloatingComponent={FloatingComponent}
        childrenStyle={styles.modalInside}
      >
        <View style={styles.networkWrapperText}>
          <View style={styles.groupTitle}>
            {originIcon?.includes('.svg') ? (
              <SvgUri
                style={styles.originIcon}
                width="100%"
                height="100%"
                uri={originIcon}
              />
            ) : (
              <FastImage
                style={styles.originIconScale}
                source={{
                  uri: originIcon,
                }}
              />
            )}
            <Text variant="bold" style={styles.originText}>
              {origin}
            </Text>
          </View>
          <View style={styles.borderOrigin}>
            <View style={styles.icon}>
              {selectedNetworkInfo &&
                getIconNetworkWithNetworkID(selectedNetworkInfo?.networkID)}
            </View>
            <Text style={styles.networkText}>
              {selectedNetworkInfo?.nickname}
            </Text>
          </View>
        </View>
        <View style={styles.valueTextWrapper}>
          <View style={styles.marginHorizontal}>
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              variant="bold"
              style={styles.valuePreview}
              lineHeight={35}
            >
              {normalizeValueFromUnapproveTransactionMeta(
                unapprovedTransactionMeta,
              )}
            </Text>
          </View>
        </View>
        <View style={styles.wrapperGasFeeView}>
          <View style={styles.horizontalWrapper}>
            <Text style={styles.text}>Estimate gas fee :</Text>
            <Text variant="bold" style={styles.text}>
              {`${balanceFormat(
                estimateTransactionFeeAsDecimal(unapprovedTransactionMeta),
              )} ${selectedNetworkInfo?.symbol}`}
            </Text>
          </View>
          <View style={styles.horizontalWrapper}>
            <Text style={styles.text}>Address :</Text>
            <Text
              variant="bold"
              style={[styles.text, styles.textLimit]}
              ellipsizeMode="middle"
              numberOfLines={1}
            >
              {`${selectedAccountAddress}`}
            </Text>
          </View>
          <View style={styles.horizontalWrapper}>
            <Text style={styles.text}>Balance :</Text>
            <Text variant="bold" style={styles.text}>
              {`${
                balanceFormat(
                  TokenBalancesController?.getBalanceById(
                    String(selectedNetworkInfo?.networkID),
                  ),
                ) ?? ''
              } ${selectedNetworkInfo?.symbol}`}
            </Text>
          </View>
        </View>

        <View style={styles.btnWrapper}>
          <Button
            round
            text="Reject"
            variant="none"
            //@ts-ignore
            containerStyle={[styles.button, styles.buttonBorder]}
            onPress={dappTransactionReject}
          />
          <Button
            round
            text="Approve"
            variant="fulfill"
            containerStyle={styles.button}
            onPress={dappTransactionConfirm}
          />
        </View>
      </BottomSheet>
    )
  }, [
    selectedAccountAddress,
    FloatingComponent,
    TokenBalancesController,
    dappTransactionConfirm,
    dappTransactionReject,
    origin,
    originIcon,
    selectedNetworkInfo,
    styles.borderOrigin,
    styles.btnWrapper,
    styles.icon,
    styles.button,
    styles.buttonBorder,
    styles.groupTitle,
    styles.horizontalWrapper,
    styles.marginHorizontal,
    styles.modalInside,
    styles.networkText,
    styles.networkWrapperText,
    styles.originIcon,
    styles.originIconScale,
    styles.originText,
    styles.text,
    styles.textLimit,
    styles.valuePreview,
    styles.valueTextWrapper,
    styles.wrapperGasFeeView,
    unapprovedTransactionMeta,
  ])

  // ===================== DAPP APPROVE TRANSACTION =====================

  const handleOpenEditPermission = useCallback(() => {
    refEditPermissionModal.current?.open()
    refDappTransactionApproveModal.current?.close()
  }, [])

  const handleGoBack = useCallback(() => {
    refEditPermissionModal.current?.close()
    refDappTransactionApproveModal.current?.open()
  }, [])
  /**
   * Action confirm transaction from 'unsubmited' transaction emit
   */
  const dappTransactionApproveConfirm = useCallback(async () => {
    // submit toast notification
    // eslint-disable-next-line no-undef
    toast.show('', {
      data: {
        type: 'submited',
      } as ToastPayload,
    })

    refDappTransactionApproveModal.current?.close()

    requestAnimationFrame(async () => {
      if (unapprovedTransactionApproveDappMeta) {
        const {
          id,
          transaction: { to },
        } = unapprovedTransactionApproveDappMeta

        if (isCustomLimit) {
          // get error now remember to fix this
          const tokenDecimals =
            await AssetsContractController?.getTokenDecimals(
              String(currentTabNetworkID),
              String(to),
            )

          const uint = toTokenMinimalUnit({
            tokenValue: isCustomLimit
              ? spendLimitCustomValue
              : proposedApproveAmount,
            decimals: Number(tokenDecimals),
          }).toString(10)

          const approvalData = generateApproveData({
            spender: spenderAddress,
            value: Number(uint).toString(16),
          })

          const newApprovalTransaction: TransactionMeta = {
            ...unapprovedTransactionApproveDappMeta,
            transaction: {
              ...unapprovedTransactionApproveDappMeta.transaction,
              data: approvalData,
            },
          }

          // update transaction

          await TransactionController?.updateTransaction(
            newApprovalTransaction,
            selectedAccountIndex,
          )
        }

        // execute transaction
        await TransactionController?.approveTransaction(
          //@ts-ignore
          selectedNetworkInfo?.networkType,
          selectedNetworkInfo?.networkID,
          id,
          selectedAccountIndex,
        )
      }
    })
  }, [
    AssetsContractController,
    TransactionController,
    currentTabNetworkID,
    isCustomLimit,
    proposedApproveAmount,
    selectedAccountIndex,
    selectedNetworkInfo?.networkID,
    selectedNetworkInfo?.networkType,
    spendLimitCustomValue,
    spenderAddress,
    unapprovedTransactionApproveDappMeta,
  ])

  /**
   * Action reject transaction from 'unsubmited' transaction emit
   */
  const dappTransactionApproveReject = useCallback(() => {
    refDappTransactionApproveModal.current?.close()
    requestAnimationFrame(async () => {
      if (unapprovedTransactionApproveDappMeta) {
        const newTransactionMeta: TransactionMeta = {
          ...unapprovedTransactionApproveDappMeta,
          status: TransactionStatus.rejected,
        }

        TransactionController?.updateTransaction(newTransactionMeta)

        TransactionController?.hub.emit(
          `${newTransactionMeta.id}:finished`,
          newTransactionMeta,
        )
      }
    })
  }, [TransactionController, unapprovedTransactionApproveDappMeta])

  /**
   * render transaction modal when have approve transaction from dapp
   */
  const renderDappTransactionApproveModal = useCallback(() => {
    return (
      <BottomSheet
        ref={refDappTransactionApproveModal}
        FloatingComponent={FloatingComponent}
      >
        <View style={styles.networkWrapperText}>
          <View style={styles.groupTitle}>
            <View style={styles.icon}>
              {selectedNetworkInfo &&
                getIconNetworkWithNetworkID(selectedNetworkInfo?.networkID)}
            </View>
            <Text variant="bold" style={styles.networkText}>
              {selectedNetworkInfo?.nickname}
            </Text>
          </View>
        </View>
        <Text variant="bold" style={styles.textCenter}>
          {`Give this Dapp permission to access your ${tokenSymbol}?`}
        </Text>
        <View style={styles.box}>
          <View style={styles.doneIcon}>
            <DoneIcon />
          </View>
          {originIcon?.includes('.svg') ? (
            <SvgUri
              style={styles.originIcon}
              width="100%"
              height="100%"
              uri={originIcon}
            />
          ) : (
            <FastImage
              style={styles.originIcon}
              source={{
                uri: originIcon,
              }}
            />
          )}
        </View>
        <Text variant="bold" style={styles.originText}>
          {origin}
        </Text>
        <View style={styles.permissionDappTitleWrapper}>
          <Text style={[styles.text, styles.marginHorizontal]}>
            By granting this permission, you're allowing this dapp to access
            your funds.
          </Text>
          <TouchableOpacity
            style={styles.editPermissonButton}
            onPress={handleOpenEditPermission}
          >
            <EditIcon />
            <Text
              variant="bold"
              style={[styles.text, styles.editPermissionText]}
            >
              Edit Permission
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.wrapperGasFeeView}>
          <View style={styles.horizontalWrapper}>
            <Text style={styles.text}>Estimate gas fee :</Text>
            <Text variant="bold" style={styles.text}>
              {balanceFormat(
                estimateTransactionFeeAsDecimal(
                  unapprovedTransactionApproveDappMeta,
                ),
              )}
            </Text>
          </View>
          <View style={styles.horizontalWrapper}>
            <Text style={styles.text}>Address :</Text>
            <Text
              variant="bold"
              style={[styles.text, styles.textLimit]}
              ellipsizeMode="middle"
              numberOfLines={1}
            >
              {`${selectedAccountAddress}`}
            </Text>
          </View>
          <View style={styles.horizontalWrapper}>
            <Text style={styles.text}>Balance :</Text>
            <Text variant="bold" style={styles.text}>
              {`${balanceFormat(
                TokenBalancesController?.getBalanceById(
                  String(selectedNetworkInfo?.networkID),
                ),
              )} ${selectedNetworkInfo?.symbol}`}
            </Text>
          </View>
        </View>

        <View style={styles.btnWrapper}>
          <Button
            round
            text="Reject"
            variant="none"
            //@ts-ignore
            containerStyle={[styles.button, styles.buttonBorder]}
            onPress={dappTransactionApproveReject}
          />
          <Button
            round
            text="Approve"
            variant="fulfill"
            containerStyle={styles.button}
            onPress={dappTransactionApproveConfirm}
          />
        </View>
      </BottomSheet>
    )
  }, [
    FloatingComponent,
    TokenBalancesController,
    dappTransactionApproveConfirm,
    dappTransactionApproveReject,
    handleOpenEditPermission,
    origin,
    originIcon,
    selectedAccountAddress,
    selectedNetworkInfo,
    styles.box,
    styles.btnWrapper,
    styles.button,
    styles.buttonBorder,
    styles.doneIcon,
    styles.editPermissionText,
    styles.editPermissonButton,
    styles.groupTitle,
    styles.horizontalWrapper,
    styles.icon,
    styles.marginHorizontal,
    styles.networkText,
    styles.networkWrapperText,
    styles.originIcon,
    styles.originText,
    styles.permissionDappTitleWrapper,
    styles.text,
    styles.textCenter,
    styles.textLimit,
    styles.wrapperGasFeeView,
    tokenSymbol,
    unapprovedTransactionApproveDappMeta,
  ])

  // ===================== APPROVE CONNECTION WITH DAPP =====================

  const dappApproveConnectionConfirm = useCallback(() => {
    approvalRequest?.current?.resolve(true)
    refApproveConnectionModal.current?.close()
  }, [approvalRequest])

  const dappApproveConnectionReject = useCallback(() => {
    approvalRequest?.current?.resolve(false)
    refApproveConnectionModal.current?.close()
  }, [approvalRequest])

  const renderApproveConnectionModal = useCallback(() => {
    return (
      <BottomSheet
        ref={refApproveConnectionModal}
        FloatingComponent={FloatingComponent}
        childrenStyle={styles.modalInside}
      >
        <View style={styles.networkWrapperText}>
          <View style={styles.groupTitle}>
            <View style={styles.icon}>
              {selectedNetworkInfo &&
                getIconNetworkWithNetworkID(selectedNetworkInfo?.networkID)}
            </View>
            <Text variant="bold" style={styles.networkText}>
              {selectedNetworkInfo?.nickname}
            </Text>
          </View>
        </View>
        <Text lineHeight={20} variant="bold" style={styles.titleConnect}>
          Connect to this dapp?
        </Text>
        <View style={styles.box}>
          {originIcon?.includes('.svg') ? (
            <SvgUri
              style={styles.originIcon}
              width="100%"
              height="100%"
              uri={originIcon}
            />
          ) : (
            <FastImage
              resizeMode="cover"
              style={styles.originIcon}
              source={{
                uri: originIcon,
              }}
            />
          )}
        </View>
        <Text variant="bold" style={styles.originText}>
          {origin}
        </Text>

        <Text style={[styles.descriptionConnect, styles.marginHorizontal]}>
          By clicking connect, you allow this dapp to view your public address.
          This is an important security step to protect your data from potential
          phishing risks.
        </Text>

        <View style={styles.wrapperConnectContent}>
          <View style={styles.horizontalWrapper}>
            <Text style={styles.text}>Address :</Text>
            <Text
              variant="bold"
              style={[styles.text, styles.textLimit]}
              ellipsizeMode="middle"
              numberOfLines={1}
            >
              {`${PreferencesController?.getSelectedAddress(
                NetworkType.ERC20,
              )}`}
            </Text>
          </View>
          <View style={styles.horizontalWrapper}>
            <Text style={styles.text}>Balance :</Text>
            <Text variant="bold" style={styles.text}>
              {`${balanceFormat(
                TokenBalancesController?.getBalanceById(
                  String(selectedNetworkInfo?.networkID),
                ),
              )} ${selectedNetworkInfo?.symbol}`}
            </Text>
          </View>
        </View>

        <View style={styles.btnWrapper}>
          <Button
            round
            text="Reject"
            variant="none"
            //@ts-ignore
            containerStyle={[styles.button, styles.buttonBorder]}
            onPress={dappApproveConnectionReject}
          />
          <Button
            round
            text="Connect"
            variant="fulfill"
            containerStyle={styles.button}
            onPress={dappApproveConnectionConfirm}
          />
        </View>
      </BottomSheet>
    )
  }, [
    FloatingComponent,
    PreferencesController,
    TokenBalancesController,
    dappApproveConnectionConfirm,
    dappApproveConnectionReject,
    origin,
    originIcon,
    selectedNetworkInfo,
    styles.box,
    styles.btnWrapper,
    styles.button,
    styles.buttonBorder,
    styles.descriptionConnect,
    styles.groupTitle,
    styles.horizontalWrapper,
    styles.marginHorizontal,
    styles.modalInside,
    styles.networkText,
    styles.networkWrapperText,
    styles.originIcon,
    styles.originText,
    styles.text,
    styles.icon,
    styles.textLimit,
    styles.titleConnect,
    styles.wrapperConnectContent,
  ])

  // ===================== EDIT PERMISSION APPROVE CONTRACT =====================

  const handleSetSpendLimit = useCallback(
    (isCustomValue: boolean, customValue?: string) => {
      if (isCustomValue && customValue) {
        setSpendLimitCustomValue(customValue)
        setCustomLimit(true)
      } else {
        setCustomLimit(false)
      }
      refEditPermissionModal.current?.close()
      getSelectedAccountAddress()
      refDappTransactionApproveModal.current?.open()
    },
    [getSelectedAccountAddress],
  )

  const renderEditPermission = useCallback(() => {
    return (
      <BottomSheet
        ref={refEditPermissionModal}
        FloatingComponent={FloatingComponent}
        childrenStyle={styles.modalInside}
      >
        <View style={styles.networkWrapperText}>
          <View style={styles.rootPermissionEdit}>
            <TouchableOpacity
              style={styles.arrowLeftBack}
              onPress={handleGoBack}
            >
              <ArrowLeftBack
                color={theme.colors.text}
                style={styles.arrowLeftBack}
              />
            </TouchableOpacity>
            <Text variant="medium" style={styles.titlePermissionEdit}>
              Edit Permission
            </Text>
          </View>
        </View>
        <View style={styles.marginHorizontal}>
          <Text variant="bold" style={styles.textPermissionEdit}>
            Spend limit permission
          </Text>
          <Text style={[styles.textPermissionEdit, styles.disable]}>
            {`Allow`}
            <Text
              variant="bold"
              style={[styles.textPermissionEdit, styles.disable]}
            >
              {' '}
              {origin}
            </Text>{' '}
            {`to withdraw and spend up to the following amount:`}
          </Text>
          <EditPermissionSelection handleSetSpendLimit={handleSetSpendLimit} />
        </View>
      </BottomSheet>
    )
  }, [
    FloatingComponent,
    handleGoBack,
    handleSetSpendLimit,
    origin,
    styles.arrowLeftBack,
    styles.disable,
    styles.marginHorizontal,
    styles.modalInside,
    styles.networkWrapperText,
    styles.rootPermissionEdit,
    styles.textPermissionEdit,
    styles.titlePermissionEdit,
    theme.colors.text,
  ])

  return (
    <>
      {renderApproveConnectionModal()}
      {renderDappTransactionApproveModal()}
      {renderDappTransactionModal()}
      {renderEditPermission()}
    </>
  )
}

const useStyles = makeStyles<RootRPCMethodsUIProps>()(
  ({ colors, normalize, font }) => ({
    root: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    button: {
      flexGrow: 1,
      flex: 1,
      marginHorizontal: normalize(15)('horizontal'),
    },
    icon: {
      height: normalize(20)('moderate'),
      width: normalize(20)('moderate'),
    },
    buttonBorder: {
      borderColor: colors.basic,
      borderWidth: 1,
    },
    title: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: normalize(20)('vertical'),
    },
    floatComponent: {
      borderTopColor: colors.border,
      borderWidth: 0.3,
      backgroundColor: colors.background,
    },
    btnWrapper: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    modalInside: {
      paddingTop: normalize(5)('vertical'),
    },
    originIcon: {
      height: normalize(105)('moderate'),
      width: normalize(105)('moderate'),
      alignSelf: 'center',
    },
    originIconScale: {
      height: normalize(30)('moderate'),
      width: normalize(30)('moderate'),
      alignSelf: 'center',
    },
    originText: {
      alignSelf: 'center',
      fontSize: font.size.button,
      paddingLeft: normalize(5)('moderate'),
    },
    networkText: {
      fontSize: font.size.caption1,
      paddingLeft: normalize(5)('moderate'),
    },
    titlePermissionEdit: {
      fontSize: font.size.title1,
    },
    networkWrapperText: {
      paddingVertical: normalize(10)('moderate'),
      marginVertical: normalize(5)('moderate'),
      borderBottomWidth: 0.4,
      borderColor: colors.border,
    },
    groupTitle: {
      flexDirection: 'row',
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
    },
    valueTextWrapper: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'baseline',
      marginVertical: normalize(15)('vertical'),
    },
    valuePreview: {
      fontSize: normalize(32)('moderate'),
    },
    text: {
      fontSize: font.size.button,
      textAlign: 'center',
    },
    textPermissionEdit: {
      marginTop: normalize(20)('moderate'),
      fontSize: font.size.button,
    },
    disable: {
      marginTop: normalize(10)('moderate'),
      marginBottom: normalize(20)('moderate'),
      color: colors.disabled,
    },
    wrapperGasFeeView: {
      marginBottom: normalize(20)('horizontal'),
    },
    horizontalWrapper: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: normalize(10)('vertical'),
      paddingHorizontal: normalize(20)('horizontal'),
      borderTopWidth: 0.4,
      borderColor: colors.border,
    },
    titleConnect: {
      fontSize: font.size.h5,
      textAlign: 'center',
      marginTop: normalize(15)('vertical'),
      marginHorizontal: normalize(50)('horizontal'),
    },
    descriptionConnect: {
      fontSize: font.size.button,
      textAlign: 'center',
      justifyContent: 'center',
      marginVertical: normalize(20)('vertical'),
      marginHorizontal: normalize(20)('horizontal'),
    },
    marginHorizontal: {
      marginHorizontal: normalize(20)('horizontal'),
    },
    wrapperConnectContent: {
      borderColor: colors.border,
      marginBottom: normalize(20)('vertical'),

      paddingVertical: normalize(5)('vertical'),
    },
    permissionDappTitle: {
      fontSize: font.size.h4,
      textAlign: 'center',
      marginBottom: normalize(5)('vertical'),
    },
    permissionDappTitleWrapper: {
      width: '90%',
      alignSelf: 'center',
      marginVertical: normalize(15)('vertical'),
    },
    editPermissonButton: {
      flexDirection: 'row',
      alignSelf: 'center',
      alignItems: 'center',
      marginTop: normalize(5)('vertical'),
      padding: normalize(5)('moderate'),
    },
    editPermissionText: {
      color: colors.primary,
      fontSize: font.size.caption1,
      paddingLeft: normalize(5)('moderate'),
    },
    textInput: {
      marginTop: normalize(10)('moderate'),
      marginBottom: normalize(40)('moderate'),
    },
    textLimit: {
      width: '50%',
    },
    arrowLeftBack: {
      position: 'absolute',
      top: normalize(0)('horizontal'),
      left: normalize(10)('horizontal'),
      width: normalize(50)('horizontal'),
      height: normalize(35)('horizontal'),
      paddingLeft: normalize(20)('horizontal'),
      paddingTop: normalize(25)('horizontal'),
    },
    rootPermissionEdit: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    doneIcon: {
      position: 'absolute',
      alignSelf: 'center',
      zIndex: 100,
      right: normalize(-20)('moderate'),
      top: normalize(10)('moderate'),
    },
    box: {
      marginVertical: normalize(10)('vertical'),
      alignSelf: 'center',
      height: normalize(105)('moderate'),
      width: normalize(105)('moderate'),
    },
    borderOrigin: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'center',
      padding: normalize(5)('moderate'),
      marginTop: normalize(10)('moderate'),
      marginVertical: normalize(5)('moderate'),
      borderWidth: 0.5,
      borderColor: colors.border,
      borderRadius: 5,
    },
    textCenter: {
      textAlign: 'center',
      paddingHorizontal: normalize(15)('horizontal'),
    },
  }),
)
