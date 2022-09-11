import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'

import { EmptyScreenIcon } from '@assets/icons'
import { Button, Container, Header, Screen } from '@components'
import { useAppSelector } from '@hooks'
import { useFocusEffect } from '@react-navigation/native'
import { makeStyles } from '@themes'
import { keyExtractor } from '@ultils'
import Engine from 'core/Engine'
import { useNavigation } from 'navigation/NavigationService'
import { BackHandler, FlatList } from 'react-native'
import { useDispatch } from 'react-redux'
import { setSelectContact } from 'reduxs/reducers'

import { Contact } from '../@extracy-wallet-controller/src/WhiteListController/type'
import { AccountRecentItem } from './AccountRecentItem'

type WhiteListProps = {}

export const WhiteList: FC<WhiteListProps> = ({ props, route }: any) => {
  const themeStore = useAppSelector((state) => state.root.theme.theme)
  const styles = useStyles(props, themeStore)
  const navigation = useNavigation()
  const [contactList, setContactList] = useState<Contact[]>([])
  const { routeName } = route.params
  const dispatch = useDispatch()
  const selectContact = useAppSelector(
    (state) => state.root.contact.selectContact,
  )

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        routeName !== 'WhiteList'
          ? navigation.navigate('Setting')
          : navigation.goBack()
        return true
      }
      BackHandler.addEventListener('hardwareBackPress', onBackPress)

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress)
      }
    }, [navigation, routeName]),
  )

  const handleOpenAddWhiteList = useCallback(
    (route, item) => {
      navigation.navigate('AddEditWhiteList', {
        routeName: route,
      })
      dispatch(setSelectContact(item))
    },
    [dispatch, navigation],
  )

  const handleSelectContact = useCallback(
    (item) => {
      dispatch(setSelectContact(item))
      navigation.goBack()
    },
    [dispatch, navigation],
  )

  const listEmptyComponent = useMemo(() => {
    return (
      <Screen
        image={<EmptyScreenIcon />}
        text="No contact added. Add contact to your white list for easier and faster actions in the futute."
      />
    )
  }, [])

  const renderItem = ({ item, index }: { item: Contact; index: number }) => {
    const handleTouchItem = () => handleSelectContact(item)
    const handleEdit = () => handleOpenAddWhiteList('Edit', item)
    const isEdit = routeName === 'Setting' ? true : false
    return (
      <AccountRecentItem
        index={index}
        key={index}
        accountNameItem={item.name}
        address={item.address}
        handleTouchItem={handleTouchItem}
        isEdit={isEdit}
        handleEdit={handleEdit}
      />
    )
  }

  const getContactList = useCallback(async () => {
    const contacts = await Engine.context.WhiteListController?.getContactList()
    contacts && setContactList(contacts)
  }, [])

  useEffect(() => {
    getContactList()
  }, [getContactList, selectContact])

  return (
    <Container style={styles.root}>
      <Header title="White List Contact" />
      <FlatList
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        data={contactList}
        keyExtractor={keyExtractor}
        ListEmptyComponent={listEmptyComponent}
        scrollEnabled={contactList.length === 0 ? false : true}
      />
      {routeName === 'Setting' && (
        <Button
          text={'Add Contact'}
          onPress={() => handleOpenAddWhiteList('Add', '')}
          containerStyle={styles.bottom}
        />
      )}
    </Container>
  )
}

const useStyles = makeStyles<WhiteListProps>()(({ normalize, colors }) => ({
  root: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.grey16,
  },
  bottom: {
    marginHorizontal: normalize(16)('horizontal'),
    marginBottom: normalize(16)('vertical'),
  },
}))
