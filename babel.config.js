module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    // 'transform-inline-environment-variables', // remove this line to archive ios, dont open it
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          tests: ['./tests/'],
          '@components': './src/components',
          '@screens': './src/screens',
          '@navigation': './src/navigation',
          '@themes': './src/themes',
          '@services': './src/services',
          '@hooks': './src/hooks',
          '@ultils': './src/ultils',
          '@assets': './src/assets',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
}
