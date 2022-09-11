import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'

import { Dialog, TextInput, Text } from '@components'
import { makeStyles, useTheme } from '@themes'
import {
  EditIcon,
  FavoriteIcon,
  FolderIcon,
  GarbageIcon,
  OptionIcon,
} from 'assets'
import { useAppDispatch, useAppSelector } from 'hooks'
import { Dimensions, Platform, View, TouchableOpacity } from 'react-native'
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu'
import { Dapp, editBookmarkName, removeBookmark } from 'reduxs/reducers'

export type BookmarksItemProps = {
  bookmarkName: string
  defaultColor?: boolean
  index?: number
  id?: string
  Dapp?: Dapp[]
  handleNavigate?: () => void
}

export enum ColorType {
  blue = 'blue',
  red = 'red',
  yellow = 'yellow',
  green = 'green',
  violet = 'violet',
  gray = 'gray',
}

export enum FeatType {
  delete = 'delete',
  rename = 'rename',
}

export const BookmarksItem: FC<BookmarksItemProps> = (props) => {
  const themeStore = useAppSelector((state) => state.root.theme.theme)
  const theme = useTheme(themeStore)
  const styles = useStyles(props)
  const { index, defaultColor, bookmarkName, id, Dapp, handleNavigate } = props
  const [visible, setVisible] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [result, setResult] = useState<string>(bookmarkName)
  const [isDelete, setShowDelete] = useState<boolean>(false)
  const [errorName, setErrorName] = useState<string>('')
  const [isValid, setValid] = useState<boolean>(false)

  const bookmarkRedux = useAppSelector((state) => state.root.browser.bookmarks)
  const dispatch = useAppDispatch()

  const validateBookmark = useCallback(() => {
    const previousEntry =
      bookmarkRedux &&
      bookmarkRedux.find((bookmark) => bookmark.bookmarkName === result)
    if (result === '') {
      setErrorName('Name is Required')
      setValid(false)
    } else if (previousEntry && result !== bookmarkName) {
      setErrorName('Name is exist')
    } else {
      setErrorName('')
      setValid(true)
    }
  }, [bookmarkRedux, bookmarkName, result])

  useEffect(() => {
    validateBookmark()
  }, [validateBookmark])

  const color = useMemo(() => {
    return defaultColor
      ? ColorType.blue
      : index === 0
      ? ColorType.red
      : index === 1
      ? ColorType.blue
      : index === 2
      ? ColorType.yellow
      : index === 3
      ? ColorType.green
      : index === 4
      ? ColorType.violet
      : ColorType.gray
  }, [defaultColor, index])

  const handleOpen = useCallback(
    (type: string) => {
      setModalVisible(true)
      setResult(bookmarkName)
      type === FeatType.delete ? setShowDelete(true) : setShowDelete(false)
    },
    [bookmarkName],
  )

  const handleClose = useCallback(() => {
    setModalVisible(false)
    setShowDelete(false)
  }, [])

  const handleEditBookmark = useCallback(async () => {
    dispatch(
      editBookmarkName({ bookmarkId: id ? id : '', bookmarkName: result }),
    )
    handleClose()
  }, [dispatch, handleClose, id, result])

  const handleRemoveBookmark = useCallback(async () => {
    dispatch(removeBookmark(id ? id : ''))
    handleClose()
  }, [dispatch, handleClose, id])

  const hideMenu = () => setVisible(false)

  const showMenu = () => setVisible(true)

  return (
    <View style={styles.root}>
      <View style={styles.item}>
        <TouchableOpacity style={styles.accountItem} onPress={handleNavigate}>
          <View style={styles.group}>
            <View style={styles.folderIcon}>
              {bookmarkName === 'Favorite' ? (
                <FavoriteIcon />
              ) : (
                <FolderIcon color={color} />
              )}
            </View>
          </View>
          <View style={styles.titleWrapper}>
            <Text
              variant="medium"
              style={styles.nameTitle}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {bookmarkName}
            </Text>
            <Text style={styles.subTitle}>
              {Dapp ? `${Dapp.length} items` : '0 items'}
            </Text>
          </View>
        </TouchableOpacity>

        {bookmarkName === 'Favorite' ? null : (
          <Menu
            style={styles.box}
            visible={visible || modalVisible}
            anchor={
              <TouchableOpacity onPress={showMenu} style={styles.optionIcon}>
                <OptionIcon color={theme.colors.primary20} />
              </TouchableOpacity>
            }
            onRequestClose={hideMenu}
          >
            <MenuItem
              onPress={() => {
                hideMenu()
                handleOpen(FeatType.rename)
              }}
              style={[
                FeatType.rename ? styles.lineItem : null,
                styles.itemPopup,
                Platform.OS === 'ios' ? styles.line : undefined,
              ]}
            >
              <View style={styles.editIcon}>
                <EditIcon color={theme.colors.grey8} />
                <Text style={styles.textPopup} variant="medium">
                  Rename
                </Text>
              </View>
            </MenuItem>
            <View style={styles.line}>
              <MenuDivider color={theme.colors.grey16} />
            </View>
            <MenuItem
              onPress={() => {
                hideMenu()
                handleOpen(FeatType.delete)
              }}
              style={[
                styles.itemPopup,
                Platform.OS === 'ios' ? styles.line : undefined,
              ]}
            >
              <View style={styles.editIcon}>
                <GarbageIcon
                  color={theme.colors.grey8}
                  width={24}
                  height={24}
                />
                <Text style={styles.textPopup} variant="medium">
                  Delete Folder
                </Text>
              </View>
            </MenuItem>
            {!visible && (
              <>
                {isDelete && (
                  <Dialog
                    isRemove={true}
                    isVisible={modalVisible}
                    setIsVisible={setModalVisible}
                    title="Do you want to delete this folder?"
                    titlePosition="top"
                    titleAccept="Delete"
                    handleAccept={() => handleRemoveBookmark()}
                  />
                )}
                {!isDelete && (
                  <Dialog
                    isVisible={modalVisible}
                    setIsVisible={setModalVisible}
                    title="Rename"
                    titlePosition="top"
                    titleAccept="OK"
                    variantButtonAccept="fulfill"
                    children={
                      <View style={styles.textInputWrapper}>
                        <TextInput
                          containerStyle={styles.containerStyle}
                          inputStyle={styles.inputStyle}
                          autoCapitalize={'none'}
                          onChangeText={setResult}
                          placeholder="Enter a name for this folder"
                          textAlignVertical="top"
                          height={84}
                          multiline
                          maxLength={12}
                        />
                      </View>
                    }
                    handleAccept={() => {
                      validateBookmark()
                      if (isValid) {
                        handleEditBookmark()
                        setModalVisible(false)
                      }
                    }}
                  />
                )}
              </>
            )}
          </Menu>
        )}
      </View>
    </View>
  )
}

const useStyles = makeStyles<BookmarksItemProps>()(
  ({ font, normalize, colors }) => ({
    root: {
      flex: 1,
    },
    item: {
      flex: 1,
      flexDirection: 'row',
      marginRight: normalize(10)('vertical'),
      borderRadius: normalize(10)('moderate'),
      backgroundColor: colors.primary0,
      justifyContent: 'center',
      paddingLeft: normalize(10)('moderate'),
    },
    accountItem: {
      flexDirection: 'column',
      flex: 1,
      width: normalize(80)('moderate'),
      height: normalize(120)('moderate'),
      paddingVertical: normalize(15)('moderate'),
      borderRadius: normalize(14)('moderate'),
      zIndex: -200,
    },
    group: {
      flex: 1,
      flexDirection: 'row',
      marginBottom: normalize(15)('vertical'),
    },
    titleWrapper: {
      flex: 1,
      flexDirection: 'column',
      zIndex: 100,
    },
    nameTitle: {
      fontSize: font.size.s4,
    },
    subTitle: {
      flex: 1,
      letterSpacing: 0.1,
      fontSize: font.size.s4,
      color: colors.grey8,
      marginTop: normalize(3)('vertical'),
    },
    folderIcon: {
      flex: 1,
    },
    optionIcon: {
      paddingHorizontal: normalize(10)('vertical'),
      paddingVertical: normalize(15)('vertical'),
      zIndex: 200,
    },
    box: {
      borderRadius: normalize(8)('moderate'),
    },
    editIcon: {
      alignItems: 'center',
      justifyContent: 'flex-start',
      flexDirection: 'row',
    },
    line: {
      marginHorizontal: normalize(16)('horizontal'),
    },
    textPopup: {
      fontSize: font.size.s4,
      paddingLeft: normalize(10)('horizontal'),
      color: colors.grey8,
    },
    itemPopup: {
      justifyContent: 'center',
      height: normalize(55)('moderate'),
    },
    lineItem: {
      borderBottomWidth: 0.5,
      borderBottomColor: colors.grey11,
    },
    textInputWrapper: {
      paddingHorizontal: normalize(5)('horizontal'),
      paddingVertical: normalize(5)('vertical'),
      width: '100%',
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
  }),
)
