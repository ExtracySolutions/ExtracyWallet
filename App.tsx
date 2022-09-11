/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useCallback, useEffect } from 'react'
import 'react-native-url-polyfill/auto'

import { ToastNotification } from '@components'
import AppNavigation from '@navigation'
import analytics from '@react-native-firebase/analytics'
import TKey from 'core/TKey'
import OneSignal from 'react-native-onesignal'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-notifications'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react'

import { WalletProvider } from './src/provider'
import { store, persistor } from './src/reduxs/store'

OneSignal.setLogLevel(6, 0)
OneSignal.setAppId('YOUR_APP_ID')
OneSignal.promptForPushNotificationsWithUserResponse((response) => {
  console.log('Prompt response:', response)
})
OneSignal.setNotificationWillShowInForegroundHandler(
  (notificationReceivedEvent) => {
    var notification = notificationReceivedEvent.getNotification()
    notificationReceivedEvent.complete(notification)
  },
)

const App = () => {
  /**
   * Analytic
   * Log app open
   */
  const logAppOpen = useCallback(async () => {
    await analytics().logAppOpen()
  }, [])

  useEffect(() => {
    logAppOpen()
    // init Tkey
    TKey.init()
  }, [logAppOpen])

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <WalletProvider>
          <SafeAreaProvider
            initialMetrics={{
              frame: { x: 0, y: 0, width: 0, height: 0 },
              insets: { top: 0, left: 0, right: 0, bottom: 0 },
            }}
          >
            <AppNavigation />
            <Toast
              ref={(ref) => {
                //@ts-ignore
                return (global.toast = ref)
              }}
              renderToast={(toast) => <ToastNotification toast={toast} />}
              offsetBottom={90}
            />
          </SafeAreaProvider>
        </WalletProvider>
      </PersistGate>
    </Provider>
  )
}

export default App
