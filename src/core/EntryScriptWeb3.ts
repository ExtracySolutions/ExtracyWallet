import { Platform } from 'react-native'
import RNFS from 'react-native-fs'

const EntryScriptWeb3 = {
  entryScriptWeb3: '',

  async init() {
    this.entryScriptWeb3 =
      Platform.OS === 'ios'
        ? await RNFS.readFile(`${RNFS.MainBundlePath}/your-file.ts`, 'utf8')
        : await RNFS.readFileAssets(`yourfile.ts`)

    return this.entryScriptWeb3
  },
  async get() {
    // Return from cache
    if (this.entryScriptWeb3) {
      return this.entryScriptWeb3
    }

    // If for some reason it is not available, get it again
    return await this.init()
  },
}

export default EntryScriptWeb3
