import axios from 'axios'

export const oblWalletApi = {
  getAppInfo: async (): Promise<{
    tokens_list_ver: string | undefined
    networks_list_ver: string | undefined
  }> => {
    const res = await axios.get('http://localhost:3000/app-info')
    return res &&
      res.data &&
      res.data.tokens_list_ver &&
      res.data.networks_list_ver
      ? {
          tokens_list_ver: res.data.tokens_list_ver,
          networks_list_ver: res.data.networks_list_ver,
        }
      : {
          tokens_list_ver: undefined,
          networks_list_ver: undefined,
        }
  },
}
