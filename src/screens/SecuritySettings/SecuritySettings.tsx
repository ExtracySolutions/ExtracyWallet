import React, { useEffect, useMemo, useState } from 'react'

import {
  PERMISSION_TYPE,
  useAppSelector,
  useBiometry,
  usePermission,
} from '@hooks'
import { useNavigation } from '@navigation'
import AsyncStorage from '@react-native-community/async-storage'
import { makeStyles } from '@themes'
import { AsyncStorageKeys } from '@ultils'
import { Container, Header, List, ListItemProps, Switch } from 'components'
import { BackHandler, Platform, Text, View } from 'react-native'
import { BIOMETRY_TYPE } from 'react-native-keychain'

interface SecurityItemProps extends ListItemProps {}

export const SecuritySettings = () => {
  const themeStore = useAppSelector((state) => state.root.theme.theme)
  const navigation = useNavigation()
  const styles = useStyles(themeStore)
  const itemStyles = useItemStyles()
  const { showPermissionDialog } = usePermission()
  const {
    getSupportedBiometryType,
    getKeychainPassword,
    biometryConfig,
    BIOMETRY_KEYCHAIN_NAME,
  } = useBiometry()

  const [biometryType, setBiometryType] = useState<string>()
  const [biometryEnabled, setBiometryEnabled] = useState(false)

  const biometryTypeName = useMemo(() => {
    if (biometryType !== null) {
      switch (biometryType) {
        case (BIOMETRY_TYPE.FACE, BIOMETRY_TYPE.IRIS):
          return 'Face'
        case BIOMETRY_TYPE.FACE_ID:
          return 'Face ID'
        case BIOMETRY_TYPE.FINGERPRINT:
          return 'Fingerprint'
        case BIOMETRY_TYPE.TOUCH_ID:
          return 'Touch ID'
      }
    }
  }, [biometryType])

  const handleBiometryEnabled = async (enabled: boolean) => {
    // await setTimeout(async () => {
    setBiometryEnabled(enabled)
    if (enabled) {
      await AsyncStorage.setItem(AsyncStorageKeys.biometryEnabled, 'true')
    } else {
      await AsyncStorage.setItem(AsyncStorageKeys.biometryEnabled, 'false')
    }
    // }, 200)
  }

  const handleBiometryVerify = async () => {
    const config = {
      ...biometryConfig,
      authenticationPrompt: {
        title: 'Authenticate to verify owner of this device',
      },
    }
    try {
      const password = await getKeychainPassword(config, BIOMETRY_KEYCHAIN_NAME)
      if (password) {
        await handleBiometryEnabled(true)
      } else {
        await handleBiometryEnabled(false)
      }
    } catch (err) {
      console.error(err)
      await handleBiometryEnabled(false)
    }
  }

  const handleBiometrySwitchPress = async () => {
    if (biometryEnabled) {
      await handleBiometryEnabled(false)
    } else {
      if (biometryType) {
        if (biometryType === BIOMETRY_TYPE.FACE_ID) {
          const isBiometryAuthenticated = await showPermissionDialog(
            PERMISSION_TYPE.biometry,
          )
          if (isBiometryAuthenticated) {
            await handleBiometryVerify()
          } else {
            await handleBiometryEnabled(false)
          }
        } else {
          await handleBiometryVerify()
        }
      }
    }
  }

  const getItems = (): SecurityItemProps[] => {
    var items: SecurityItemProps[] = []
    items.push({
      title: 'Change password',
      showSuffix: true,
      titleWrapperStyle: itemStyles.typographyWrapper,
      titleStyle: itemStyles.title,
      onPress: () => navigation.navigate('ChangePassword'),
    })

    if (biometryType) {
      items.push({
        title: `Unlock with ${biometryTypeName}`,
        showSuffix: true,
        titleWrapperStyle: itemStyles.typographyWrapper,
        titleStyle: itemStyles.title,
        suffix: biometryType ? (
          <Switch
            isSwitch={biometryEnabled}
            isOpen={biometryEnabled}
            delay={Platform.OS === 'android' ? 500 : 0}
            onPress={async () => {
              await handleBiometrySwitchPress()
            }}
          />
        ) : (
          <View style={styles.lockedWrapper}>
            <Text style={styles.biometryOptionText}>Locked</Text>
            <Switch isSwitch={biometryEnabled} disabled />
          </View>
        ),
      })
    }

    return items
  }

  useEffect(() => {
    const onBackPress = () => {
      navigation.goBack()
      return true
    }

    getSupportedBiometryType().then((type) => {
      setBiometryType(type)
      console.log('Biometry type:', type)
    })

    AsyncStorage.getItem(AsyncStorageKeys.biometryEnabled).then((value) => {
      setBiometryEnabled(value === 'true')
    })

    BackHandler.addEventListener('hardwareBackPress', onBackPress)

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBackPress)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Container style={styles.container}>
      <Header title="Password Settings" />
      <List enableSeparator data={getItems()} scrollEnabled={false} />
    </Container>
  )
}

const useItemStyles = makeStyles()(({ normalize, font }) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: normalize(45)('vertical'),
  },
  typographyWrapper: {
    flex: 1,
  },
  title: {
    fontWeight: '500',
    fontSize: font.size.s4,
  },
}))

const useStyles = makeStyles()(({ normalize, font, colors }) => ({
  container: {
    backgroundColor: colors.grey16,
  },
  title: {
    fontSize: font.size.s4,
    fontWeight: '600',
    paddingHorizontal: normalize(20)('horizontal'),
    paddingTop: normalize(10)('horizontal'),
    paddingBottom: normalize(15)('horizontal'),
  },
  separator: {
    height: normalize(1)('vertical'),
    backgroundColor: colors.grey14,
    marginHorizontal: normalize(7)('horizontal'),
  },
  biometryOptionText: {
    color: colors.alert,
    marginRight: normalize(10)('horizontal'),
  },
  lockedWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
}))
