export function blockTagParamIndex(payload: any) {
  switch (payload.method) {
    // blockTag is at index 2
    case 'eth_getStorageAt':
      return 2
    // blockTag is at index 1
    case 'eth_getBalance':
    case 'eth_getCode':
    case 'eth_getTransactionCount':
    case 'eth_call':
      return 1
    // blockTag is at index 0
    case 'eth_getBlockByNumber':
      return 0
    // there is no blockTag
    default:
      return undefined
  }
}
