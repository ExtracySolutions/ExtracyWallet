import { Platform } from 'react-native'
import DeviceInfo from 'react-native-device-info'
import * as Keychain from 'react-native-keychain'
import { check, PERMISSIONS } from 'react-native-permissions'

export const useBiometry = () => {
  const iPhoneBiometryType = new Map([
    ['iPhone8,1', 'TouchID'] /**  iPhone 6s              */,
    ['iPhone8,2', 'TouchID'] /**  iPhone 6s Plus         */,
    ['iPhone8,4', 'TouchID'] /**  iPhone SE (1st Gen)    */,
    ['iPhone9,1', 'TouchID'] /**  iPhone 7               */,
    ['iPhone9,2', 'TouchID'] /**  iPhone 7 Plus          */,
    ['iPhone9,3', 'TouchID'] /**  iPhone 7               */,
    ['iPhone9,4', 'TouchID'] /**  iPhone 7 Plus          */,
    ['iPhone10,1', 'TouchID'] /** iPhone 8               */,
    ['iPhone10,2', 'TouchID'] /** iPhone 8 Plus          */,
    ['iPhone10,3', 'FaceID'] /**  iPhone X (Global)      */,
    ['iPhone10,4', 'TouchID'] /** iPhone 8               */,
    ['iPhone10,5', 'TouchID'] /** iPhone 8 Plus          */,
    ['iPhone10,6', 'FaceID'] /**  iPhone X (GSM)         */,
    ['iPhone11,2', 'FaceID'] /**  iPhone Xs              */,
    ['iPhone11,4', 'FaceID'] /**  iPhone Xs Max          */,
    ['iPhone11,6', 'FaceID'] /**  iPhone Xs Max (Global) */,
    ['iPhone11,8', 'FaceID'] /**  iPhone Xr              */,
    ['iPhone12,1', 'FaceID'] /**  iPhone 11              */,
    ['iPhone12,3', 'FaceID'] /**  iPhone 11 Pro          */,
    ['iPhone12,5', 'FaceID'] /**  iPhone 11 Pro Max      */,
    ['iPhone12,8', 'TouchID'] /** iPhone SE (2nd Gen)    */,
    ['iPhone13,1', 'FaceID'] /**  iPhone 12 Mini         */,
    ['iPhone13,2', 'FaceID'] /**  iPhone 12              */,
    ['iPhone13,3', 'FaceID'] /**  iPhone 12 Pro          */,
    ['iPhone13,4', 'FaceID'] /**  iPhone 12 Pro Max      */,
    ['iPhone14,2', 'FaceID'] /**  iPhone 13 Pro          */,
    ['iPhone14,3', 'FaceID'] /**  iPhone 13 Pro Max      */,
    ['iPhone14,4', 'FaceID'] /**  iPhone 13 Mini         */,
    ['iPhone14,5', 'FaceID'] /**  iPhone 13              */,
    ['iPhone14,6', 'TouchID'] /** iPhone SE (3rd Gen)    */,
  ])

  const deviceId = DeviceInfo.getUniqueId()
  const PASSWORD_KEYCHAIN_NAME = `com.oneblocklabs.atlaswallet.${deviceId}`
  const BIOMETRY_KEYCHAIN_NAME = `com.oneblocklabs.atlaswallet.biometry.${deviceId}`

  const biometryConfig = Platform.select<Keychain.Options>({
    android: {
      service: 'com.oneblocklabs.atlaswallet',
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET,
    },
    ios: {
      service: 'com.oneblocklabs.atlaswallet',
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET,
    },
  })

  const passwordConfig = Platform.select<Keychain.Options>({
    android: {
      service: 'com.oneblocklabs.atlaswallet',
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      accessControl: Keychain.ACCESS_CONTROL.APPLICATION_PASSWORD,
    },
    ios: {
      service: 'com.oneblocklabs.atlaswallet',
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    },
  })

  const getFaceIdPermission = async () => {
    return await check(PERMISSIONS.IOS.FACE_ID)
  }

  const getSupportedBiometryType = async () => {
    const biometryType = await Keychain.getSupportedBiometryType()
    const biometrySupported = await check(PERMISSIONS.IOS.FACE_ID)

    if (biometryType !== null) {
      return biometryType
    } else if (biometrySupported !== 'unavailable' && biometryType === null) {
      return iPhoneBiometryType.get(DeviceInfo.getDeviceId()) ?? ''
    }
    return undefined
  }

  const setKeychainPassword = async (
    passcode: string,
    config: Keychain.Options | undefined,
    keychainName?: string,
  ) => {
    return await Keychain.setInternetCredentials(
      keychainName ?? PASSWORD_KEYCHAIN_NAME,
      'WalletUsername',
      passcode,
      config,
    )
  }

  const getBiometricKeychainPassword = async () => {
    try {
      const data = await Keychain.getInternetCredentials(
        BIOMETRY_KEYCHAIN_NAME,
        biometryConfig,
      )
      if (data) {
        return data.password
      }
      return undefined
    } catch (err) {
      console.log(err)
      return undefined
    }
  }

  const getKeychainPassword = async (config: any, keychainName?: string) => {
    try {
      const password = await Keychain.getInternetCredentials(
        keychainName ?? PASSWORD_KEYCHAIN_NAME,
        config,
      )
      if (password) {
        return password.password
      }
      return undefined
    } catch (err) {
      console.error(err)
      return undefined
    }
  }

  const hasKeychainPassword = async (keychainName?: string) => {
    const value = await Keychain.hasInternetCredentials(
      keychainName ?? PASSWORD_KEYCHAIN_NAME,
    )

    return !!value
  }

  const changeKeychainPassword = async (
    oldPasscode: string,
    newPasscode: string,
    config: Keychain.Options | undefined,
    keychainName?: string,
  ) => {
    return await Keychain.getInternetCredentials(
      keychainName ?? PASSWORD_KEYCHAIN_NAME,
      config,
    ).then((res) => {
      if (res && res.password === oldPasscode) {
        deleteKeychainPassword(config, keychainName ?? PASSWORD_KEYCHAIN_NAME)
        setKeychainPassword(
          newPasscode,
          config,
          keychainName ?? PASSWORD_KEYCHAIN_NAME,
        )
        return true
      }
      return false
    })
  }

  const deleteKeychainPassword = async (
    config: Keychain.Options | undefined,
    keychainName?: string,
  ) => {
    return await Keychain.resetInternetCredentials(
      keychainName ?? PASSWORD_KEYCHAIN_NAME,
      config,
    )
  }

  const clearKeychainPassword = async () => {
    await Keychain.resetInternetCredentials(
      BIOMETRY_KEYCHAIN_NAME,
      biometryConfig,
    )
    await Keychain.resetInternetCredentials(
      PASSWORD_KEYCHAIN_NAME,
      passwordConfig,
    )
  }

  return {
    getFaceIdPermission,
    getSupportedBiometryType,
    hasKeychainPassword,
    setKeychainPassword,
    getKeychainPassword,
    getBiometricKeychainPassword,
    changeKeychainPassword,
    deleteKeychainPassword,
    clearKeychainPassword,
    passwordConfig,
    biometryConfig,
    BIOMETRY_KEYCHAIN_NAME,
    PASSWORD_KEYCHAIN_NAME,
  }
}
