import React, { FC, useCallback, useMemo, useState } from 'react'

import { DangerIcon, Scan } from '@assets/icons'
import {
  Button,
  Container,
  Header,
  Scanner,
  Text,
  TextInput,
} from '@components'
import { useAppSelector } from '@hooks'
import { useNavigation } from '@navigation'
import { useFocusEffect } from '@react-navigation/native'
import { makeStyles, useTheme } from '@themes'
import Engine from 'core/Engine'
import {
  BackHandler,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native'
import { useDispatch } from 'react-redux'
import { setSelectContact } from 'reduxs/reducers'
import { isAddress } from 'web3-utils'

const { height, width } = Dimensions.get('screen')

type AddEditWhiteListProps = {}

enum Feat {
  add = 'Add',
  edit = 'Edit',
  delete = 'Delete',
  save = 'Save',
}

export const AddEditWhiteList: FC<AddEditWhiteListProps> = ({
  props,
  route,
}: any) => {
  const themeStore = useAppSelector((state) => state.root.theme.theme)
  const selectedAccountIndex = useAppSelector(
    (state) =>
      state.root.engine.backgroundState.PreferencesController
        ?.selectedAccountIndex,
  )
  const selectContact = useAppSelector(
    (state) => state.root.contact.selectContact,
  )

  const styles = useStyles(props, themeStore)
  const { routeName } = route.params
  const isAddWhiteList = useMemo(() => routeName === Feat.add, [routeName])
  const [contractAddress, setContractAddress] = useState<string>(
    selectContact.address,
  )
  const [name, setName] = useState<string>(
    isAddWhiteList ? '' : selectContact.name,
  )
  const [errorAddress, setErrorAddress] = useState<string>('')
  const [isValid, setValid] = useState<boolean>(false)
  const [isValidName, setValidName] = useState<boolean>(
    isAddWhiteList ? false : true,
  )

  const [scan, setScan] = useState<boolean>(false)
  const [errorName, setErrorName] = useState<string>('')
  const theme = useTheme(themeStore)

  const navigation = useNavigation()
  const dispatch = useDispatch()

  const keyboardVerticalOffset = Platform.OS === 'ios' ? 'padding' : 'height'

  const checkExist = useCallback(
    async (address) => {
      if (selectedAccountIndex !== undefined) {
        const checkContactExist =
          await Engine.context.WhiteListController?.checkContact({
            name: '',
            address: address,
            index: selectedAccountIndex,
          })

        if (isAddWhiteList && checkContactExist) {
          setErrorAddress(
            `Address has been registered with the name: ${checkContactExist.name}`,
          )
          setValid(false)
        }
        setErrorAddress('')
        setValid(true)
      }
    },
    [isAddWhiteList, selectedAccountIndex],
  )

  const validateContractAddress = useCallback(() => {
    if (contractAddress === '') {
      setErrorAddress('Address is Required')
      setValid(false)
    } else if (!isAddress(contractAddress)) {
      setErrorAddress('This is not in the correct format of address')
      setValid(false)
    } else {
      checkExist(contractAddress)
    }
  }, [checkExist, contractAddress])

  const validateContractName = useCallback(() => {
    if (name === '') {
      setErrorName('Name is Required')
      setValidName(false)
    } else if (name) {
      setErrorName('')
      setValidName(true)
    }
  }, [name])

  const handleOpenScan = useCallback(() => {
    setScan(true)
  }, [])

  const handleCloseScan = useCallback(() => {
    setScan(false)
  }, [])

  const handleCRUDWhiteList = useCallback(
    async (type) => {
      if (selectedAccountIndex !== undefined) {
        if (type === Feat.add) {
          await Engine.context.WhiteListController?.addContact({
            name: name,
            address: contractAddress,
            index: selectedAccountIndex,
          })
        } else if (type === Feat.edit) {
          await Engine.context.WhiteListController?.editContact({
            name: name,
            address: contractAddress,
            index: selectedAccountIndex,
          })
        } else {
          await Engine.context.WhiteListController?.removeContact({
            name: name,
            address: contractAddress,
            index: selectedAccountIndex,
          })
        }
        dispatch(
          setSelectContact({
            name: '',
            address: contractAddress,
            index: selectedAccountIndex,
          }),
        )
        navigation.goBack()
      }
    },

    [contractAddress, dispatch, name, navigation, selectedAccountIndex],
  )

  const handleValidate = (value: string) => {
    if (isAddress(value)) {
      setContractAddress(value)
      checkExist(value)
      setErrorAddress('')
      setValid(true)
    } else {
      setErrorAddress('QRCode is not in the correct format of address')
    }
    setScan(false)
    return
  }

  const rightIconAddressComponent = useMemo(() => {
    return (
      <TouchableOpacity onPress={handleOpenScan}>
        <Scan color={theme.colors.grayTextWeb} />
      </TouchableOpacity>
    )
  }, [handleOpenScan, theme.colors.grayTextWeb])

  const handleDelete = () => handleCRUDWhiteList(Feat.delete)

  const titleButton = useMemo(
    () => (isAddWhiteList ? Feat.add : Feat.save),
    [isAddWhiteList],
  )
  const handleButton = useCallback(() => {
    return isAddWhiteList
      ? handleCRUDWhiteList(Feat.add)
      : handleCRUDWhiteList(Feat.edit)
  }, [handleCRUDWhiteList, isAddWhiteList])

  const isDisabledButton = useMemo(() => {
    if (isAddWhiteList) {
      return !(isValid && isValidName)
    }
    if (selectContact.name === name) {
      return true
    }
    return !isValidName
  }, [isAddWhiteList, isValid, isValidName, name, selectContact.name])

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        !scan ? navigation.navigate('WhiteList') : setScan(false)
        return true
      }
      BackHandler.addEventListener('hardwareBackPress', onBackPress)

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress)
      }
    }, [navigation, scan]),
  )

  return (
    <Container style={styles.root}>
      {!scan ? (
        <>
          <Header
            title={isAddWhiteList ? 'Add Address' : 'Edit Address'}
            rightComponent={
              routeName !== Feat.add && (
                <Pressable onPress={handleDelete}>
                  <Text fontSize={14} lineHeight={16} color={theme.colors.red}>
                    Delete
                  </Text>
                </Pressable>
              )
            }
          />
          <View style={styles.groupSub}>
            <KeyboardAvoidingView
              style={styles.sendControlContainerOuter}
              behavior={keyboardVerticalOffset}
            >
              <ScrollView
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
              >
                <View style={styles.group}>
                  <TextInput
                    labelText={'Name'}
                    placeholder={'Enter name'}
                    value={name}
                    maxLength={16}
                    onChangeText={setName}
                    onSelectionChange={validateContractName}
                    containerStyle={styles.inputStyle}
                  />
                  {errorName !== '' && (
                    <View style={styles.groupErrorName}>
                      <DangerIcon />
                      <Text
                        style={styles.textDanger}
                        fontSize={11}
                        lineHeight={16}
                      >
                        {errorName}
                      </Text>
                    </View>
                  )}
                </View>

                <View
                  style={isAddWhiteList ? styles.group : styles.inputNameStyle}
                >
                  <TextInput
                    editable={isAddWhiteList ? true : false}
                    labelText={'Address'}
                    placeholder={'Search, public address, or ENS'}
                    value={contractAddress}
                    onChangeText={setContractAddress}
                    onEndEditing={validateContractAddress}
                    containerStyle={styles.inputStyle}
                    rightIcon={
                      isAddWhiteList ? rightIconAddressComponent : null
                    }
                  />
                  {errorAddress !== '' && (
                    <View style={styles.groupError}>
                      <DangerIcon />
                      <Text
                        style={styles.textDanger}
                        fontSize={11}
                        lineHeight={16}
                      >
                        {errorAddress}
                      </Text>
                    </View>
                  )}
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </View>

          <View style={styles.bottom}>
            <Button
              text={titleButton}
              disabled={isDisabledButton}
              onPress={handleButton}
            />
          </View>
        </>
      ) : (
        <Scanner onRead={handleValidate} back={handleCloseScan} />
      )}
    </Container>
  )
}

const useStyles = makeStyles<AddEditWhiteListProps>()(
  ({ normalize, colors }) => ({
    root: {
      flex: 1,
      flexDirection: 'column',
    },
    group: {
      height: normalize(65)('moderate'),
      marginVertical: normalize(15)('vertical'),
    },
    groupSub: {
      flexDirection: 'column',
      marginTop: normalize(20)('horizontal'),
      paddingHorizontal: normalize(15)('horizontal'),
      alignItems: 'center',
    },
    textDanger: {
      color: colors.alert,
      paddingLeft: normalize(4)('vertical'),
    },
    bottom: {
      flex: 1,
      justifyContent: 'flex-end',
      paddingHorizontal: normalize(15)('horizontal'),
      paddingBottom: normalize(4)('vertical'),
    },
    inputStyle: {
      width: width * 0.91,
    },
    groupError: {
      position: 'absolute',
      left: normalize(5)('horizontal'),
      bottom: normalize(-15)('horizontal'),
      flexDirection: 'row',
    },
    groupErrorName: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: normalize(5)('horizontal'),
    },
    sendControlContainerOuter: {
      height: height * 0.6,
    },
    inputNameStyle: {
      height: normalize(85)('horizontal'),
    },
  }),
)
