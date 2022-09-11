module.exports = {
  project: {
    ios: {},
    android: {},
  },
  dependencies: {
    'react-native-aes-crypto-forked': {
      platforms: {
        ios: null, // disable Android platform, other platforms will still autolink if provided
      },
    },
  },
  assets: ['./src/assets/fonts'],
}
