import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useAppSelector } from '@hooks'
import { makeStyles } from '@themes'
import {
  AlmostEqual,
  convertReadSqlite,
  DATABASE_NAME,
  DEFAULT_FREQUENT_RPC,
  error,
  IMAGE_TOKEN_DEFAULT,
  success,
  TABLE_SQL_NAME,
} from '@ultils'
import Engine from 'core/Engine'
import useWalletInfo from 'hooks/useWalletInfo'
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  View,
} from 'react-native'
import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage'
import { isAddress } from 'web3-utils'

import ItemToken from './ItemToken'
import { Loading } from './Loading'
import TokenNotFound from './TokenNotFound'
import { AddTokenProps, itemTokenResult } from './type'
interface resultSort extends itemTokenResult {
  points?: number | undefined
}

const ListEmptyComponent = () => <TokenNotFound />

let num = 25 // This is the number which defines how many data will be loaded for every 'onReachEnd'
let initialLoadNumber = 20 // This is the number which defines how many data will be loaded on first open

export const ListTokenResponse = () => {
  const { tokenList, handleToken } = useWalletInfo()
  const themeStore = useAppSelector((state) => state.root.theme.theme)
  const styles = useStyles(undefined, themeStore)

  const { dataSearch } = useAppSelector((state) => state.root.addTokenList)
  const [dataTokenSearch, setDataTokenSearch] = useState<resultSort[]>([])
  const [dataSource, setDataSource] = useState<resultSort[] | any[]>(() => {
    return tokenList.sort((a, b) => Number(b.isHide) - Number(a.isHide))
  }) //Contains limited number of data
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [offset, setOffset] = useState(1) //Its Like Page number
  let renderRef = useRef<number>(0)

  const windowSize = useMemo(
    () => (dataTokenSearch.length > 50 ? dataTokenSearch.length / 4 : 21),
    [dataTokenSearch.length],
  )

  const keyExtractor = useCallback(
    (item: any) =>
      item?.token_id ? item?.token_id.toString() : item?._id.toString(),
    [],
  )

  const getData = () => {
    if (!dataSearch) {
      return
    }
    // When scrolling we set data source with more data.
    if (
      dataSource.length < dataTokenSearch.length &&
      dataTokenSearch.length !== 0
    ) {
      setOffset(offset + 1)
      setDataSource(dataTokenSearch.slice(0, offset * num)) //We changed dataSource.
    }
  }

  const renderItem = ({ item }: { item: resultSort }) => (
    <ItemToken
      item={item}
      tokenList={tokenList as any}
      handleToken={handleToken}
    />
  )

  const ItemSeparatorComponent = useCallback(
    () => <View style={styles.ItemSeparatorComponent} />,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const checkSymbolAndDecimalsByAddressAndNetWork = useCallback(
    async (dataSearch: string) => {
      let data: resultSort[] = []
      for (const network of DEFAULT_FREQUENT_RPC) {
        try {
          const [symbol, decimals] = await Promise.all([
            Engine.context.AssetsContractController?.getAssetSymbol(
              network.token_id,
              dataSearch,
            ),
            Engine.context.AssetsContractController?.getTokenDecimals(
              network.token_id,
              dataSearch,
            ),
          ])

          if (symbol && decimals) {
            const name =
              await Engine.context.AssetsContractController?.getAssetName(
                network.token_id,
                dataSearch,
              )

            data.push({
              address: `${dataSearch}`,
              chain_id: Number(network.chainID),
              decimals: decimals,
              network_name: network.nickname,
              type: network.type,
              coingecko_id: '',
              symbol,
              _id: `${dataSearch}`,
              image: IMAGE_TOKEN_DEFAULT,
              isHide: true,
              id: `${dataSearch}`,
              isDataConvert: false,
              isNative: false,
              name: name || '',
              prv_id: null,
              ref_ids: '',
              status: '',
              isTokenNotSupportYet: true,
            })
            break
          }
        } catch (e) {}
      }
      return Promise.all(data)
    },
    [],
  )

  const searchByAddress = useCallback(
    (SQLite: SQLite.SQLiteDatabase, dataSearch: string) => {
      SQLite.transaction((tx) => {
        tx.executeSql(
          `SELECT * FROM ${TABLE_SQL_NAME} WHERE address LIKE '${dataSearch}'`,
          [],
          (tx, result) => {
            const data = [result.rows.item(0)]

            //TODO: token on local database
            if (result.rows.length !== 0) {
              // TODO: find and return object master
              if (data[0].prv_id != null) {
                tx.executeSql(
                  `SELECT * FROM ${TABLE_SQL_NAME} WHERE id LIKE "${data[0].id}" AND ref_ids != '' AND prv_id IS NULL OR id LIKE "${data[0].id}" AND ref_ids = '' AND prv_id IS NULL`,
                  [],
                  (_, result) => {
                    const temp: itemTokenResult[] = []
                    const length = result.rows.length
                    for (let i = 0; i < length; ++i) {
                      const {
                        ref_ids: ref,
                        isHide: hide,
                        isNative: native,
                        isDataConvert: dataConvert,
                      } = result.rows.item(i)

                      const { ref_ids, isHide, isNative, isDataConvert } =
                        convertReadSqlite(ref, hide, native, dataConvert)

                      temp.push({
                        ...result.rows.item(i),
                        ref_ids,
                        isHide,
                        isNative,
                        isDataConvert,
                      })
                    }

                    return setDataTokenSearch(temp)
                  },
                )
              }

              //TODO: return object token only not master
              setDataTokenSearch(data)
            }

            //TODO: token not found on local database
            if (result.rows.length === 0) {
              setIsLoading(true)
              checkSymbolAndDecimalsByAddressAndNetWork(dataSearch).then(
                (data) => {
                  if (data.length !== 0) {
                    setDataTokenSearch(data)
                  } else {
                    setDataTokenSearch([])
                  }
                  setIsLoading(false)
                },
              )
            }
          },
          (e) => {
            console.error(`Error SELECT ${TABLE_SQL_NAME}`, e)
          },
        )
      })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const searchByNameOrSymbol = useCallback(
    (SQLite: SQLite.SQLiteDatabase, dataSearch: string) => {
      SQLite.transaction((tx) => {
        tx.executeSql(
          `SELECT * FROM ${TABLE_SQL_NAME} WHERE name LIKE '${dataSearch}%' AND ref_ids != '' AND prv_id IS NULL OR name LIKE '${dataSearch}%' AND ref_ids = '' AND prv_id IS NULL Or symbol LIKE '${dataSearch}%' AND ref_ids != '' AND prv_id IS NULL OR symbol LIKE '${dataSearch}%' AND ref_ids = '' AND prv_id IS NULL`,
          [],
          (_, result) => {
            const temp: resultSort[] = []
            const length = result.rows.length
            const dataSearchLowercased = dataSearch.toLowerCase()
            for (let i = 0; i < length; ++i) {
              const {
                ref_ids: ref,
                isHide: hide,
                isNative: native,
                isDataConvert: dataConvert,
                name,
                symbol,
              } = result.rows.item(i)

              const { ref_ids, isHide, isNative, isDataConvert } =
                convertReadSqlite(ref, hide, native, dataConvert)

              let points = AlmostEqual(
                name,
                symbol,
                dataSearch,
                dataSearchLowercased,
              )

              temp.push({
                ...result.rows.item(i),
                ref_ids,
                isHide,
                isNative,
                isDataConvert,
                points,
              })
            }

            const dataSorted = temp.sort((a, b) => {
              if (a.points && b.points) {
                return b.points - a.points
              }
              return 0
            })
            setDataTokenSearch(dataSorted)
          },
          (e) => {
            console.error(`Error SELECT ${TABLE_SQL_NAME}`, e)
          },
        )
      })
    },
    [],
  )
  const getSqlite = useCallback(async (): Promise<SQLiteDatabase> => {
    const db = await SQLite.openDatabase(
      { name: DATABASE_NAME },
      success,
      error,
    )
    return db
  }, [])

  const handleSearch = async () => {
    try {
      const db = await getSqlite()

      //TODO:dataSearch is address
      if (isAddress(dataSearch.toUpperCase())) {
        searchByAddress(db, dataSearch)
        return
      }

      // ToDo:  dataSearch is name or symbol
      searchByNameOrSymbol(db, dataSearch)
      return
    } catch (e) {
      console.error('handleSearch', e)
    }
  }
  const onScrollBeginDrag = () => {
    Keyboard.dismiss()
  }

  useEffect(() => {
    if (dataSearch) {
      handleSearch()
      return
    }

    //ToDO: when dataSearch is ''
    if (!dataSearch) {
      const dataSort = tokenList.sort(
        (a, b) => Number(a.isHide) - Number(b.isHide),
      )

      setDataSource(dataSort)
      return
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSearch])

  useEffect(() => {
    //Here we setting our data source on first open.
    const data = dataTokenSearch.slice(0, offset * initialLoadNumber)

    setDataSource(data)
  }, [dataTokenSearch, offset])
  useEffect(() => {
    if (renderRef.current === 0 && tokenList.length !== 0) {
      const dataSort = tokenList.sort(
        (a, b) => Number(a.isHide) - Number(b.isHide),
      )

      setDataSource(dataSort)
      renderRef.current += 1
    }
  }, [tokenList])
  if (isLoading) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Loading />
      </KeyboardAvoidingView>
    )
  }

  return (
    <FlatList
      data={dataSource}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ItemSeparatorComponent={ItemSeparatorComponent}
      ListFooterComponent={ItemSeparatorComponent}
      ListEmptyComponent={ListEmptyComponent}
      showsVerticalScrollIndicator={false}
      initialNumToRender={initialLoadNumber}
      windowSize={windowSize} //If you have scroll stuttering but working fine when 'disableVirtualization = true' then use this windowSize, it fix the stuttering problem.
      maxToRenderPerBatch={num}
      updateCellsBatchingPeriod={num / 2}
      onEndReachedThreshold={offset < 10 ? offset * (offset === 1 ? 2 : 2) : 20} //While you scolling the offset number and your data number will increases.So endReached will be triggered earlier because our data will be too many
      onEndReached={getData}
      removeClippedSubviews={true}
      onScrollBeginDrag={onScrollBeginDrag}
    />
  )
}

const useStyles = makeStyles<AddTokenProps>()(({ normalize }) => ({
  ItemSeparatorComponent: {
    height: normalize(12)('vertical'),
  },
}))
