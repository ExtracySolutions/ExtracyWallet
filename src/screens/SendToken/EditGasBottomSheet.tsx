import React, { useCallback, useEffect, useState } from 'react'

import { BottomSheet, Button, Modalize, Text } from '@components'
import { useAppSelector } from '@hooks'
import { makeStyles, useTheme } from '@themes'
import { TouchableOpacity, View } from 'react-native'

import { AdvanceEdit } from './AdvanceEdit'
import { BasicEdit } from './BasicEdit'

const enum TabType {
  BASIC = 'BASIC',
  ADVANCE = 'ADVANCE',
}

export type EditGasBottomSheetProps = {
  gasPrice: string
  setGasPrice: React.Dispatch<React.SetStateAction<string>>
  gasLimit: string
  setGasLimit: React.Dispatch<React.SetStateAction<string>>

  ticker: string
  handleCloseEditGasBottomSheet: () => void
  networkID: string
}

export const EditGasBottomSheet = React.forwardRef<
  Modalize,
  EditGasBottomSheetProps
>((props, ref) => {
  const themeStore = useAppSelector((state) => state.root.theme.theme)
  const { colors } = useTheme(themeStore)
  const styles = useStyles(props, themeStore)
  const {
    gasLimit,
    gasPrice,

    ticker,
    networkID,
    setGasLimit,
    setGasPrice,
    handleCloseEditGasBottomSheet,
  } = props

  const [currentTabType, setCurrentTabType] = useState(TabType.BASIC)
  const [snapGasPrice, setSnapGasPrice] = useState<string>('')
  const [snapGasLimit, setSnapGasLimit] = useState<string>('')
  const [gasPriceBasic, setGasPriceBasic] = useState<string>('')

  useEffect(() => {
    setSnapGasLimit(gasLimit)
    setSnapGasPrice(gasPrice)
  }, [gasLimit, gasPrice])

  const handleChangeTab = useCallback((type: TabType) => {
    setCurrentTabType(type)
  }, [])

  const handleChangeGasPrice = useCallback((value: string) => {
    setSnapGasPrice(value)
  }, [])

  const handleChangeGasLimit = useCallback((value: string) => {
    setSnapGasLimit(value)
  }, [])

  const onOverlayPress = useCallback(() => {
    setSnapGasLimit(gasLimit)
    setSnapGasPrice(gasPrice)
  }, [gasLimit, gasPrice])

  const handleSaveEstimateGas = useCallback(() => {
    setGasLimit(snapGasLimit)
    setGasPrice(currentTabType === TabType.BASIC ? gasPriceBasic : snapGasPrice)
    handleCloseEditGasBottomSheet()
  }, [
    currentTabType,
    gasPriceBasic,
    handleCloseEditGasBottomSheet,
    setGasLimit,
    setGasPrice,
    snapGasLimit,
    snapGasPrice,
  ])

  const HeaderComponent = useCallback(() => {
    return (
      <View style={styles.headerWrapper}>
        <Text variant="bold" fontSize={14} lineHeight={24}>
          Edit Estimate Gas
        </Text>
      </View>
    )
  }, [styles.headerWrapper])

  const FooterComponent = useCallback(() => {
    return (
      <View style={styles.buttonBottomSheetGas}>
        <Button text="Save" onPress={handleSaveEstimateGas} />
      </View>
    )
  }, [handleSaveEstimateGas, styles.buttonBottomSheetGas])

  return (
    <>
      <BottomSheet
        ref={ref}
        HeaderComponent={HeaderComponent}
        FooterComponent={FooterComponent}
        onOverlayPress={onOverlayPress}
      >
        <View style={[styles.bottomSheet, styles.scaleHeight]}>
          <View style={styles.tab}>
            <TouchableOpacity
              style={[
                styles.itemTab,
                currentTabType === TabType.BASIC && styles.itemChoose,
              ]}
              onPress={() => handleChangeTab(TabType.BASIC)}
            >
              <Text
                fontSize={16}
                color={
                  currentTabType === TabType.BASIC
                    ? colors.primary50
                    : colors.grey11
                }
              >
                Basic
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.itemTab,
                currentTabType === TabType.ADVANCE && styles.itemChoose,
              ]}
              onPress={() => handleChangeTab(TabType.ADVANCE)}
            >
              <Text
                fontSize={16}
                color={
                  currentTabType === TabType.ADVANCE
                    ? colors.primary50
                    : colors.grey11
                }
              >
                Advanced
              </Text>
            </TouchableOpacity>
          </View>
          {currentTabType === TabType.BASIC ? (
            <BasicEdit
              networkID={networkID}
              ticker={ticker}
              setGasPriceBasic={setGasPriceBasic}
            />
          ) : (
            <AdvanceEdit
              gasLimit={snapGasLimit}
              gasPrice={snapGasPrice}
              ticker={ticker}
              handleChangeGasPrice={handleChangeGasPrice}
              handleChangeGasLimit={handleChangeGasLimit}
            />
          )}
        </View>
      </BottomSheet>
    </>
  )
})

const useStyles = makeStyles<EditGasBottomSheetProps>()(
  ({ normalize, colors }) => ({
    headerWrapper: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingBottom: normalize(16)('vertical'),
      paddingTop: normalize(24)('vertical'),
      borderBottomColor: colors.grey14,
      borderBottomWidth: 1,
    },

    buttonBottomSheetGas: {
      paddingBottom: normalize(15)('vertical'),
      paddingHorizontal: normalize(15)('horizontal'),
    },
    bottomSheet: {
      textAlign: 'justify',
      padding: normalize(16)('moderate'),
    },
    scaleHeight: {
      height: normalize(360)('horizontal'),
    },
    itemTab: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: normalize(10)('vertical'),
    },
    tab: {
      height: normalize(44)('horizontal'),
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: normalize(22)('moderate'),
    },
    itemChoose: {
      backgroundColor: colors.primary0,
      paddingVertical: normalize(10)('vertical'),
      borderRadius: normalize(30)('moderate'),
    },
  }),
)
