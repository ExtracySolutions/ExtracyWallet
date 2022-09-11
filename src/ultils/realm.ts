import Realm, { ObjectSchema } from 'realm'

interface ITask {
  _id: string
  id: string
  coingecko_id: string
  chain_id: number
  network_name: string
  type: string
  symbol: string
  name: string
  decimals: number
  address: string
  image: string
  status: string
  prv_id: string
  ref_ids: string[]
  isHide: boolean
  isNative: boolean
  isDataConvert: boolean
}
export type ITaskObject = ITask & Realm.Object
export const PATH_REALM = 'AllTokenSchema'
const ItemToken: ObjectSchema = {
  name: PATH_REALM,
  properties: {
    _id: 'string',
    id: 'string',
    coingecko_id: 'string',
    chain_id: 'int',
    network_name: 'string',
    type: 'string',
    symbol: 'string',
    name: 'string',
    decimals: 'int',
    address: 'string',
    image: 'string',
    status: 'string',
    prv_id: 'string',
    ref_ids: 'string?[]',
    isHide: 'bool',
    isNative: 'bool',
    isDataConvert: 'bool',
  },
  primaryKey: '_id',
}
export function getRealm() {
  return Realm.open({
    path: PATH_REALM,
    schema: [ItemToken],
  })
}
