const extraNodeModules = require('node-libs-browser')
module.exports = {
  resolver: {
    extraNodeModules,
    sourceExts: ['jsx', 'js', 'ts', 'tsx', 'cjs'],
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
}
