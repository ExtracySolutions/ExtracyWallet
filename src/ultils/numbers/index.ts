const numberToBN = require('number-to-bn')

/**
 * Handles wie input to have less or equal to 18 decimals
 *
 * @param {string} wei - Amount in decimal notation
 * @returns {string} - Number string with less or equal 18 decimals
 */
export function handleWeiNumber(wei: string) {
  const comps = wei.split('.')
  let fraction = comps[1]
  if (fraction && fraction.length > 18) {
    fraction = fraction.substring(0, 18)
  }
  const finalWei = fraction ? [comps[0], fraction].join('.') : comps[0]
  return finalWei
}

/**
 * Converts fiat number as human-readable fiat string to wei expressed as a BN
 *
 * @param {string} fiat - Fiat number
 * @param {number} conversionRate - ETH to current currency conversion rate
 * @returns {Object} - The converted balance as BN instance
 */
export function fiatNumberToWei(fiat: string, conversionRate: number) {
  const floatFiatConverted = parseFloat(fiat) / conversionRate
  if (
    !floatFiatConverted ||
    isNaN(floatFiatConverted) ||
    floatFiatConverted === Infinity
  ) {
    return '0x0'
  }
  const base = Math.pow(10, 18)
  let weiNumber = Math.trunc(base * floatFiatConverted)
  // avoid decimals
  let weiNumberStr = weiNumber
    .toLocaleString('fullwide', { useGrouping: false })
    .split('.')
  const weiBN = numberToBN(weiNumberStr[0])
  return weiBN
}
