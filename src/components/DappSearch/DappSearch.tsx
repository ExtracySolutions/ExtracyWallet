import React, {
  FC,
  useMemo,
  useCallback,
  useRef,
  useState,
  useEffect,
} from 'react'

import { Bookmarks } from '@assets/icons'
import { useAppSelector } from '@hooks'
import { makeStyles, useTheme } from '@themes'
import { DeleteIcon } from 'assets/icons/DeleteIcon'
import { ReloadIcon } from 'assets/icons/ReloadButtonIcon'
import { isEmpty } from 'lodash'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
} from 'react-native'
import { BallIndicator } from 'react-native-indicators'
import WebView from 'react-native-webview'
export type DappSearchProps = {
  webviewRef?: React.RefObject<WebView>
  searchText: string
  onShowTab?: () => void
  setSearchText: React.Dispatch<React.SetStateAction<string>>
  handleSearch: (searchText: string) => void
  handleBookmark?: () => void
  loading?: boolean
  disableBookmark?: boolean
  URLState?: string
  disableSearch?: boolean
}

export const DappSearch: FC<DappSearchProps> = (props) => {
  const themeStore = useAppSelector((state) => state.root.theme.theme)
  const { tabs } = useAppSelector((state) => state.root.browser)
  const bookmarkList = useAppSelector((state) => state.root.browser.bookmarks)
  const styles = useStyles(props, themeStore)
  const theme = useTheme(themeStore)
  const inputRef = useRef<TextInput>(null)
  const [isFocused, setIsFocused] = useState<boolean>(false)
  const [isExist, setExist] = useState<boolean>(false)
  const {
    onShowTab,
    searchText,
    setSearchText,
    handleSearch,
    handleBookmark,
    loading,
    disableBookmark,
    URLState,
    disableSearch,
  } = props

  const numberOfTabs = useMemo(() => {
    return tabs.length
  }, [tabs.length])

  const onSubmitEditing = useCallback(
    ({
      nativeEvent,
    }: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
      setSearchText(nativeEvent.text)
      handleSearch(nativeEvent.text)
    },
    [handleSearch, setSearchText],
  )

  const onReloadPage = () => {
    if (isFocused) {
      props.setSearchText('')
      setIsFocused(false)
      return
    }
    props.webviewRef.current?.reload()
    inputRef.current?.isFocused() && setIsFocused(true)
  }

  useEffect(() => {
    let countPrevious = 0
    let previousEntry
    bookmarkList.forEach((bookmark) => {
      if (bookmark.Dapp) {
        previousEntry = bookmark.Dapp.find((dapp) => {
          return dapp.URL === URLState
        })

        if (!isEmpty(previousEntry)) {
          countPrevious = countPrevious + 1
        } else {
          countPrevious = countPrevious
        }
      }
    })
    if (countPrevious === 0) {
      setExist(false)
    } else {
      setExist(true)
    }
  }, [URLState, bookmarkList])

  return (
    <View style={styles.root}>
      <View
        style={[
          styles.group,
          disableSearch && disableBookmark && styles.groupOnlyTab,
        ]}
      >
        {!disableSearch && (
          <View style={styles.urlSection}>
            <TextInput
              ref={inputRef}
              placeholder="Search or enter Dapp URL"
              onChangeText={setSearchText}
              onSubmitEditing={onSubmitEditing}
              value={searchText}
              style={styles.urlInput}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            <TouchableOpacity onPress={onReloadPage} style={styles.reloadIcon}>
              {disableBookmark && isFocused ? (
                <DeleteIcon color="#CACACA" />
              ) : (
                <ReloadIcon color="#CACACA" />
              )}
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity style={styles.border} onPress={onShowTab}>
          <Text style={styles.textHeader}>{numberOfTabs}</Text>
        </TouchableOpacity>
        {disableBookmark ? null : loading ? (
          <View>
            <BallIndicator
              size={theme.normalize(14)('moderate')}
              color={theme.colors.grayPastel}
            />
          </View>
        ) : (
          <TouchableOpacity onPress={handleBookmark}>
            <Bookmarks
              color={isExist ? theme.colors.primary : theme.colors.borderPortal}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

const useStyles = makeStyles<DappSearchProps>()(
  ({ normalize, colors, font }) => ({
    root: {
      paddingHorizontal: normalize(16)('moderate'),
      backgroundColor: colors.white,
      flex: 1,
    },
    group: {
      alignItems: 'center',
      justifyContent: 'space-around',
      flexDirection: 'row',
      height: normalize(40)('moderate'),
    },
    groupOnlyTab: {
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    urlSection: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      width: normalize(280)('moderate'),
      height: normalize(40)('moderate'),
      paddingLeft: normalize(12)('moderate'),
      borderRadius: normalize(10)('moderate'),
      backgroundColor: colors.search,
    },
    urlInput: {
      width: normalize(240)('moderate'),
      height: normalize(40)('moderate'),
      color: colors.basic,
    },
    border: {
      width: normalize(24)('moderate'),
      height: normalize(24)('moderate'),
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: normalize(7)('moderate'),
      borderColor: colors.borderPortal,
      borderWidth: 1,
    },
    reloadIcon: {
      width: normalize(40)('moderate'),
      height: normalize(35)('moderate'),
      paddingRight: normalize(20)('moderate'),
      alignItems: 'center',
      justifyContent: 'center',
    },
    textHeader: {
      fontSize: font.size.caption1,
      color: colors.basic,
    },
  }),
)
