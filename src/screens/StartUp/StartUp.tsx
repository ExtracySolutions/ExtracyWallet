import React, { FC, useCallback, useEffect, useRef, useState } from 'react'

import {
  AssetStartUpIcon,
  CommercialStartUpIcon,
  PrivateStartUpIcon,
  GoogleIcon,
  AppleIcon,
} from '@assets/icons'
import { Button, Container, Screen, Text } from '@components'
import { useAppSelector, useAppDispatch } from '@hooks'
import { makeStyles } from '@themes'
// import { loginWithSocial, initTKey, tkeyExample } from '@ultils'
import Tkey, { TYPEOFLOGIN } from 'core/TKey'
import TKey from 'core/TKey'
import { isEmpty } from 'lodash'
import { FeatParentScreen } from 'navigation'
import { useNavigation, useRoute } from 'navigation/NavigationService'
import { useProvider } from 'provider'
import { Dimensions, View, TouchableOpacity, Platform } from 'react-native'
import { BallIndicator } from 'react-native-indicators'
import Carousel, { Pagination } from 'react-native-snap-carousel'
import { setProcessOnBoarding, setNotLogin } from 'reduxs/reducers'

export type StartUpProps = {}
const { width: SliderWidth } = Dimensions.get('screen')

export const StartUp: FC<StartUpProps> = (props) => {
  const themeStore = useAppSelector((state) => state.root.theme.theme)
  const styles = useStyles(props, themeStore)
  const { handleCreateWallet, handleShowLockScreen } = useProvider()
  const navigation = useNavigation()
  const { params } = useRoute('StartUp')
  const dispatch = useAppDispatch()

  useEffect(() => {
    console.log('[PARAMS SOCIAL]', params)
  }, [params])

  const carouselRef = useRef(null)

  const [loginSocialLoading, setLoginSocialLoading] = useState<boolean>(false)
  const [activeIndex, setActivateIndex] = useState(0)
  const [carouselState] = useState([
    {
      dark: <PrivateStartUpIcon />,
      light: <PrivateStartUpIcon />,
      title: 'Secure and Private',
      text: 'All sensitive data never leaves your device',
    },
    {
      dark: <AssetStartUpIcon />,
      light: <AssetStartUpIcon />,
      title: 'Multi asset on multi-chain',
      text: 'Your gateway to the multi-chain world',
    },
    {
      dark: <CommercialStartUpIcon />,
      light: <CommercialStartUpIcon />,
      title: 'Trading with lowest fee',
      text: 'Optimized transaction fee for Swap',
    },
    {
      dark: <CommercialStartUpIcon />,
      light: <CommercialStartUpIcon />,
      title: 'Fast and easy to use',
      text: 'Easily accessible to all audiences',
    },
  ])

  const handleNavigateToLegal = useCallback(
    (routeName) =>
      navigation.navigate('Legal', {
        routeName: routeName,
      }),
    [navigation],
  )

  const _renderItem = useCallback(
    ({ item }) => {
      return (
        <Screen
          titleStyle={styles.titleStyle}
          titleSub={item.title}
          text={item.text}
          image={item.light}
          imageStyle={styles.image}
        />
      )
    },
    [styles.image, styles.titleStyle],
  )

  const handleLoginWithSocial = useCallback(
    async (typeLogin: TYPEOFLOGIN, seedPhase?: string) => {
      try {
        //setLoginScreen
        setLoginSocialLoading(true)
        dispatch(setProcessOnBoarding(true))
        await Tkey.context.triggerLoginSocial(typeLogin)
        const keyDetails = await Tkey.context.initializeTkey()
        console.log('keyDetails', keyDetails)
        if (TKey.context.isActive) {
          await Tkey.context.importAnswerKey()
          const mnemonic = await Tkey.context.getSeedPhrase()
          console.log('[seed]', mnemonic)
          await handleCreateWallet(String(mnemonic).toLowerCase(), '')
          dispatch(setNotLogin(false))
          navigation.navigate('Setup2FA')

          // dispatch(setProcessOnBoarding(false))
        } else {
          // nếu ko có setup câu hỏi bí mật
          // lần đầu user vô sẽ có shareA + shareB nên mình sẽ generate shareC
          if (isEmpty(keyDetails.shareDescriptions)) {
            await Tkey.context.setUpAnswerTkey()
          } else {
            await Tkey.context.importAnswerKey()
          }

          // await Tkey.context.importAnswerKey()
          console.log('[1]')
          // sau đó setup seedphrase vào ví
          // const mnemonic = await Tkey.context.getSeedPhrase()
          // console.log('[2]', mnemonic)
          // await handleCreateWallet(String(mnemonic).toLowerCase(), '')
          console.log('[3]')
          // dispatch(setNotLogin(false))
          console.log('[4]')

          navigation.navigate('AskUpdateSeedPhrase')
        }
        setLoginSocialLoading(false)
      } catch (error) {
        console.log('error', error)
        setLoginSocialLoading(false)
      }
    },
    [dispatch, handleCreateWallet, navigation],
  )

  return (
    <Container style={styles.root}>
      <View style={styles.bodyLayout}>
        <Carousel
          layout={'default'}
          ref={carouselRef}
          hasParallaxImages={true}
          data={carouselState}
          sliderWidth={SliderWidth}
          itemWidth={SliderWidth}
          renderItem={_renderItem}
          useScrollView
          onSnapToItem={setActivateIndex}
          activeSlideAlignment="center"
          enableMomentum={true}
          decelerationRate="fast"
        />
        <Pagination
          dotsLength={carouselState.length}
          activeDotIndex={activeIndex}
          dotStyle={styles.pagination}
          inactiveDotStyle={styles.inactiveDotStyle}
          inactiveDotOpacity={1}
          inactiveDotScale={1}
        />
      </View>
      <View style={styles.bottomLayout}>
        {/* <Button
          containerStyle={styles.buttonStyle}
          text="Create New Wallet"
          onPress={
            loginSocialLoading
              ? undefined
              : () => handleNavigateToLegal('ViewSeedPhrase')
          }
        /> */}
        {/* <Button
          text="I already have a wallet"
          variant="none"
          containerStyle={styles.buttonStyle}
          onPress={
            loginSocialLoading
              ? undefined
              : () => handleNavigateToLegal('ImportWallet')
          }
        /> */}
        <View style={styles.social}>
          <Text style={styles.socialText}>Login with</Text>

          {loginSocialLoading ? (
            <BallIndicator size={20} />
          ) : (
            <>
              <TouchableOpacity
                onPress={() =>
                  handleLoginWithSocial(
                    TYPEOFLOGIN.GOOGLE,
                    // 'scare quote item float eight design naive kick jacket flock lesson close',
                  )
                }
              >
                <GoogleIcon />
              </TouchableOpacity>

              {Platform.OS === 'ios' && (
                <TouchableOpacity
                  onPress={() => handleLoginWithSocial(TYPEOFLOGIN.APPLE)}
                >
                  <AppleIcon />
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </View>
    </Container>
  )
}

const useStyles = makeStyles<StartUpProps>()(({ colors, normalize, font }) => ({
  root: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.white,
  },
  pagination: {
    width: 48,
    height: 6,
    borderRadius: 5,
    backgroundColor: colors.primary,
    top: normalize(10)('moderate'),
  },
  inactiveDotStyle: {
    width: normalize(6)('moderate'),
    height: normalize(6)('moderate'),
    borderRadius: normalize(10)('moderate'),
    marginHorizontal: -10,
    backgroundColor: colors.grey12,
  },
  bodyLayout: {
    flex: 1.9,
  },
  bottomLayout: {
    flex: 0.5,
    justifyContent: 'flex-end',
    paddingHorizontal: normalize(16)('horizontal'),
    marginBottom: normalize(16)('vertical'),
  },
  buttonStyle: {
    marginBottom: normalize(0)('vertical'),
  },
  titleStyle: {
    color: colors.primary50,
  },
  image: {
    paddingTop: normalize(40)('vertical'),
  },
  social: {
    marginTop: normalize(10)('moderate'),
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: normalize(70)('moderate'),
  },
  socialText: {
    fontSize: font.size.body,
    color: colors.primary,
  },
}))
