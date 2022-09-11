import React, { FC, useCallback } from 'react'

import { Button, Text } from '@components'
import { useAppSelector } from '@hooks'
import { makeStyles } from '@themes'
import { DeleteWalletIcon } from 'assets'
import { Dimensions, Modal, Platform, Pressable, View } from 'react-native'

const { width } = Dimensions.get('screen')

type DialogProps = {
  isVisible: boolean
  isRemove?: boolean
  setIsVisible: (isVisible: boolean) => void
  handleAccept: () => void
  title: string
  titleAccept?: string
  children?: React.ReactNode
  variantButtonAccept?: 'none' | 'fulfill' | 'delete' | 'normal'
  variantButtonCancel?: 'none' | 'fulfill' | 'delete' | 'normal'
  titlePosition?: 'top' | 'bottom'
}

export const Dialog: FC<DialogProps> = (props: any) => {
  const themeStore = useAppSelector((state) => state.root.theme.theme)
  const styles = useStyles(props, themeStore)
  const {
    isVisible,
    setIsVisible,
    handleAccept,
    title = '',
    children,
    titleAccept = 'Remove',
    variantButtonAccept = 'delete',
    variantButtonCancel = 'normal',
    titlePosition = 'bottom',
    isRemove = false,
  } = props

  const onRequestClose = useCallback(() => {
    setIsVisible(!isVisible)
  }, [isVisible, setIsVisible])

  const onCancel = useCallback(() => {
    setIsVisible(false)
  }, [setIsVisible])

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onRequestClose}
    >
      <View
        style={[
          Platform.OS === 'ios' ? styles.iOSBackdrop : styles.androidBackdrop,
          styles.backdrop,
        ]}
      />

      <Pressable style={styles.containerBox}>
        <Pressable style={styles.alertBox}>
          {titlePosition === 'top' && (
            <Text
              fontSize={18}
              lineHeight={24}
              style={styles.titleDialog}
              variant="bold"
            >
              {title}
            </Text>
          )}
          {isRemove && <DeleteWalletIcon />}
          {titlePosition === 'bottom' && (
            <Text
              fontSize={18}
              lineHeight={24}
              style={styles.titleDialog}
              variant="bold"
            >
              {title}
            </Text>
          )}
          {children}
          <View style={styles.buttonFooter}>
            <Button
              text={'Cancel'}
              variant={variantButtonCancel}
              containerStyle={styles.button}
              onPress={onCancel}
            />
            <Button
              text={titleAccept}
              variant={variantButtonAccept}
              containerStyle={styles.button}
              onPress={handleAccept}
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  )
}

const useStyles = makeStyles<DialogProps>()(({ normalize, colors }) => ({
  iOSBackdrop: {
    backgroundColor: colors.black,
    opacity: 0.4,
  },
  androidBackdrop: {
    backgroundColor: colors.backgroundModal,
    opacity: 0.32,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  containerBox: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertBox: {
    width: width * 0.9,
    alignItems: 'center',
    backgroundColor: colors.white,
    elevation: 24,
    borderRadius: normalize(16)('moderate'),
    paddingTop: normalize(16)('vertical'),
    paddingHorizontal: normalize(12)('horizontal'),
  },
  titleDialog: {
    color: colors.primary50,
    paddingBottom: normalize(8)('vertical'),
    textAlign: 'center',
    width: normalize(230)('horizontal'),
  },
  button: {
    flex: 1,
    marginHorizontal: normalize(4)('moderate'),
  },
  buttonFooter: {
    paddingTop: normalize(18)('vertical'),
    flexDirection: 'row',
  },
}))
