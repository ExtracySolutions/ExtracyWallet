import Storage from '@react-native-community/async-storage'
import Engine from 'core/Engine'
import { MemStoreProp } from '@extracy-wallet-controller'

import { AsyncStorageKeys } from './asyncStorageKeys'
// import EncryptedStorage from 'react-native-encrypted-storage'

/**
 * store Vault
 * @param vault
 */
export async function storeVault(vault: string): Promise<void> {
  try {
    await Storage.setItem(AsyncStorageKeys.vault, vault)
  } catch (error) {
    console.log('Storage vault error :', error)
  }
}

/**
 * Retrieve vault
 * @returns
 */
export async function retrieveVault(): Promise<string | undefined> {
  try {
    const vault = await Storage.getItem(AsyncStorageKeys.vault)
    if (vault) {
      return vault
    } else {
      throw new Error('Vault not found!')
    }
  } catch (error) {
    console.log('Retrieve vault error :', error)
  }
}

export async function changeVaultPasscode(
  oldPasscode: string,
  newPasscode: string,
) {
  try {
    // step 1 : get old seedphrase from keychain
    const { KeyringController, PreferencesController } = Engine.context

    if (KeyringController && PreferencesController) {
      const oldPrefs = PreferencesController.state
      var vault: MemStoreProp | undefined
      const mnemonic = await KeyringController.exportSeedPhrase(oldPasscode)
      console.log(
        'mnemonic',
        mnemonic,
        JSON.stringify(mnemonic).replace(/"/g, ''),
      )

      /**  step 2 : createNewVaultAndRestore with new pass and seedphrase
                    Recreate keyring with password given to this method
      */
      if (mnemonic) {
        vault = await KeyringController.createNewVaultAndRestore(
          newPasscode,
          mnemonic,
        )
        console.log('[vault]', vault)
      }

      // restore old PreferencesController state
      await PreferencesController.update(oldPrefs)
      return vault
    }
  } catch (error) {
    console.log('[ERROR]', error)
  }
}

export async function setAppLaunch(): Promise<void> {
  try {
    Storage.setItem(AsyncStorageKeys.hasLaunched, 'true')
  } catch (error) {
    console.log('[ERROR]', error)
  }
}

export async function clearAll(): Promise<void> {
  try {
    await Storage.clear()
  } catch (e) {
    throw new Error('Vault not found!')
  }
}
