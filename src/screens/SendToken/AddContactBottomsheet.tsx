import React, { useState, useCallback } from 'react'

import { DangerIcon } from '@assets/icons'
import { BottomSheet, Text, Button, Modalize, TextInput } from '@components'
import { useAppSelector } from '@hooks'
import { makeStyles } from '@themes'
import { View, Dimensions } from 'react-native'

const { width } = Dimensions.get('screen')

export type AddContactBottomsheetProps = {
  nameInput: string
  setNameInput: React.Dispatch<React.SetStateAction<string>>
  handleAddWhite: () => void
  handleCloseAddWhite: () => void
}

export const AddContactBottomsheet = React.forwardRef<
  Modalize,
  AddContactBottomsheetProps
>((props, ref) => {
  const themeStore = useAppSelector((state) => state.root.theme.theme)

  const styles = useStyles(props, themeStore)
  const { nameInput, setNameInput, handleAddWhite, handleCloseAddWhite } = props

  const [errorName, setErrorName] = useState<string>('')
  const [isValidName, setValidName] = useState<boolean>(false)

  const validateName = useCallback(async () => {
    if (nameInput === '') {
      setErrorName('Name is Required')
      setValidName(false)
    } else {
      setErrorName('')
      setValidName(true)
    }
  }, [nameInput])

  const HeaderComponent = useCallback(() => {
    return (
      <View style={styles.headerWrapper}>
        <Text variant="medium" style={styles.title}>
          Add New Contact
        </Text>
      </View>
    )
  }, [styles.headerWrapper, styles.title])

  const FooterComponent = useCallback(() => {
    return (
      <View style={styles.buttonBottomSheet}>
        <Button
          onPress={handleAddWhite}
          round
          disabled={!isValidName}
          text={'Add Contact'}
          variant="fulfill"
        />
      </View>
    )
  }, [handleAddWhite, isValidName, styles.buttonBottomSheet])

  return (
    <>
      <BottomSheet
        ref={ref}
        FooterComponent={FooterComponent}
        HeaderComponent={HeaderComponent}
        onClose={handleCloseAddWhite}
      >
        <View style={styles.bottomSheet}>
          <>
            <TextInput
              labelText={'Name'}
              placeholder={'Enter Name'}
              value={nameInput}
              onChangeText={setNameInput}
              onSelectionChange={validateName}
              containerStyle={styles.inputStyle}
            />

            <View style={[styles.groupError, styles.scaleHorizontal]}>
              {errorName !== '' && (
                <>
                  <DangerIcon />
                  <Text style={styles.text}>{errorName}</Text>
                </>
              )}
            </View>
          </>
        </View>
      </BottomSheet>
    </>
  )
})

const useStyles = makeStyles<AddContactBottomsheetProps>()(
  ({ normalize, colors, font }) => ({
    headerWrapper: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: normalize(15)('vertical'),
      borderBottomColor: colors.border,
      borderBottomWidth: 0.3,
    },
    inputStyle: {
      width: width * 0.9,
    },
    groupError: {
      alignSelf: 'flex-start',
      alignItems: 'center',
      paddingLeft: normalize(15)('horizontal'),
      paddingBottom: normalize(10)('horizontal'),
      height: normalize(30)('vertical'),
      flexDirection: 'row',
    },
    scaleHorizontal: {
      paddingLeft: normalize(0)('horizontal'),
    },
    buttonBottomSheet: {
      paddingBottom: normalize(15)('vertical'),
      paddingHorizontal: normalize(15)('horizontal'),
    },
    bottomSheet: {
      textAlign: 'justify',
      padding: normalize(15)('horizontal'),
      marginTop: normalize(15)('horizontal'),
    },
    text: {
      color: colors.alert,
      fontSize: font.size.caption2,
      left: normalize(5)('horizontal'),
    },
    title: {
      fontSize: font.size.button,
    },
  }),
)
