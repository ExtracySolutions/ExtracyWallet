import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { ClearIcon, QRIcon } from '@assets/icons'
import { TextInput } from '@components'
import { useAppSelector } from '@hooks'
import { ScanQR } from '@screens'
import { makeStyles } from '@themes'
import useDebounce from 'hooks/useDebounce'
import { TouchableOpacity } from 'react-native'
import { useDispatch } from 'react-redux'
import { changeDataSearchToken } from 'reduxs/reducers'

import { PropsSearch } from './type'

export const Search = ({ isScan, setIsScan }: PropsSearch) => {
  const themeStore = useAppSelector((state) => state.root.theme.theme)
  const styles = useStyles(themeStore)
  const dispatch = useDispatch()

  const [searchText, setSearchText] = useState<string>('')
  const debouncedValue = useDebounce<string>(searchText, 300)

  const clear = useCallback(() => {
    setSearchText('')
    dispatch(changeDataSearchToken(''))
  }, [dispatch])

  const handleScan = useCallback(() => {
    setIsScan(true)
  }, [setIsScan])

  const rightIconAddressComponent = useMemo(() => {
    if (searchText) {
      return (
        <TouchableOpacity onPress={clear} style={styles.rightIconAddress}>
          <ClearIcon />
        </TouchableOpacity>
      )
    }
    return (
      <TouchableOpacity onPress={handleScan} style={styles.rightIconAddress}>
        <QRIcon />
      </TouchableOpacity>
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setIsScan, styles.rightIconAddress, searchText])

  useEffect(() => {
    if (isScan) {
      clear()
    }
  }, [isScan, dispatch, clear])

  useEffect(() => {
    dispatch(changeDataSearchToken(debouncedValue.trim()))

    return () => {
      dispatch(changeDataSearchToken(''))
    }
  }, [debouncedValue, dispatch])

  if (isScan) {
    return <ScanQR setIsScan={setIsScan} getDataSearch={setSearchText} />
  }

  return (
    <TextInput
      containerStyle={styles.containerStyle}
      radius={16}
      height={48}
      onChangeText={setSearchText}
      value={searchText}
      placeholder="Search for Token Name or Address"
      style={styles.textInput}
      rightIcon={rightIconAddressComponent}
    />
  )
}

const useStyles = makeStyles()(({ normalize }) => ({
  containerStyle: {
    margin: normalize(16)('moderate'),
  },
  textInput: {
    paddingLeft: normalize(10)('horizontal'),
  },
  rightIconAddress: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    paddingVertical: normalize(10)('moderate'),
    paddingLeft: normalize(10)('moderate'),
  },
}))
