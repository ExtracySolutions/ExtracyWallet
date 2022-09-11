import { itemTokenResult } from 'screens/AddToken/type'

import { Token } from '@extracy-wallet-controller'
import { getNetworkName } from './ultils'

// ToDo: Group ETH
// bởi vì ETH đang là native token của nhiều network
// phải group lại để đồng bộ với data bên server trả về.

const groupDataLikeApiResponse = (data: itemTokenResult[]) => {
  let primaryObj = data.shift()

  const obj = data.map((item: any) => {
    if (Array.isArray(primaryObj?.ref_ids)) {
      primaryObj?.ref_ids.push(item._id)
      return {
        ...item,
        id: primaryObj?.id,
        prv_id: item._id,
      }
    }
  })
  return [primaryObj, ...obj]
}

export const convertDataTokenList = (data: Token[]) => {
  let resultData: itemTokenResult[] = []

  let groupData: itemTokenResult[] = []

  data.forEach((element) => {
    element.platform.forEach((item) => {
      const obj = {
        _id: item.token_id,
        id: element.token_id,
        coingecko_id: element.coingecko_id ? element.coingecko_id : '',
        chain_id: item.chainID,
        network_name: item.networkName,
        type: item.networkType,
        symbol: item.symbol,
        name: item.symbol,
        decimals: item.decimals,
        address: '',
        image: element.image ? element.image : '',
        status: '',
        prv_id: null,
        ref_ids: [],
        isHide: element.isHide,
        isNative: item.isNative,
        isDataConvert: true,
      }
      if (element.platform.length > 1) {
        groupData.push(obj)
      } else {
        resultData.push(obj)
      }
    })
  })
  const resultGroupData = groupDataLikeApiResponse(groupData)

  return [...resultData, ...resultGroupData]
}

export const convertTokenForAdd = (
  item: itemTokenResult,
  master?: itemTokenResult,
) => {
  const chainID = item.chain_id + ''
  const networkType = item.type

  // TODO: check convert token have master or not
  if (master) {
    return {
      chainID,
      networkType,
      address: item.address,
      coingecko_id: master.coingecko_id,
      decimals: item.decimals,
      networkName: getNetworkName({ networkType: networkType as any, chainID }),
      symbol: master.symbol,
      token_id: master._id,
      image: master.image,
      isHide: false,
      name: master.name,
    }
  } else {
    return {
      chainID,
      networkType,
      address: item.address,
      coingecko_id: item.coingecko_id,
      decimals: item.decimals,
      networkName: getNetworkName({ networkType: networkType as any, chainID }),
      symbol: item.symbol,
      token_id: item._id,
      image: item.image,
      isHide: false,
      name: item.name,
    }
  }
}

export const AlmostEqual = (
  name: string,
  symbol: string,
  dataSearch: string,
  dataSearchLowercased: string,
) => {
  let points = 0
  // Todo: tìm kiếm theo thứ tự ưu và giống nhất
  // Todo: Điểm càng lớn ưu tiên càng cao
  if (name.toLowerCase().includes(dataSearchLowercased)) {
    points += 1
  }
  if (symbol.toLowerCase().includes(dataSearchLowercased)) {
    points += 1
  }

  if (name.includes(dataSearch)) {
    points += 2
  }
  if (symbol.includes(dataSearch)) {
    points += 2
  }

  if (name.length === dataSearch.length) {
    points += 3
  }
  if (symbol.length === dataSearch.length) {
    points += 3
  }
  return points
}
