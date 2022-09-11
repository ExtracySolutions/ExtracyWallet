const DEVELOPMENT = 'development'

export default {
  IS_DEV: process.env?.NODE_ENV === DEVELOPMENT,
  IPFS_DEFAULT_GATEWAY_URL: 'https://cloudflare-ipfs.com/ipfs/',
}
