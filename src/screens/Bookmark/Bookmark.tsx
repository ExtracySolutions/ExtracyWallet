import React, { FC, useCallback, useEffect, useState } from 'react'

import { useAppDispatch, useAppSelector } from '@hooks'
import { makeStyles } from '@themes'
import { BookmarkEmpty } from 'assets'
import {
  Container,
  Header,
  Text,
  TextInput,
  BookmarksItem,
  Dialog,
} from 'components'
import { useNavigation } from 'navigation'
import {
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
  BackHandler,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { addBookmark, Bookmark as BookmarkType } from 'reduxs/reducers'
import { keyExtractor } from 'ultils'

const { width } = Dimensions.get('screen')

type BookmarkProps = {}

export const Bookmark: FC = ({ props }: any) => {
  const themeStore = useAppSelector((state) => state.root.theme.theme)
  const styles = useStyles(props, themeStore)
  const insets = useSafeAreaInsets()
  const selectedAccountIndex = useAppSelector(
    (state) =>
      state.root.engine.backgroundState.PreferencesController
        ?.selectedAccountIndex,
  )
  const bookmarkRedux = useAppSelector((state) => state.root.browser.bookmarks)
  const navigation = useNavigation()
  const dispatch = useAppDispatch()

  const [modalVisible, setModalVisible] = useState(false)
  const [isValid, setValid] = useState<boolean>(false)
  const [result, setResult] = useState<string>('')
  const [errorName, setErrorName] = useState<string>('')
  const [bookmarkList, setBookmarkList] = useState<BookmarkType[]>([])
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 'padding' : 'height'

  const getBookmarkList = useCallback(async () => {
    bookmarkRedux && setBookmarkList(bookmarkRedux)
  }, [bookmarkRedux])

  const validateBookmark = useCallback(() => {
    const previousEntry =
      bookmarkRedux &&
      bookmarkRedux.find((bookmark) => bookmark.bookmarkName === result)
    if (result === '') {
      setErrorName('Name is Required')
      setValid(false)
    } else if (previousEntry) {
      setErrorName('Name is exist')
    } else {
      setErrorName('')
      setValid(true)
    }
  }, [bookmarkRedux, result])

  const handleBack = useCallback(() => {
    navigation.goBack()
  }, [navigation])

  const backHandler = useCallback(() => {
    navigation.goBack()
    return true
  }, [navigation])

  useEffect(() => {
    getBookmarkList()
    validateBookmark()
  }, [bookmarkRedux, getBookmarkList, insets, validateBookmark])

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backHandler)
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backHandler)
    }
  }, [backHandler])

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
      dispatch(addBookmark({ bookmarkName: result, Dapp: [] }))
    }
    handleClose()
  }, [dispatch, handleClose, result, selectedAccountIndex])

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

  const renderBookMarksItem = ({
    item,
    index,
  }: {
    item: any
    index: number
  }) => {
    if (item.empty === true) {
      return <View key={index} style={[styles.item, styles.itemEmpty]} />
    }
    return (
      <View key={index} style={styles.item}>
        <BookmarksItem
          {...item}
          handleDelete={handleOpen}
          defaultColor={true}
          handleNavigate={() =>
            handleNavigation('DappList', item.Dapp, item.bookmarkName, item.id)
          }
        />
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
    <Container>
      <KeyboardAvoidingView
        behavior={keyboardVerticalOffset}
        style={styles.root}
      >
        <Header title="Your Bookmark" handleBack={handleBack} />
        <ScrollView showsVerticalScrollIndicator={false}>
          {bookmarkList.length === 0 ? null : (
            <TouchableOpacity onPress={handleOpen} style={styles.borderTitle}>
              <Text variant={'bold'} style={styles.titleMore}>
                + New folder
              </Text>
            </TouchableOpacity>
          )}

          <View
            style={[
              styles.container,
              bookmarkList.length < 3 && styles.containerScale,
            ]}
          >
            <FlatList
              data={bookmarkList}
              renderItem={renderBookMarksItem}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              scrollEnabled={false}
              keyExtractor={keyExtractor}
              style={bookmarkList.length === 0 ? null : styles.flatlist}
              columnWrapperStyle-={styles.columnWrapper}
              numColumns={3}
              ListEmptyComponent={listEmptyComponent}
            />
          </View>
          <Dialog
            isVisible={modalVisible}
            setIsVisible={setModalVisible}
            title="New Folder"
            titleAccept="OK"
            variantButtonAccept="fulfill"
            handleAccept={handleAddBookmark}
            children={
              <>
                <TextInput
                  containerStyle={styles.containerStyle}
                  inputStyle={styles.inputStyle}
                  autoCapitalize={'none'}
                  onChangeText={setResult}
                  placeholder={'Enter a name for this folder'}
                  textAlignVertical="top"
                  height={84}
                  multiline
                  maxLength={12}
                  value={result}
                />
                {!isValid && (
                  <View style={styles.errorWrapper}>
                    <Text variant="light" style={styles.errorText}>
                      {errorName}
                    </Text>
                  </View>
                )}
              </>
            }
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  )
}

const useStyles = makeStyles<BookmarkProps>()(
  ({ normalize, colors, font }) => ({
    root: {
      height: '100%',
      flexDirection: 'column',
      marginBottom: normalize(105)('moderate'),
    },
    item: {
      width: width / 3.3,
      height: normalize(120)('moderate'),
      marginBottom: normalize(15)('vertical'),
    },
    flatlist: {
      flexWrap: 'wrap',
      flexDirection: 'row',
    },
    itemEmpty: {
      backgroundColor: colors.transparent,
    },
    containerStyle: {
      backgroundColor: colors.white,
      marginVertical: normalize(5)('vertical'),
    },
    inputStyle: {
      width: normalize(235)('vertical'),
      height: normalize(10)('vertical'),
      marginRight: normalize(10)('vertical'),
      paddingTop: normalize(5)('vertical'),
    },
    borderTitle: {
      marginHorizontal: normalize(22)('horizontal'),
      marginVertical: normalize(16)('vertical'),
      alignItems: 'flex-end',
      justifyContent: 'center',
    },
    titleMore: {
      color: colors.primary,
      fontSize: font.size.s4,
      borderColor: colors.primary,
      textAlign: 'center',
      borderWidth: 1,
      borderRadius: normalize(15)('moderate'),
      paddingVertical: normalize(5)('moderate'),
      paddingHorizontal: normalize(8)('moderate'),
    },
    columnWrapper: {
      width: 50,
      justifyContent: 'space-around',
      alignItems: 'flex-start',
      alignSelf: 'flex-start',
    },
    container: {
      flex: 1,
      alignItems: 'center',
      paddingHorizontal: normalize(22)('moderate'),
      justifyContent: 'center',
    },
    containerScale: {
      alignItems: 'flex-start',
    },
    containerEmptyList: {
      alignItems: 'center',
      marginHorizontal: normalize(50)('horizontal'),
      marginTop: 50,
    },
    errorWrapper: {
      flexDirection: 'row',
      backgroundColor: colors.alertBG,
      padding: normalize(6)('moderate'),
      borderRadius: normalize(8)('moderate'),
    },
    errorText: {
      color: colors.alert,
      fontSize: font.size.s4,
    },
    titleEmptyList: {
      flex: 1,
      textAlign: 'center',
      fontSize: font.size.s3,
      color: colors.grey4,
      paddingVertical: normalize(10)('vertical'),
    },
    textEmptyList: {
      flex: 1,
      textAlign: 'center',
      fontSize: font.size.s4,
      color: colors.grey8,
      paddingBottom: normalize(20)('vertical'),
    },
    textAddForder: {
      color: colors.primary,
      fontSize: font.size.s4,
      borderColor: colors.primary,
      borderWidth: 1,
      borderRadius: normalize(10)('moderate'),
      paddingVertical: normalize(5)('moderate'),
      paddingHorizontal: normalize(7)('moderate'),
    },
  }),
)
