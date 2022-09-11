import React, { useCallback, useEffect, useState } from 'react'

import { CheckIcon, USDIcon, VNDIcon } from '@assets/icons'
import { Container, Header, List, ListItemProps } from '@components'
import { useAppDispatch, useAppSelector } from '@hooks'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { makeStyles, useTheme } from '@themes'
import { BackHandler } from 'react-native'
import { changeCurrency } from 'reduxs/reducers'

export const Currency = () => {
  const themeStore = useAppSelector((state) => state.root.theme.theme)
  const theme = useTheme(themeStore)
  const styles = useStyles({}, themeStore)
  const dispatch = useAppDispatch()
  const currencyState = useAppSelector((state) => state.root.setting.currency)

  const [selectCurrency, setCurrency] = useState<string>(currencyState)
  const navigation = useNavigation()

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

  const currencies: ListItemProps[] = [
    {
      title: 'VND',
      description: 'Vietnam Dong',
      showSuffix: currencyState === 'vnd',
      prefix: <VNDIcon />,
      suffix:
        currencyState === 'vnd' ? (
          <CheckIcon color={theme.colors.primary} width={20} height={20} />
        ) : undefined,
      onPress: () => handleChangeLanguage('vnd'),
    },
    {
      title: 'USD',
      description: 'US Dollar',
      showSuffix: currencyState === 'usd',
      prefix: <USDIcon />,
      suffix:
        currencyState === 'usd' ? (
          <CheckIcon color={theme.colors.primary} width={20} height={20} />
        ) : undefined,
      onPress: () => handleChangeLanguage('usd'),
    },
  ]
  const handleChangeLanguage = useCallback((value) => {
    setCurrency(value)
  }, [])

  useEffect(() => {
    dispatch(changeCurrency(selectCurrency))
  }, [dispatch, selectCurrency])

  return (
    <Container style={styles.root}>
      <Header title="Language" />
      <List enableSeparator data={currencies} />
    </Container>
  )
}

const useStyles = makeStyles()(({ normalize, colors }) => ({
  root: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.grey16,
  },
  container: {
    paddingBottom: normalize(40)('vertical'),
  },
}))
