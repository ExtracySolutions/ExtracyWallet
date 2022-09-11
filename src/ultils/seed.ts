/**
 *  generate mnemonic
 * @returns mnemonic
 */
export async function generateMnemonic(): Promise<{ mnemonic: string }> {
  const bip39 = await import('@medardm/react-native-bip39')
  const mnemonic = bip39.generateMnemonic(128)
  return { mnemonic }
}
