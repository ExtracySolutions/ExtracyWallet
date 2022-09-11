import { useEffect, useState } from 'react'

import { useAppDispatch, useAppSelector } from '@hooks'
import Engine from 'core/Engine'
import { isEmpty } from 'lodash'
import { hideToken } from 'reduxs/reducers'

import { Token } from '@extracy-wallet-controller'

const useWalletInfo = () => {
  const dispatch = useAppDispatch()
  const { TokensController } = Engine.context
  const tokenRedux = useAppSelector((state) => state.root.tokenList.tokenList)

  const selectedAccountIndex = useAppSelector(
    (state) =>
      state.root.engine.backgroundState.PreferencesController
        ?.selectedAccountIndex,
  )

  //Todo: remove sonala because not supported yet add token sonala
  const remoteSolana = tokenRedux[Number(selectedAccountIndex)].filter(
    (item) => item.token_id !== 'solana',
  )

  const [tokenList, setTokenList] = useState<Token[]>(
    selectedAccountIndex?.toString() ? remoteSolana : [],
  )

  const handleToken = (token_id: string, isShow: boolean) => {
    // TODO : handle token on controller
    TokensController?.hideToken(token_id, isShow)

    // TODO :handle token on redux local
    selectedAccountIndex?.toString() &&
      dispatch(
        hideToken({
          token_id,
          isHide: isShow,
          selectedAccount: selectedAccountIndex,
        }),
      )
  }
  useEffect(() => {
    let tokens = []
    if (selectedAccountIndex?.toString()) {
      for (var key of Object.keys(remoteSolana)) {
        const checkPlatfrom = remoteSolana[+key].platform.find((item) => {
          return item.isHide === false
        })
        if (!isEmpty(checkPlatfrom)) {
          tokens.push(remoteSolana[+key])
        }
      }
    }
    Promise.all(tokens)
    setTokenList(tokens)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAccountIndex, tokenRedux])

  return { tokenList, handleToken }
}

export default useWalletInfo
