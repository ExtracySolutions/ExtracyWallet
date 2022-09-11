import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { EmptyScreenIcon } from 'assets'
import { BottomSheet, Container, Header, Modalize, Text } from 'components'
import { useAppDispatch, useAppSelector } from 'hooks'
import { useNavigation } from 'navigation/NavigationService'
import {
  Platform,
  SectionList,
  ToastAndroid,
  View,
  BackHandler,
} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { clearBrowserHistory } from 'reduxs/reducers'
import { makeStyles } from 'themes'

import { DappHistoryCell } from './DappHistoryCell'
import { DappHistoryHeader } from './DappHistoryHeader'
import { DappBrowsingHistory as History } from './models/DappBrowsingHistory'

export const DappHistory = () => {
  const store = useAppSelector((state) => state.root.browser.history)
  const dispatch = useAppDispatch()
  const styles = useStyles()
  const bottomSheetRef = useRef<Modalize>(null)
  const navigation = useNavigation()

  const backHandler = useCallback(() => {
    navigation.goBack()
    return true
  }, [navigation])

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backHandler)
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backHandler)
    }
  }, [backHandler])

  const ListEmptyComponent = useMemo(
    () => (
      <View style={styles.emptyComponent}>
        <EmptyScreenIcon screen={'Tab'} />
        <View style={styles.groupText}>
          <Text variant="bold">No History</Text>
          <Text style={styles.text} variant="regular">
            {`Your browsing history will show in here.\nBut currently you don't have any history`}
          </Text>
        </View>
      </View>
    ),
    [styles.emptyComponent, styles.groupText, styles.text],
  )

  const ItemSeparator = useMemo(
    () => <View style={styles.separator} />,
    [styles.separator],
  )

  // const [histories, setHistories] = useState<History[]>([])
  const [sectionedHistories, setSectionedHistories] = useState<
    {
      date: Date
      data: History[]
    }[]
  >([])

  useEffect(() => {
    getSortedHistories(store)
  }, [store])

  const getSortedHistories = (histories: History[]) => {
    console.log('object')
    if (histories.length > 0) {
      const dateList = [...new Set(histories.map((item) => item.date))].slice(
        0,
        7,
      )
      const sectionedHistories = dateList.map((date) => {
        return {
          date: new Date(date),
          data: histories.filter((history) => {
            return history.date === date
          }),
        }
      })

      sectionedHistories.sort((a, b) => {
        return b.date.getTime() - a.date.getTime()
      })

      setSectionedHistories(sectionedHistories)

      return sectionedHistories
    }
    return []
  }

  const handleClearButtonPress = () => {
    if (sectionedHistories.length > 0) {
      bottomSheetRef.current?.open()
    }
    ToastAndroid.show('Your history is currently empty', ToastAndroid.SHORT)
  }

  // const handleClearTodayHistory = () => {
  //   let today = new Date()
  //   today.setHours(0, 0, 0, 0)

  //   let historiesWithoutToday = histories.filter((item) => {
  //     item.date !== today.toISOString()
  //   })
  //   let sortedHistories = getSortedHistories(historiesWithoutToday)
  //   setSectionedHistories(sortedHistories)

  //   dispatch(addToBrowserHistory(historiesWithoutToday))
  //   AsyncStorage.setItem(
  //     'DappHistory',
  //     JSON.stringify({ obj: historiesWithoutToday }),
  //     (err) => {
  //       if (err) {
  //         console.log('Clear DappHistory error:', err)
  //       }
  //       bottomSheetRef.current?.close()
  //     },
  //   )
  // }

  const handleClearAllHistory = () => {
    dispatch(clearBrowserHistory())
    setSectionedHistories([])
    bottomSheetRef.current?.close()
  }

  const ClearButton = (
    <TouchableOpacity
      onPress={handleClearButtonPress}
      style={styles.clearButtonContainer}
    >
      <Text variant="bold" style={styles.clearButtonText}>
        Clear
      </Text>
    </TouchableOpacity>
  )

  return (
    <Container>
      <Header title="History" rightComponent={ClearButton} />
      <SectionList
        sections={sectionedHistories}
        keyExtractor={(item, index) => `${index}`}
        renderSectionHeader={(item) => (
          <DappHistoryHeader date={item.section.date} />
        )}
        renderItem={(cell) => <DappHistoryCell data={cell.item} />}
        ListEmptyComponent={ListEmptyComponent}
        ItemSeparatorComponent={() => ItemSeparator}
        style={styles.list}
      />
      <BottomSheet
        ref={bottomSheetRef}
        adjustToContentHeight={true}
        panGestureEnabled={false}
        keyboardAvoidingBehavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        childrenStyle={styles.bottomSheetChildren}
      >
        {/* <TouchableOpacity
          onPress={() => handleClearTodayHistory()}
          style={styles.bottomSheetButton}
        >
          <Text style={styles.buttonText}>Today</Text>
        </TouchableOpacity>
        <View style={styles.bottomSheetSeparator} /> */}
        <TouchableOpacity
          onPress={() => handleClearAllHistory()}
          style={styles.bottomSheetButton}
        >
          <Text variant="medium" style={styles.buttonText}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => bottomSheetRef.current?.close()}
          style={styles.cancelButton}
        >
          <Text variant="medium" style={styles.cancelText}>
            Cancel
          </Text>
        </TouchableOpacity>
      </BottomSheet>
    </Container>
  )
}

const useStyles = makeStyles()(({ colors, font, normalize }) => ({
  list: {
    backgroundColor: colors.white,
    height: '100%',
    width: '100%',
  },
  clearButtonContainer: {
    padding: normalize(5)('moderate'),
    width: normalize(60)('moderate'),
  },
  clearButtonText: {
    fontSize: font.size.s3,
    color: colors.primary,
  },
  emptyComponent: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: normalize(200)('vertical'),
  },
  groupText: {
    alignItems: 'center',
    paddingHorizontal: normalize(55)('horizontal'),
  },
  text: {
    flex: 1,
    textAlign: 'center',
    fontSize: font.size.s4,
    paddingTop: normalize(10)('vertical'),
    color: colors.grey10,
  },
  separator: {
    marginHorizontal: normalize(30)('horizontal'),
    height: normalize(1)('vertical'),
    backgroundColor: colors.grey16,
  },
  bottomSheetSeparator: {
    height: normalize(1)('vertical'),
    backgroundColor: colors.grey12,
  },
  bottomSheetButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: normalize(20)('vertical'),
    paddingHorizontal: normalize(50)('horizontal'),
  },
  bottomSheetChildren: {
    marginTop: normalize(10)('vertical'),
  },
  cancelButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    marginHorizontal: normalize(32)('horizontal'),
    marginBottom: normalize(32)('vertical'),
    marginTop: normalize(15)('vertical'),
    borderRadius: normalize(13)('moderate'),
    paddingVertical: normalize(15)('vertical'),
    paddingHorizontal: normalize(50)('horizontal'),
  },
  buttonText: {
    color: colors.black,
    fontSize: font.size.s3,
  },
  cancelText: {
    fontSize: font.size.s3,
    color: colors.white,
  },
}))
