import React, { FC, useCallback, useState } from 'react'

import {
  Button,
  CheckboxComponent,
  Container,
  Header,
  List,
  ListItemProps,
  Text,
} from '@components'
import { useAppSelector } from '@hooks'
import { makeStyles, useTheme } from '@themes'
import { NextIcon } from 'assets/icons'
import { useNavigation } from 'navigation/NavigationService'
import { View } from 'react-native'

type LegalProps = {}

export const Legal: FC<LegalProps> = ({ props, route }: any) => {
  const { routeName } = route.params

  const themeStore = useAppSelector((state) => state.root.theme.theme)
  const styles = useStyles(props, themeStore)
  const theme = useTheme(themeStore)
  const navigation = useNavigation()

  const [isCheck, setCheckBox] = useState<boolean>(false)

  const LEGAL: ListItemProps[] = [
    {
      title: 'Privacy Policy',
      showSuffix: true,
      onPress: () => {},
      suffix: <NextIcon width={12} height={12} color={theme.colors.grey10} />,
    },
    {
      title: 'Terms of Service',
      showSuffix: true,
      onPress: () => {},
      suffix: <NextIcon width={12} height={12} color={theme.colors.grey10} />,
    },
  ]

  const handleNavigateToImportWallet = useCallback(() => {
    routeName === 'ImportWallet'
      ? navigation.navigate(routeName)
      : navigation.navigate('Backup', { routeName: routeName })
  }, [navigation, routeName])

  const handleToggleCheckBox = useCallback(
    () => setCheckBox(!isCheck),
    [isCheck],
  )

  return (
    <Container style={styles.root}>
      <Header title={'Legal'} />
      <View style={styles.bodyLegal}>
        <View style={styles.container}>
          <List data={LEGAL} enableSeparator scrollEnabled={false} />
          <View style={styles.boxText}>
            <Text style={styles.text} fontSize={14} lineHeight={20}>
              Please review Atlas wallet App Terms of Service and Privacy Policy
            </Text>
          </View>
        </View>
        <CheckboxComponent
          containStyle={styles.bottomLayout}
          handleToggleCheckBox={handleToggleCheckBox}
          isCheck={isCheck}
          backgroundBox={theme.colors.primary}
          text="I understand that if I lose my recovery phrase, I will not be
        able to access my wallet."
        />
        <View style={styles.bottom}>
          <Button
            round
            disabled={!isCheck}
            text="Continue"
            fontWeight={'medium'}
            variant="fulfill"
            onPress={handleNavigateToImportWallet}
          />
        </View>
      </View>
    </Container>
  )
}

const useStyles = makeStyles<LegalProps>()(({ normalize, colors, font }) => ({
  root: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.grey16,
  },
  bodyLegal: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.grey16,
  },
  container: {
    flex: 2,
  },
  group: {
    marginTop: normalize(20)('vertical'),
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: normalize(16)('horizontal'),
    borderRadius: normalize(16)('moderate'),
  },
  title: {
    fontSize: font.size.s4,
  },
  bottomLayout: {
    flex: 0.1,
    justifyContent: 'flex-end',
    paddingBottom: normalize(30)('vertical'),
    paddingHorizontal: normalize(15)('horizontal'),
  },
  bottom: {
    paddingHorizontal: normalize(15)('horizontal'),
  },
  list: {
    backgroundColor: colors.white,
    margin: normalize(16)('moderate'),
  },
  boxText: {
    marginTop: normalize(20)('vertical'),
    alignItems: 'center',
    marginHorizontal: normalize(30)('horizontal'),
  },
  text: {
    textAlign: 'center',
  },
}))
