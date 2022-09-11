import './shim.js'

import 'react-native-gesture-handler'
import 'intl'
import 'intl/locale-data/jsonp/en'
import { AppRegistry, LogBox } from 'react-native'

import './src/I18n'
import App from './App'
import { name as appName } from './app.json'

LogBox.ignoreAllLogs(true)

AppRegistry.registerComponent(appName, () => App)
