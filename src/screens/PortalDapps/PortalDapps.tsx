import React, { FC, useCallback, useEffect, useRef, useState } from 'react'

import {
  Button,
  Container,
  Text,
  TextInput,
  BookmarksItem,
  DappSearch,
  height,
  FastImage,
} from '@components'
import {
  NetworkType,
  Bookmark as BookmarkType,
} from '@extracy-wallet-controller'
import { useAppSelector, useAppDispatch } from '@hooks'
//@ts-ignore
import ParallaxScroll from '@monterosa/react-native-parallax-scroll'
import { makeStyles, useTheme } from '@themes'
import { HOMEPAGE_URL } from '@ultils'
import { Portal, DangerIcon, BookmarkEmpty } from 'assets'
import { CancelIcon } from 'assets/icons/CancelIcon'
import Engine from 'core/Engine'
import { useNavigation } from 'navigation'
import {
  View,
  Dimensions,
  Modal,
  Platform,
  TouchableOpacity,
  Pressable,
  ScrollView,
  FlatList,
  KeyboardAvoidingView,
} from 'react-native'
import Carousel, { Pagination } from 'react-native-snap-carousel'

import {
  changeTakePhoto,
  createNewTab,
  toggleShowTabs,
} from '../../reduxs/reducers'
import { PopularItem } from './PopularItem'

export type PortalDappsProps = {}

export type ItemBanner = {
  uri: string
}

export type ItemDapp = {
  title?: string
  description?: string
  URL: string
  image?: string
  networkID: string
  networkType: NetworkType
}

const { height: MAX_HEIGHT, width: MAX_WIDTH } = Dimensions.get('screen')

export const PortalDapps: FC<PortalDappsProps> = (props) => {
  const themeStore = useAppSelector((state) => state.root.theme.theme)
  const { PreferencesController } = useAppSelector(
    (state) => state.root.engine.backgroundState,
  )
  const selectedAccountIndex = useAppSelector(
    (state) =>
      state.root.engine.backgroundState.PreferencesController
        ?.selectedAccountIndex,
  )
  const bookmarkRedux = useAppSelector((state) => state.root.browser.bookmarks)

  const styles = useStyles(props, themeStore)
  const navigation = useNavigation()
  const theme = useTheme(themeStore)
  const dispatch = useAppDispatch()

  const popularList = require('../../../dapp.json')
  const carouselState = require('./banner.json')

  const [activeIndex, setActivateIndex] = useState(0)
  const [modalVisible, setModalVisible] = useState(false)
  const [result, setResult] = useState<string>('')
  const [errorName, setErrorName] = useState<string>('')
  const [bookmarkList, setBookmarkList] = useState<BookmarkType[]>([])
  const [populars, setPopular] = useState<any[]>([])
  const [isValid, setValid] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>('')
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 'padding' : 'height'

  const carouselRef = useRef(null)

  const getBookmarkList = useCallback(async () => {
    //get 6 bookmark item
    const bookmarkListSlice = bookmarkRedux?.slice(0, 6)
    bookmarkListSlice && setBookmarkList(bookmarkListSlice)

    //get 9 popular item
    setPopular(popularList.slice(0, 9))
  }, [bookmarkRedux, popularList])

  const validateBookmark = useCallback(() => {
    const previousEntry =
      bookmarkRedux &&
      bookmarkRedux.find((bookmark) => bookmark.bookmarkName === result)
    if (result === '') {
      setErrorName('Name is Required')
      setValid(false)
    } else if (previousEntry) {
      setErrorName('Name is exist')
      setValid(false)
    } else {
      setErrorName('')
      setValid(true)
    }
  }, [bookmarkRedux, result])

  useEffect(() => {
    getBookmarkList()
    validateBookmark()
  }, [getBookmarkList, validateBookmark, bookmarkRedux])

  const handleNavigateToBrowserTabs = useCallback((dapp: ItemDapp) => {
    // const id = Date.now()
    // dispatch(createNewTab({ id, url: dapp.URL }))
    // Engine.context.DappManagerController?.createNewTabs({
    //   id,
    //   accountIndex: PreferencesController?.selectedAccountIndex ?? 0,
    //   networkID: dapp.networkID,
    //   networkType: dapp.networkType,
    // })
    // navigation.navigate('Browser')
  }, [])

  const _renderItem = useCallback(
    ({ item }: { item: ItemBanner }) => {
      return (
        <FastImage
          key={item.uri}
          style={styles.imageBanner}
          resizeMode="contain"
          source={{
            uri: item.uri,
          }}
        />
      )
    },
    [styles.imageBanner],
  )

  const handleClose = useCallback(() => {
    setModalVisible(false)
    setResult('')
  }, [])

  const handleOpen = useCallback(() => {
    setResult('')
    setModalVisible(true)
  }, [])

  const handleAddBookmark = useCallback(async () => {
    if (selectedAccountIndex !== undefined) {
    }
    handleClose()
  }, [handleClose, selectedAccountIndex])

  const handleNavigation = useCallback(
    (
      routeName: string,
      popularList?: any,
      routeTitle?: string,
      bookmarkId?: string,
    ) => {
      routeName === 'DappList'
        ? navigation.navigate(routeName, {
            DappList: popularList,
            routeName: routeTitle ? routeTitle : 'Popular List',
            bookmarkId: bookmarkId,
          })
        : navigation.navigate('Bookmark')
    },
    [navigation],
  )

  const renderPopularItem = ({
    item,
    index,
  }: {
    item: ItemDapp
    index: number
  }) => {
    return (
      <TouchableOpacity
        onPress={() => handleNavigateToBrowserTabs(item)}
        style={[
          styles.popularItem,
          (index === 2 && styles.popularLast) ||
            (index === 5 && styles.popularLast) ||
            (index === 8 && styles.popularLast),
        ]}
      >
        <PopularItem {...item} isLast={index >= 6 && true} />
      </TouchableOpacity>
    )
  }

  const renderBookmarksItem = ({
    item,
    index,
  }: {
    item: BookmarkType
    index: number
  }) => {
    if (index === 5) {
      return (
        <TouchableOpacity
          key={index}
          onPress={() => handleNavigation('Bookmark')}
          style={styles.itemInvisible}
        >
          <View style={styles.box}>
            <Text variant="bold" style={styles.textIcon}>
              ...
            </Text>
            <Text style={styles.textItem}>{`More items`}</Text>
          </View>
        </TouchableOpacity>
      )
    }
    return (
      <View style={styles.item}>
        <BookmarksItem
          {...item}
          index={index}
          bookmarkName={item.bookmarkName}
          handleNavigate={() =>
            handleNavigation('DappList', item.Dapp, item.bookmarkName, item.id)
          }
        />
      </View>
    )
  }

  const handleSearch = useCallback(() => {
    dispatch(
      createNewTab({
        url: `${HOMEPAGE_URL}/search?q=${searchText}`,
        accountIndex: PreferencesController?.selectedAccountIndex ?? 0,
        networkID: 'ethereum',
        networkType: NetworkType.ERC20,
      }),
    )

    navigation.navigate('Browser')
  }, [
    PreferencesController?.selectedAccountIndex,
    dispatch,
    navigation,
    searchText,
  ])

  const handleShowTab = useCallback(() => {
    dispatch(toggleShowTabs(true))
    dispatch(changeTakePhoto({ isTakePhoto: false }))
    navigation.navigate('Browser')
  }, [dispatch, navigation])

  const renderHeader = () => {
    return (
      <View style={styles.headerSearch}>
        <DappSearch
          searchText={searchText}
          setSearchText={setSearchText}
          onShowTab={handleShowTab}
          handleSearch={handleSearch}
          disableBookmark={true}
        />
      </View>
    )
  }

  const renderBackgroundPlaceholder = () => {
    return (
      <View style={styles.body}>
        <ScrollView
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <View style={styles.groupTitle}>
            <Text variant={'bold'} style={styles.title}>
              Popular
            </Text>
            <TouchableOpacity
              onPress={() => handleNavigation('DappList', popularList)}
              style={styles.boxTitleMore}
            >
              <Text variant={'bold'} style={styles.titleMore}>
                See more
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          >
            <FlatList
              data={populars}
              extraData={populars}
              onEndReached={() => {
                console.log('click')
              }}
              renderItem={renderPopularItem}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              scrollEnabled={false}
              keyExtractor={(item, index) => index.toString()}
              numColumns={3}
            />
          </ScrollView>
          <View style={styles.groupTitleBookmark}>
            <Text variant={'bold'} style={styles.title}>
              Your Bookmark
            </Text>
            {bookmarkList.length === 0 ? null : (
              <TouchableOpacity onPress={handleOpen} style={styles.borderTitle}>
                <Text variant={'bold'} style={styles.textAddForder}>
                  + New folder
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <View
            style={[
              styles.container,
              bookmarkList.length < 3 && styles.containerScale,
            ]}
          >
            <FlatList
              data={bookmarkList}
              renderItem={renderBookmarksItem}
              columnWrapperStyle-={styles.columnWrapper}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              scrollEnabled={false}
              keyExtractor={(item) => item.bookmarkName}
              numColumns={3}
              ListEmptyComponent={listEmptyComponent}
            />
          </View>
        </ScrollView>
      </View>
    )
  }

  const renderParallaxForeground = () => {
    return (
      <View style={styles.background}>
        <View style={styles.layout}>
          <Portal />
        </View>
        <View style={styles.bodyLayout}>
          <Carousel
            layout={'default'}
            ref={carouselRef}
            hasParallaxImages={true}
            data={carouselState}
            sliderWidth={MAX_WIDTH}
            itemWidth={MAX_WIDTH - 80}
            renderItem={_renderItem}
            useScrollView
            autoplay
            loop
            onSnapToItem={(index) => {
              setActivateIndex(index)
            }}
            slideStyle={styles.itemSlide}
            activeSlideAlignment="center"
          />
          {
            <Pagination
              dotsLength={carouselState.length}
              activeDotIndex={activeIndex}
              dotStyle={styles.pagination}
              inactiveDotStyle={styles.inactiveDotStyle}
              inactiveDotOpacity={0.4}
              inactiveDotScale={0.6}
              animatedDuration={0}
            />
          }
        </View>
      </View>
    )
  }

  const listEmptyComponent = useCallback(() => {
    return (
      <View style={styles.containerEmptyList}>
        <BookmarkEmpty />
        <Text variant="bold" style={styles.titleEmptyList}>
          No Bookmark
        </Text>
        <Text style={styles.textEmptyList}>
          Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet
          sint.
        </Text>
        <TouchableOpacity onPress={handleOpen} style={styles.borderTitle}>
          <Text variant={'bold'} style={styles.textAddForder}>
            + Add New folder
          </Text>
        </TouchableOpacity>
      </View>
    )
  }, [
    handleOpen,
    styles.borderTitle,
    styles.containerEmptyList,
    styles.textAddForder,
    styles.textEmptyList,
    styles.titleEmptyList,
  ])

  return (
    <KeyboardAvoidingView style={styles.root} behavior={keyboardVerticalOffset}>
      <Container edges={['right', 'left']}>
        <ScrollView showsVerticalScrollIndicator={false} scrollEnabled={false}>
          <ParallaxScroll
            renderHeader={renderHeader}
            renderBackgroundPlaceholder={renderBackgroundPlaceholder}
            renderParallaxForeground={renderParallaxForeground}
            parallaxBackgroundScrollSpeed={5}
            parallaxForegroundScrollSpeed={2.5}
            headerHeight={110}
            isHeaderFixed={true}
            parallaxHeight={370}
            backgroundScale={1}
            fadeOutParallaxForeground={true}
            headerFixedBackgroundColor={theme.colors.transparent}
            height={height * 0.9}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            isBackgroundScalable={false}
            backgroundScaleOrigin="top"
          />
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible)
            }}
          >
            <View
              style={[
                Platform.OS === 'ios'
                  ? styles.iOSBackdrop
                  : styles.androidBackdrop,
                styles.backdrop,
              ]}
            />
            <Pressable
              style={styles.containerBox}
              onPress={() => setModalVisible(false)}
            >
              <Pressable onPress={null} style={styles.alertBox}>
                <Pressable style={styles.btnCancel} onPress={handleClose}>
                  <CancelIcon />
                </Pressable>
                <Text style={styles.titleDialog} variant="bold">
                  New folder
                </Text>
                <>
                  <TextInput
                    containerStyle={styles.containerStyle}
                    inputStyle={styles.inputStyle}
                    autoCapitalize={'none'}
                    onChangeText={setResult}
                    placeholder={'Enter a name for these folder'}
                    textAlignVertical="top"
                    maxLength={12}
                    value={result}
                  />

                  <View style={styles.groupErrorName}>
                    {errorName !== '' && (
                      <>
                        <DangerIcon />
                        <Text style={styles.textDanger}>{errorName}</Text>
                      </>
                    )}
                  </View>
                </>
                <Button
                  round
                  variant={'fulfill'}
                  text={'OK'}
                  disabled={!isValid || errorName !== ''}
                  containerStyle={styles.button}
                  onPress={handleAddBookmark}
                />
              </Pressable>
            </Pressable>
          </Modal>
        </ScrollView>
      </Container>
    </KeyboardAvoidingView>
  )
}

const useStyles = makeStyles<PortalDappsProps>()(
  ({ normalize, colors, font }) => ({
    item: {
      width: MAX_WIDTH / 3.3,
      height: normalize(120)('moderate'),
      marginBottom: normalize(15)('vertical'),
    },
    itemInvisible: {
      width: MAX_WIDTH / 3.6,
      height: normalize(120)('moderate'),
      backgroundColor: `${colors.grayPastel}${10}`,
      borderRadius: normalize(14)('moderate'),
      justifyContent: 'center',
      alignItems: 'center',
    },
    popularItem: {
      marginRight: normalize(32)('horizontal'),
    },
    popularItemBottom: {
      marginRight: normalize(32)('horizontal'),
      marginBottom: normalize(-10)('moderate'),
    },
    root: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerSearch: {
      flexDirection: 'row',
      backgroundColor: colors.white,
      flex: 0.6,
      alignItems: 'center',
      marginTop: normalize(-10)('moderate'),
    },
    textInput: {
      width: normalize(250)('moderate'),
      height: normalize(42)('moderate'),
      paddingHorizontal: normalize(12)('moderate'),
      borderRadius: normalize(10)('moderate'),
      backgroundColor: colors.search,
    },
    border: {
      width: normalize(24)('moderate'),
      height: normalize(24)('moderate'),
      alignItems: 'center',
      justifyContent: 'center',
      borderColor: colors.borderPortal,
      borderWidth: 1,
      borderRadius: normalize(7)('moderate'),
    },
    borderTitle: {
      padding: normalize(22)('moderate'),
      alignItems: 'center',
      justifyContent: 'center',
    },
    textAddForder: {
      color: colors.primary,
      fontSize: font.size.caption1,
      borderColor: colors.primary,
      borderWidth: 1,
      borderRadius: normalize(15)('moderate'),
      paddingVertical: normalize(5)('moderate'),
      paddingHorizontal: normalize(7)('moderate'),
    },
    background: {
      marginTop: normalize(-50)('moderate'),
    },
    body: {
      flex: 1,
      height: MAX_HEIGHT * 0.9,
      backgroundColor: colors.white,
      borderTopRightRadius: normalize(40)('moderate'),
      borderTopLeftRadius: normalize(40)('moderate'),
      shadowColor: 'black',
      shadowOffset: { width: 0, height: -5 },
      shadowOpacity: 0.05,
      elevation: 10,
      zIndex: 400,
      marginTop: normalize(10)('moderate'),
    },
    title: {
      paddingLeft: normalize(22)('moderate'),
      fontSize: font.size.h6,
    },
    groupTitle: {
      marginTop: normalize(25)('vertical'),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    groupTitleBookmark: {
      marginTop: normalize(8)('vertical'),

      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    boxTitleMore: {
      padding: normalize(22)('moderate'),
    },
    titleMore: {
      color: colors.primary,
      fontSize: font.size.caption1,
    },
    image: {
      width: normalize(50)('moderate'),
      height: normalize(50)('moderate'),
    },
    imageBanner: {
      width: MAX_WIDTH * 0.85,
      height: normalize(200)('moderate'),
      marginTop: normalize(40)('moderate'),
      shadowColor: 'black',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 10,
    },
    dappItem: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      flex: 1,
      marginTop: normalize(10)('moderate'),
      alignItems: 'center',
      paddingHorizontal: normalize(22)('moderate'),
    },
    containerScale: {
      alignItems: 'flex-start',
    },
    textIcon: {
      fontSize: normalize(46)('moderate'),
      marginTop: 0,
      marginBottom: normalize(10)('moderate'),
      textAlign: 'center',
      color: '#C2C2C2',
    },
    box: {
      height: 100,
    },
    textItem: {
      fontSize: font.size.caption1,
      color: colors.grayPastel,
      textAlign: 'center',
    },
    itemEmpty: {
      backgroundColor: colors.transparent,
    },
    iOSBackdrop: {
      backgroundColor: '#000000',
      opacity: 0.4,
    },
    androidBackdrop: {
      backgroundColor: '#232f34',
      opacity: 0.32,
    },
    backdrop: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    containerBox: {
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    alertBox: {
      width: MAX_WIDTH * 0.9,
      backgroundColor: colors.white,
      justifyContent: 'center',
      elevation: 24,
      borderRadius: 10,
      paddingVertical: normalize(10)('vertical'),
      paddingHorizontal: normalize(16)('vertical'),
    },
    titleDialog: {
      textAlign: 'center',
      margin: normalize(20)('vertical'),
      fontSize: font.size.title1,
    },
    button: {
      marginTop: normalize(5)('vertical'),
    },
    btnCancel: {
      position: 'absolute',
      right: 15,
      top: 10,
      paddingBottom: normalize(10)('vertical'),
      paddingLeft: normalize(10)('vertical'),
    },
    containerStyle: {
      backgroundColor: colors.default,
    },
    inputStyle: {
      width: normalize(235)('vertical'),
      height: normalize(10)('vertical'),
      marginRight: normalize(10)('vertical'),
    },
    bodyLayout: {
      zIndex: 1000,
      marginTop: normalize(110)('vertical'),
      justifyContent: 'center',
      alignSelf: 'center',
      alignItems: 'center',
    },
    layout: {
      position: 'absolute',
      zIndex: -300,
    },
    pagination: {
      width: normalize(40)('vertical'),
      height: normalize(8)('horizontal'),
      borderRadius: normalize(5)('moderate'),
      backgroundColor: colors.white,
      shadowColor: 'black',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 10,
      marginBottom: normalize(10)('moderate'),
    },
    itemSlide: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    inactiveDotStyle: {
      width: 10,
      height: 10,
      borderRadius: normalize(10)('moderate'),
      marginHorizontal: -10,
      backgroundColor: colors.white,
      shadowColor: 'black',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 10,
    },
    groupErrorName: {
      alignSelf: 'flex-start',
      alignItems: 'center',
      paddingBottom: normalize(10)('horizontal'),
      height: normalize(35)('vertical'),
      flexDirection: 'row',
    },
    textDanger: {
      color: colors.alert,
      fontSize: font.size.caption2,
      position: 'relative',
      left: normalize(5)('horizontal'),
      paddingBottom:
        Platform.OS === 'android'
          ? normalize(5)('vertical')
          : normalize(0)('vertical'),
      paddingTop: normalize(2)('vertical'),
    },
    columnWrapper: {
      width: 50,
      justifyContent: 'space-around',
      alignItems: 'flex-start',
      alignSelf: 'flex-start',
    },
    containerEmptyList: {
      alignItems: 'center',
      marginHorizontal: normalize(50)('horizontal'),
    },
    titleEmptyList: {
      flex: 1,
      textAlign: 'center',
      fontSize: font.size.button,
      color: colors.grayPastel,
      paddingVertical: normalize(10)('vertical'),
    },
    textEmptyList: {
      flex: 1,
      textAlign: 'center',
      fontSize: font.size.body,
      color: '#BABABA',
      paddingBottom: normalize(20)('vertical'),
    },
    popularLast: {
      width: MAX_WIDTH * 0.9,
    },
  }),
)
