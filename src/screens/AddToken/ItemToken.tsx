import React, { memo, useCallback, useState } from 'react'

import { FastImage, Switch, Text } from '@components'
import { useAppSelector } from '@hooks'
import { makeStyles } from '@themes'
import {
  convertWriteSqlite,
  convertTokenForAdd,
  DATABASE_NAME,
  error,
  INSERT_TABLE,
  success,
  TABLE_SQL_NAME,
} from '@ultils'
import Engine from 'core/Engine'
import { Pressable, View } from 'react-native'
import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage'
import { useDispatch } from 'react-redux'
import { addToken } from 'reduxs/reducers'

import { AddTokenProps, itemTokenResult, TokenItem } from './type'

interface resultSort extends itemTokenResult {
  points?: number
  token_id?: string
}
interface Props {
  item: resultSort
  tokenList: TokenItem[]
  handleToken: (token_id: string, isShow: boolean) => void
}

const ItemToken = ({ item, tokenList, handleToken }: Props) => {
  const { isHide, image, symbol, token_id, name, _id } = item

  const themeStore = useAppSelector((state) => state.root.theme.theme)

  const styles = useStyles(undefined, themeStore)
  const dispatch = useDispatch()

  const selectedAccountIndex = useAppSelector(
    (state) =>
      state.root.engine.backgroundState.PreferencesController
        ?.selectedAccountIndex,
  )

  const [isSwitch, setSwitch] = useState<boolean>(Boolean(isHide))

  const getSqlite = useCallback(async (): Promise<SQLiteDatabase> => {
    const db = await SQLite.openDatabase(
      { name: DATABASE_NAME },
      success,
      error,
    )
    return db
  }, [])

  const updateLocalDatabase = useCallback(
    async (_id: string, isHide: boolean) => {
      const db = await getSqlite()
      db.transaction((tx) => {
        tx.executeSql(
          `UPDATE ${TABLE_SQL_NAME} SET isHide = ${Number(
            !isHide,
          )} WHERE _id = "${_id}"`,
          [],
          () => {
            //success
            console.log('update token success')
          },
          (e) => {
            console.error(`INSERT INTO ${TABLE_SQL_NAME} error`, e)
          },
        )
      })
    },
    [getSqlite],
  )

  const addOneToken = async (token: any) => {
    await Engine.context.TokensController?.addToken(token)
  }

  const addTokens = async (token: any[]) => {
    await Engine.context.TokensController?.addTokens(token)
  }

  const updateTokenRedux = useCallback(async () => {
    const tokenListFromController =
      await Engine.context.TokensController?.getTokensBySelectAccount()

    if (tokenListFromController && selectedAccountIndex?.toString()) {
      dispatch(
        addToken({
          tokenParam: tokenListFromController,
          selectedAccount: selectedAccountIndex,
        }),
      )
    }
  }, [dispatch, selectedAccountIndex])

  const handleAddToken = useCallback(
    async (item: itemTokenResult) => {
      // TODO: check token riêng biệt không liên quan đến ref_ids.
      try {
        const db = await getSqlite()
        if (!(item.ref_ids.length > 0)) {
          const token = convertTokenForAdd(item)

          await addOneToken(token)

          if (item?.isTokenNotSupportYet) {
            const {
              ref_ids: ref,
              isHide: hide,
              isNative: native,
              isDataConvert: dataConvert,
            } = item

            const { ref_ids, isHide, isNative, isDataConvert } =
              convertWriteSqlite(
                ref as any,
                hide as any,
                native as any,
                dataConvert as any,
              )
            db.transaction((tx) => {
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
                  console.log('add token success')
                },
                (e) => {
                  console.error(`INSERT INTO ${TABLE_SQL_NAME} error`, e)
                },
              )
            })
          }
        }

        // TODO: check master token ( gồm ref_ids[] là mảng của các object con của nó)
        if (item.ref_ids.length > 0) {
          let tokens: any[] = []
          let QUERY_TEXT = `SELECT * FROM ${TABLE_SQL_NAME} WHERE `

          tokens.push(convertTokenForAdd(item))

          if (Array.isArray(item.ref_ids)) {
            item.ref_ids.forEach((token: any) => {
              QUERY_TEXT += `_id = '${token}' OR `
            })
          }

          await db.transaction((tx) => {
            tx.executeSql(
              QUERY_TEXT.slice(0, -3),
              [],
              (tx, results) => {
                const len = results.rows.length
                for (let i = 0; i < len; i++) {
                  const row = results.rows.item(i)

                  tokens.push(convertTokenForAdd(row, item))
                }
              },
              (e) => {
                console.error(`SELECT * FROM ${TABLE_SQL_NAME} WHERE id = ?`, e)
              },
            )
          })

          await addTokens(tokens)
        }
        updateTokenRedux()
        updateLocalDatabase(item._id, item.isHide as any)
      } catch (e) {
        console.error({ handleAddToken: e })
      }
    },
    [getSqlite, updateTokenRedux, updateLocalDatabase],
  )
  const handleChangeToken = useCallback(() => {
    // ToDo: check token added to wallet
    if (token_id) {
      requestAnimationFrame(() => {
        handleToken(token_id, !isSwitch)
        updateLocalDatabase(token_id, isSwitch)
      })
      setSwitch(!isSwitch)
      return
    }

    // ToDo: check token added to wallet and merged with local data
    if (_id) {
      const index = tokenList.findIndex(
        (item: TokenItem) => item.token_id === _id,
      )
      if (index !== -1) {
        requestAnimationFrame(() => {
          handleToken(_id, !isSwitch)
          if (token_id) {
            updateLocalDatabase(token_id, isSwitch)
          }
        })
        setSwitch(!isSwitch)
        return
      }
    }

    // ToDo: token not added to wallet
    handleAddToken(item as any)
    setSwitch(!isSwitch)
  }, [
    token_id,
    _id,
    handleAddToken,
    item,
    isSwitch,
    handleToken,
    updateLocalDatabase,
    tokenList,
  ])

  return (
    <View style={styles.containerItem}>
      <FastImage
        resizeMode="stretch"
        style={styles.image}
        source={{ uri: image }}
      />
      <View style={styles.boxText}>
        <Text variant="medium" fontSize={16} lineHeight={20} numberOfLines={1}>
          {name || symbol}
        </Text>
        <View style={styles.symbol}>
          <Text
            variant="bold"
            fontSize={12}
            lineHeight={14}
            style={styles.painted}
          >
            {symbol}
          </Text>
        </View>
      </View>
      <Pressable style={styles.btnSwitch}>
        <Switch isSwitch={!isSwitch} onPress={handleChangeToken} />
      </Pressable>
    </View>
  )
}
function arePropsEqual(prevProps: any, nextProps: any) {
  return prevProps._id === nextProps._id //It could be something else not has to be id.
}
export default memo(ItemToken, arePropsEqual)
// export default ItemToken
const useStyles = makeStyles<AddTokenProps>()(({ normalize, colors }) => ({
  containerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: normalize(7)('vertical'),
    marginHorizontal: normalize(16)('horizontal'),
    backgroundColor: colors.white,
    borderRadius: normalize(16)('moderate'),
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    padding: normalize(12)('moderate'),
  },
  image: {
    width: normalize(32)('moderate'),
    height: normalize(32)('moderate'),
  },
  painted: {
    color: colors.grey8,
    flexShrink: 1,
  },
  symbol: {
    backgroundColor: colors.grey14,
    borderRadius: normalize(4)('moderate'),
    paddingHorizontal: normalize(4)('moderate'),
    marginLeft: normalize(4)('vertical'),
  },
  btnSwitch: {
    alignItems: 'flex-end',
    paddingVertical: normalize(5)('vertical'),
    paddingLeft: normalize(5)('horizontal'),
    marginRight: normalize(-5)('horizontal'),
  },
  boxText: {
    flexDirection: 'row',
    flex: 1,
    marginLeft: normalize(12)('vertical'),
    alignItems: 'center',
  },
}))
