import React, { FC, useCallback, useState, useEffect, useRef } from 'react'

import { Text } from '@components'
import { TransactionMeta } from '@extracy-wallet-controller'
import { useAppSelector } from '@hooks'
import { makeStyles, useTheme } from '@themes'
import { keyExtractor, decodeTransaction, TransactionElement } from '@ultils'
import { View, FlatList, Dimensions, ScrollView } from 'react-native'
import { MaterialIndicator } from 'react-native-indicators'
import { useSharedValue } from 'react-native-reanimated'

import { ActivityItem } from './ActivityItem'

const { height } = Dimensions.get('screen')

export const Activity: FC = (props) => {
  const themeStore = useAppSelector((state) => state.root.theme.theme)
  const styles = useStyles(props, themeStore)
  const theme = useTheme(themeStore)

  const currentOffset = useRef<number>(1)
  const offset = useSharedValue(1)

  const transactionHistory = useAppSelector(
    (state) =>
      state.root.engine.backgroundState.TransactionController?.transactions,
  )
  const selectedAccountIndex = useAppSelector(
    (state) =>
      state.root.engine.backgroundState.PreferencesController
        ?.selectedAccountIndex,
  )

  const [isLoading, setLoading] = useState<boolean>(true)
  const [activitiesItemArr, setActivitiesItemArr] = useState<
    TransactionElement[]
  >([])

  const parseDataTx = useCallback(
    async (tx: TransactionMeta) => {
      return await decodeTransaction({
        tx,
        selectedAddress: selectedAccountIndex as any,
      })
    },
    [selectedAccountIndex],
  )

  const nomalizeData = useCallback(async () => {
    let txHistoryArray: TransactionMeta[] =
      //@ts-ignore
      transactionHistory[selectedAccountIndex]
    const promiseArray: TransactionElement[] = []

    for (let txIndex in txHistoryArray) {
      const activitiesArray = await parseDataTx(txHistoryArray[txIndex])
      promiseArray.push(activitiesArray)
    }
    await Promise.all(promiseArray)
    //@ts-ignore
    promiseArray.sort((a, b) => (a?.date < b?.date ? 1 : -1))
    setLoading(false)
    setActivitiesItemArr(promiseArray)
  }, [parseDataTx, selectedAccountIndex, transactionHistory])

  const handleScroll = useCallback(
    (event) => {
      const offsetList = event.nativeEvent.contentOffset.y

      if (currentOffset.current > offsetList) {
        offset.value = 1
        props.route.params.setIsMoving(false) // move bottom
      } else {
        offset.value = 0
        props.route.params.setIsMoving(true) // move top
      }
    },
    [offset, props.route.params],
  )

  useEffect(() => {
    nomalizeData()
  }, [nomalizeData])

  const renderItem = ({
    item,
  }: {
    item: TransactionElement
    index: number
  }) => {
    return <ActivityItem {...item} />
  }

  const ListEmptyComponent = useCallback(() => {
    return (
      <View style={[styles.emptyWrapper, isLoading && styles.center]}>
        {isLoading ? (
          <View style={styles.loading}>
            <MaterialIndicator
              size={theme.normalize(30)('moderate')}
              color={theme.colors.primary}
            />
          </View>
        ) : (
          <Text style={styles.emptyText}>
            No transaction here, let make transaction!! 🍀
          </Text>
        )}
      </View>
    )
  }, [
    isLoading,
    styles.center,
    styles.emptyText,
    styles.emptyWrapper,
    styles.loading,
    theme,
  ])

  return (
    <View style={styles.root}>
      <FlatList
        bounces={false}
        renderItem={renderItem}
        data={activitiesItemArr}
        keyExtractor={keyExtractor}
        scrollEventThrottle={1}
        ListEmptyComponent={ListEmptyComponent}
        showsVerticalScrollIndicator={false}
        renderScrollComponent={(props) => (
          <ScrollView {...props} onScroll={handleScroll} />
        )}
      />
    </View>
  )
}

const useStyles = makeStyles()(({ normalize, font, colors }) => ({
  root: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.grey16,
  },
  emptyWrapper: {
    height: height * 0.5,
    marginVertical: normalize(25)('vertical'),
  },
  center: {
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: font.size.s3,
    color: colors.grey12,
  },
  loading: {
    width: normalize(100)('moderate'),
  },
}))
