import React, { FC, useCallback, useEffect, useState } from 'react'

import { useAppSelector } from '@hooks'
import { useFocusEffect } from '@react-navigation/core'
import { makeStyles, useTheme } from '@themes'
import { SearchIcon } from 'assets'
import { Container, Header, TextInput } from 'components'
import { useNavigation } from 'navigation'
import { BackHandler, Dimensions, View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { Dapp } from 'reduxs/reducers'

import { DappItem, RouteType } from './DappItem'

const { width } = Dimensions.get('screen')
export type DappListProps = {}

export const DappList: FC<DappListProps> = ({ props, route }: any) => {
  const { DappList, routeName, bookmarkId } = route.params
  const themeStore = useAppSelector((state) => state.root.theme.theme)
  const theme = useTheme(themeStore)

  const styles = useStyles(props, themeStore)
  const navigation = useNavigation()
  const [list, setList] = useState<Dapp[]>(DappList)
  const [searchText, setText] = useState<string>('')

  useEffect(() => {
    const newList = DappList.filter((value: Dapp) => {
      return value.title.toLowerCase().match(searchText.toLowerCase())
    })
    setList(newList)
  }, [DappList, routeName, searchText])

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.goBack()
        return true
      }
      BackHandler.addEventListener('hardwareBackPress', onBackPress)

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress)
      }
    }, [navigation]),
  )

  const renderItem = ({ item, index }: { item: Dapp; index: number }) => {
    return (
      <View style={index === 0 ? styles.container : null}>
        <DappItem
          key={index}
          itemDapp={item}
          bookmarkId={bookmarkId}
          routeName={routeName}
        />
      </View>
    )
  }

  const textChangeHandler = useCallback((text: string) => {
    const keyRegEx = new RegExp(`^[^!-/:-@[-\`{-~]+$`)
    if (keyRegEx.test(text) || text === '') {
      setText(text)
    }
  }, [])

  return (
    <Container style={styles.root}>
      <Header
        title={routeName === RouteType.FavoriteDefault ? 'Favorite' : routeName}
      />
      <View style={styles.body}>
        <FlatList
          ListHeaderComponent={
            <View style={styles.searchBox}>
              <TextInput
                placeholder="Search bookmark"
                value={searchText}
                onChangeText={textChangeHandler}
                containerStyle={styles.inputStyle}
                height={48}
                rightIcon={<SearchIcon color={theme.colors.grey10} />}
                placeholderTextColor={theme.colors.grey12}
              />
            </View>
          }
          renderItem={renderItem}
          data={list}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="on-drag"
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </Container>
  )
}

const useStyles = makeStyles<DappListProps>()(({ colors, normalize }) => ({
  root: {
    backgroundColor: colors.grey16,
    flex: 1,
  },
  body: {
    flex: 1,
    backgroundColor: colors.grey16,
    flexDirection: 'column',
  },
  container: {
    width: width,
  },
  groupButton: {
    height: normalize(45)('moderate'),
    width: normalize(45)('moderate'),
    borderRadius: normalize(50)('moderate'),
    position: 'absolute',
    bottom: 28,
    right: 48,
  },
  icon: {
    height: normalize(40)('moderate'),
    width: normalize(45)('moderate'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  plus: {
    fontSize: normalize(45)('moderate'),
    position: 'absolute',
    color: colors.white,
  },
  searchBox: {
    alignItems: 'center',
    paddingBottom: normalize(20)('vertical'),
  },
  inputStyle: {
    width: width * 0.91,
    backgroundColor: colors.white,
    marginTop: normalize(30)('moderate'),
    borderRadius: normalize(16)('moderate'),
    borderColor: colors.grey12,
    color: colors.grey12,
  },
}))
