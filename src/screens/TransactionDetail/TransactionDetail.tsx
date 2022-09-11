import React, { FC, useCallback, useEffect, useState } from 'react'

import { ArrowIcon, CopyIcon, SendIcon } from '@assets/icons'
import { Header, Text, Container, Item } from '@components'
import { useAppSelector } from '@hooks'
import { makeStyles, useTheme } from '@themes'
import { useNavigation } from 'navigation/NavigationService'
import {
  View,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Dimensions,
  BackHandler,
} from 'react-native'
import Jazzicon from 'react-native-jazzicon'

export type TransactionDetailProps = {}

const { width: windowWidth } = Dimensions.get('screen')

export type ItemArray = {
  text?: string
  routeName?: string
  balance?: string
}

export const TransactionDetail: FC<TransactionDetailProps> = ({
  props,
  route,
}: any) => {
  const { item } = route.params

  const themeStore = useAppSelector((state) => state.root.theme.theme)
  const styles = useStyles(props, themeStore)
  const theme = useTheme(themeStore)
  const navigation = useNavigation()

  const keyboardVerticalOffset = Platform.OS === 'ios' ? 'padding' : 'height'
  const [scan, setScan] = useState(false)

  const TRANSACTION: ItemArray[] = [
    {
      text: 'Amount',
      balance: '2.35 BNB',
    },
    {
      text: 'Transaction fee',
      balance: '0.21 BNB',
    },
    {
      text: 'Total Amount',
      balance: '2.56 BNB',
    },
  ]

  const handleBack = useCallback(() => {
    if (scan) {
      setScan(false)
    } else {
      navigation.goBack()
    }
    return true
  }, [navigation, scan])

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBack)
  }, [handleBack])

  return (
    <KeyboardAvoidingView
      style={styles.sendControlContainerOuter}
      behavior={keyboardVerticalOffset}
    >
      <Container>
        <Header title={item.content} />
        <View style={styles.root}>
          <ScrollView>
            <View style={styles.body}>
              <View style={styles.groupTitle}>
                <Jazzicon size={24} seed={1} />
                <Text
                  numberOfLines={1}
                  style={styles.title}
                  ellipsizeMode="middle"
                >
                  From: 0x3DcsajbkjasbkjsanDfCE
                </Text>
                <View style={styles.icon}>
                  <ArrowIcon />
                </View>
                <Jazzicon size={24} seed={2} />
                <Text
                  numberOfLines={1}
                  style={styles.title}
                  ellipsizeMode="middle"
                >
                  To: 0x3DckadbkjsjkasDfCE
                </Text>
              </View>
              <View style={styles.item}>
                <Item
                  title="Transaction"
                  arrayItem={TRANSACTION}
                  styleTitle={styles.styleTitle}
                  textStyle={styles.textStyle}
                  rightTitleComponent={
                    <View style={styles.groupIcon}>
                      <View style={styles.iconTitle}>
                        <CopyIcon color={theme.colors.primary} />
                      </View>
                      <View style={styles.iconTitle}>
                        <SendIcon small color={theme.colors.primary} />
                      </View>
                    </View>
                  }
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </Container>
    </KeyboardAvoidingView>
  )
}

const useStyles = makeStyles<TransactionDetailProps>()(
  ({ normalize, font, colors }) => ({
    root: {
      flex: 1,
      flexDirection: 'column',
      backgroundColor: colors.background,
      width: windowWidth,
      height: '100%',
    },
    body: {
      width: windowWidth - normalize(30)('horizontal'),
      marginHorizontal: normalize(15)('horizontal'),
      height: normalize(480)('vertical'),
      flexDirection: 'column',
      marginTop: normalize(30)('horizontal'),
    },
    icon: {
      paddingHorizontal: normalize(10)('horizontal'),
    },
    sendControlContainerOuter: {
      flex: 1,
    },
    groupTitle: {
      paddingBottom: normalize(10)('vertical'),
      flexDirection: 'row',
      alignItems: 'center',
    },
    title: {
      flex: 1,
      paddingLeft: normalize(10)('vertical'),
      color: colors.disabled,
      fontSize: font.size.body,
    },
    item: {
      marginTop: normalize(20)('vertical'),
    },
    styleTitle: {
      color: colors.black,
    },
    groupIcon: {
      flexDirection: 'row',
    },
    iconTitle: {
      width: normalize(34)('horizontal'),
      height: normalize(34)('horizontal'),
      borderRadius: normalize(50)('horizontal'),
      marginLeft: normalize(15)('horizontal'),
      shadowColor: 'black',
      backgroundColor: colors.white,
      shadowOffset: { width: 0, height: 0 },
      shadowRadius: 2,
      shadowOpacity: 0.2,
      elevation: 4,
      justifyContent: 'center',
      alignItems: 'center',
    },
    textStyle: {
      fontSize: font.size.title1,
    },
  }),
)
