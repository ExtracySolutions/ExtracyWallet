import { SQLError } from 'react-native-sqlite-storage'
export const DATABASE_NAME = 'OBL.db'
export const TABLE_SQL_NAME = 'TokenList'
export const CREATE_TABLE = `CREATE TABLE IF NOT EXISTS ${TABLE_SQL_NAME} ( _id VARCHAR(100) PRIMARY KEY, id VARCHAR(100), coingecko_id VARCHAR(100), chain_id INT, network_name VARCHAR(100), type VARCHAR(100), symbol VARCHAR(100), name VARCHAR(100), decimals INT, address VARCHAR(100), image VARCHAR(100), status VARCHAR(100), prv_id VARCHAR(100), ref_ids VARCHAR(10000), isHide BOOLEAN, isNative BOOLEAN, isDataConvert BOOLEAN)`
export const INSERT_TABLE = `INSERT OR REPLACE INTO ${TABLE_SQL_NAME} VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
export const error = (e: SQLError) => {
  console.log('open database error', e)
}
export const success = () => {
  // console.log('open database success ')
}

export const convertReadSqlite = (
  ref_ids: string,
  isHide: number,
  isNative: number,
  isDataConvert: number,
) => {
  const ref_ids_converted = ref_ids ? ref_ids.split(',') : []
  const isHide_converted = Boolean(isHide)
  const isNative_converted = Boolean(isNative)
  const isDataConvert_converted = Boolean(isDataConvert)

  return {
    ref_ids: ref_ids_converted,
    isHide: isHide_converted,
    isNative: isNative_converted,
    isDataConvert: isDataConvert_converted,
  }
}
export const convertWriteSqlite = (
  ref_ids: string | string[],
  isHide: boolean,
  isNative: boolean,
  isDataConvert: boolean,
) => {
  const ref_ids_converted = ref_ids.toString()
  const isHide_converted = isHide === false ? 0 : 1
  const isNative_converted = isNative === true ? 1 : 0
  const isDataConvert_converted = isDataConvert === true ? 1 : 0
  return {
    ref_ids: ref_ids_converted,
    isHide: isHide_converted,
    isNative: isNative_converted,
    isDataConvert: isDataConvert_converted,
  }
}
