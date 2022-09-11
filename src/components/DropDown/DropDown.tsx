import React, { FC, useState } from 'react'

import { ArrowDownIcon, ArrowUpIcon } from '@assets/icons'
import { useAppSelector } from '@hooks'
import { makeStyles, useTheme } from '@themes'
import { fontFamily } from 'assets/fonts'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import DropDownPicker, {
  DropDownPickerProps,
  ItemType as DRItemType,
} from 'react-native-dropdown-picker'

export type ItemType = DRItemType

export const DropDown: FC<DropDownPickerProps> = (props) => {
  const themeStore = useAppSelector((state) => state.root.theme.theme)
  const styles = useStyles(props, themeStore)
  const theme = useTheme(themeStore)
  const [isFocus, setIsFocus] = useState<boolean>(false)
  const { t } = useTranslation()
  const {
    onChangeValue,
    open,
    value,
    items,
    setOpen,
    setValue,
    setItems,
    containerStyle,
    placeholder,
  } = props

  DropDownPicker.addTranslation('TRANS', {
    PLACEHOLDER: placeholder ? placeholder : t('dropDownPlaceHolder'),
    SEARCH_PLACEHOLDER: t('dropDownSearch'),
    SELECTED_ITEMS_COUNT_TEXT: t('dropDownSelected'),
    NOTHING_TO_SHOW: t('dropDownNoting'),
  })
  DropDownPicker.setLanguage('TRANS')
  const handleOpen = (e: React.SetStateAction<boolean>) => {
    setIsFocus(e)
    setOpen(e)
  }
  return (
    <DropDownPicker
      open={open}
      iconContainerStyle={styles.iconContainerStyle}
      value={value}
      items={items}
      setOpen={handleOpen}
      setValue={setValue}
      setItems={setItems}
      zIndex={10000}
      zIndexInverse={30000}
      onChangeValue={onChangeValue}
      scrollViewProps={{
        decelerationRate: 'fast',
      }}
      modalProps={{
        animationType: 'fade',
      }}
      listMode="SCROLLVIEW"
      selectedItemContainerStyle={styles.selectedItemContainerStyle}
      style={[
        styles.picker,
        { borderColor: isFocus ? theme.colors.primary50 : theme.colors.grey12 },
        containerStyle,
      ]}
      textStyle={styles.pickerText}
      dropDownContainerStyle={styles.pickerBox}
      listItemContainerStyle={styles.listItemContainerStyle}
      ArrowDownIconComponent={({ style }) => (
        <View style={styles.icon}>
          <ArrowDownIcon
            style={style}
            color={isFocus ? theme.colors.primary50 : theme.colors.grey12}
          />
        </View>
      )}
      ArrowUpIconComponent={({ style }) => <ArrowUpIcon style={style} />}
      arrowIconStyle={styles.icon}
      showTickIcon={false}
    />
  )
}

const useStyles = makeStyles<DropDownPickerProps>()(
  ({ normalize, font, colors }) => ({
    picker: {
      height: normalize(43)('vertical'),
      backgroundColor: colors.white,
      borderWidth: 1,
      borderRadius: normalize(10)('moderate'),
      zIndex: 100,
    },
    pickerBox: {
      justifyContent: 'center',
      borderColor: colors.primary50,
      backgroundColor: colors.white,
      zIndex: 1000,
      position: 'absolute',
      borderWidth: 1,
      borderRadius: normalize(10)('moderate'),
    },
    pickerText: {
      color: colors.grey4,
      fontSize: font.size.s4,
      fontFamily: fontFamily.medium,
      lineHeight: font.lineHeight.lh4,
    },
    selectedItemContainerStyle: {
      zIndex: -100,
      backgroundColor: 'rgba(166, 180, 255, 0.1)',
    },
    iconContainerStyle: {
      width: normalize(25)('horizontal'),
      alignItems: 'center',
    },
    listItemContainerStyle: {
      height: normalize(45)('vertical'),
    },
    icon: {
      marginRight: normalize(1)('horizontal'),
    },
  }),
)
