import React, { FC, useCallback, useEffect } from 'react'

import { Container, Header } from '@components'
import { useAppSelector } from '@hooks'
import { makeStyles } from '@themes'
import {
  convertDataTokenList,
  convertWriteSqlite,
  CREATE_TABLE,
  DATABASE_NAME,
  error,
  INSERT_TABLE,
  success,
  TABLE_SQL_NAME,
} from '@ultils'
import useWalletInfo from 'hooks/useWalletInfo'
import { useNavigation } from 'navigation/NavigationService'
import { BackHandler } from 'react-native'
import SQLite from 'react-native-sqlite-storage'
import { useDispatch } from 'react-redux'
import { changeStatusFirst } from 'reduxs/reducers'
import { useGetListTokenFromServerQuery } from 'reduxs/services'

import { ListTokenResponse } from './ListTokenResponse'
import { Loading } from './Loading'
import { Search } from './Search'
import { AddTokenProps } from './type'

//TODO: hide "<Header/> and <ListTokenResponse/>" for full screen scan
//* QRCode scan on component Search

// SQLite.DEBUG(true)
SQLite.enablePromise(true)
export const AddToken: FC<AddTokenProps> = (props) => {
  const themeStore = useAppSelector((state) => state.root.theme.theme)

  const { isFirst } = useAppSelector((state) => state.root.addTokenList)
  const styles = useStyles(props, themeStore)
  const [isScan, setIsScan] = React.useState<boolean>(false)

  const { tokenList } = useWalletInfo()
  const dispatch = useDispatch()
  const { data, isSuccess, isError } = useGetListTokenFromServerQuery()

  const checkDataSetLocal = useCallback(async () => {
    try {
      const db = await SQLite.openDatabase(
        { name: DATABASE_NAME, location: 'default' },
        success,
        error,
      )
      db.transaction((tx) => {
        tx.executeSql(
          `DROP TABLE IF EXISTS ${TABLE_SQL_NAME}`,
          [],
          () => {
            // success
          },
          (e) => {
            console.error(`DROP TABLE IF EXISTS ${TABLE_SQL_NAME}`, e)
          },
        )
        tx.executeSql(CREATE_TABLE, [], () => {
          // success
        })

        const allData = data
          ? [...data, ...convertDataTokenList(tokenList)]
          : [...convertDataTokenList(tokenList)]
        allData?.forEach((item) => {
          const {
            ref_ids: ref,
            isHide: hide,
            isNative: native,
            isDataConvert: dataConvert,
          } = item

          const { ref_ids, isHide, isNative, isDataConvert } =
            convertWriteSqlite(ref, hide, native, dataConvert)
          tx.executeSql(
            INSERT_TABLE,
            [
              item._id,
              item.id,
              item.coingecko_id,
              +item.chain_id,
              item.network_name,
              item.type,
              item.symbol,
              item.name,
              +item.decimals,
              item.address,
              item.image,
              item.status,
              item.prv_id,
              ref_ids,
              isHide,
              isNative,
              isDataConvert,
            ],
            () => {
              //success
            },
            (e) => {
              console.error(`INSERT INTO ${TABLE_SQL_NAME} error`, e)
            },
          )
        })
      })
    } catch (e) {
      console.error('checkDataSetLocal', e)
    }
  }, [data, tokenList])

  const navigation = useNavigation()

  const backHandler = useCallback(() => {
    navigation.goBack()
    return true
  }, [navigation])

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backHandler)
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backHandler)
    }
  }, [backHandler])

  useEffect(() => {
    if (isFirst && isSuccess && tokenList) {
      checkDataSetLocal().then(() => dispatch(changeStatusFirst(false)))
    }

    if (isError) {
      dispatch(changeStatusFirst(false))
    }
  }, [isSuccess, isFirst, tokenList, isError, dispatch, checkDataSetLocal])

  return (
    <>
      <Container style={styles.root}>
        {!isScan && <Header title={'Token List'} />}
        <Search isScan={isScan} setIsScan={setIsScan} />
        {!isScan && <ListTokenResponse />}
      </Container>
      {isFirst && <Loading />}
    </>
  )
}

const useStyles = makeStyles<AddTokenProps>()(({ colors }) => ({
  root: {
    flexDirection: 'column',
    backgroundColor: colors.grey16,
  },
}))
