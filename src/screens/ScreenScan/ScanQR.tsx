import React, { FC, useCallback, useEffect } from 'react'

import { Scanner } from '@components'
import { PERMISSION_TYPE, usePermission } from '@hooks'
import { BackHandler } from 'react-native'

export type PropsType = {
  setIsScan: (boolean: boolean) => void
  getDataSearch: (string: string) => void
}

export const ScanQR: FC<PropsType> = (props) => {
  const { setIsScan, getDataSearch } = props

  const { showPermissionDialog } = usePermission()
  const handleCloseScan = useCallback(() => {
    setIsScan(false)
  }, [setIsScan])
  const backHandler = useCallback(() => {
    handleCloseScan()
    return true
  }, [handleCloseScan])

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backHandler)
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backHandler)
    }
  }, [backHandler])

  const handleValidate = (e: string) => {
    const result = e.trim()

    if (result === '' || !result) {
      getDataSearch('')
    } else {
      getDataSearch(e)
    }

    handleCloseScan()
    return
  }
  useEffect(() => {
    const checkPermission = async () => {
      const resultPermission = await showPermissionDialog(
        PERMISSION_TYPE.camera,
      )
      if (resultPermission === true) {
        return
      }
      handleCloseScan()
    }
    checkPermission()
  }, [handleCloseScan, showPermissionDialog])

  return <Scanner onRead={handleValidate} back={handleCloseScan} />
}
