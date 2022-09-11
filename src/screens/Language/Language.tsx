import React, { useCallback, useEffect, useState } from 'react'

import { Container, Header, List, ListItemProps } from '@components'
import { useAppDispatch, useAppSelector } from '@hooks'
import { useFocusEffect } from '@react-navigation/native'
import { makeStyles, useTheme } from '@themes'
import { CheckIcon, UKFlagIcon, VietnamFlagIcon } from 'assets'
import { useNavigation } from 'navigation'
import { BackHandler, View } from 'react-native'
import { changeLanguage, Language as LanguageState } from 'reduxs/reducers'
import { keyExtractor } from 'ultils'

interface LanguageItemProps extends ListItemProps {
  language: LanguageState
}

export const Language = () => {
  const themeStore = useAppSelector((state) => state.root.theme.theme)
  const theme = useTheme(themeStore)
  const styles = useStyles({}, themeStore)
  const dispatch = useAppDispatch()
  const languageStore = useAppSelector((state) => state.root.setting.language)
  const navigation = useNavigation()
  const [selectLanguage, setLanguage] = useState<LanguageState>(languageStore)

  const languageItems: LanguageItemProps[] = [
    {
      index: 0,
      title: 'Vietnamese',
      showSuffix: selectLanguage === LanguageState.vi,
      language: LanguageState.vi,
      prefixWrapperStyle: styles.prefixWrapper,
      suffixWrapperStyle: styles.icon,
      prefix: <VietnamFlagIcon />,
      suffix:
        languageStore === LanguageState.vi ? (
          <CheckIcon color={theme.colors.primary} width={20} height={20} />
        ) : undefined,
      onPress: () => handleChangeLanguage(LanguageState.vi),
    },
    {
      index: 1,
      title: 'English',
      showSuffix: selectLanguage === LanguageState.en,
      language: LanguageState.en,
      prefixWrapperStyle: styles.prefixWrapper,
      suffixWrapperStyle: styles.icon,
      prefix: <UKFlagIcon />,
      suffix:
        languageStore === LanguageState.en ? (
          <CheckIcon color={theme.colors.primary} width={20} height={20} />
        ) : undefined,
      onPress: () => handleChangeLanguage(LanguageState.en),
    },
  ]

  const handleChangeLanguage = useCallback((value) => {
    setLanguage(value)
  }, [])

  useEffect(() => {
    dispatch(changeLanguage(selectLanguage))
  }, [dispatch, selectLanguage])

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.navigate('Setting')
        return true
      }
      BackHandler.addEventListener('hardwareBackPress', onBackPress)

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress)
      }
    }, [navigation]),
  )

  return (
    <Container style={styles.root}>
      <Header title="Language" />
      <View>
        <List
          enableSeparator
          scrollEnabled={false}
          data={languageItems}
          keyExtractor={keyExtractor}
        />
      </View>
    </Container>
  )
}

const useStyles = makeStyles()(({ normalize, colors }) => ({
  root: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.grey16,
  },
  prefixWrapper: {
    borderRadius: normalize(100)('moderate'),
    marginLeft: normalize(5)('horizontal'),
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  icon: {
    marginRight: normalize(5)('horizontal'),
    alignItems: 'center',
    justifyContent: 'center',
  },
}))
