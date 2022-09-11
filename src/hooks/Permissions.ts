import { Alert, Platform } from 'react-native'
import {
  check,
  PERMISSIONS,
  RESULTS,
  request,
  openSettings,
  Permission,
} from 'react-native-permissions'

export enum PermissionStatus {
  granted,
  denied,
  unavailable,
}

const CAMERA_PERMISSIONS = {
  ios: PERMISSIONS.IOS.CAMERA,
  android: PERMISSIONS.ANDROID.CAMERA,
}
const BIOMETRY_PERMISSIONS = {
  ios: PERMISSIONS.IOS.FACE_ID,
}
const APP_TRACKING_TRANSPARENCY = {
  ios: PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY,
}

const REQUEST_PERMISSION_TYPE = {
  camera: CAMERA_PERMISSIONS,
  biometry: BIOMETRY_PERMISSIONS,
  appTrackingTransparency: APP_TRACKING_TRANSPARENCY,
}

export const PERMISSION_TYPE = {
  camera: 'camera',
  biometry: 'biometry',
  appTrackingTransparency: 'appTrackingTransparency',
}

export const usePermission = () => {
  const requestPermission = async (permissions: Permission) => {
    try {
      const granted = await request(permissions)
      if (granted === RESULTS.GRANTED) {
        return true
      }
      return false
    } catch (err) {
      return false
    }
  }

  const checkPermission = async (type: String) => {
    const permissions = REQUEST_PERMISSION_TYPE[type][Platform.OS]

    const result = await check(permissions)

    switch (result) {
      case RESULTS.UNAVAILABLE:
        return PermissionStatus.unavailable
      case RESULTS.DENIED:
        return PermissionStatus.denied
      case RESULTS.GRANTED:
        return PermissionStatus.granted
    }
  }

  const showPermissionDialog = async (type: String) => {
    const permissions = REQUEST_PERMISSION_TYPE[type][Platform.OS]

    try {
      const result = await check(permissions)
      switch (result) {
        case RESULTS.UNAVAILABLE:
          return false
        case RESULTS.BLOCKED:
          if (type === 'camera') {
            Alert.alert(
              'Camera permission',
              'OBL Wallet need camera permission to read barcode',
              [
                {
                  text: 'Go to Settings',
                  onPress: () => openSettings(),
                  style: 'cancel',
                },
                {
                  text: 'Cancel',
                  style: 'default',
                  onPress: () => {
                    return false
                  },
                },
              ],
            )
          } else if (type === 'biometry') {
            Alert.alert(
              'Face ID permission',
              'We need your FaceID permission for authenticate faster',
              [
                {
                  text: 'Go to Settings',
                  onPress: () => openSettings(),
                  style: 'cancel',
                },
                {
                  text: 'Cancel',
                  style: 'default',
                  onPress: () => {
                    return false
                  },
                },
              ],
            )
          }
          break
        case RESULTS.DENIED:
          break
        case RESULTS.GRANTED:
          return true
      }
      return requestPermission(permissions)
    } catch (err) {
      return false
    }
  }

  return {
    checkPermission,
    showPermissionDialog,
  }
}
