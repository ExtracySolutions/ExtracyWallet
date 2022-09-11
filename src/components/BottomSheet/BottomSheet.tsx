import React, { forwardRef } from 'react'

import { useAppSelector } from '@hooks'
import { makeStyles, normalize } from '@themes'
import { Modalize as RNModalize, ModalizeProps } from 'react-native-modalize'
import { Portal } from 'react-native-portalize'

export type BottomSheetProps = ModalizeProps
export type Modalize = RNModalize

export const BottomSheet = forwardRef<RNModalize, BottomSheetProps>(
  (props, ref) => {
    const { children } = props

    const themeStore = useAppSelector((state) => state.root.theme.theme)
    const styles = useStyles(props, themeStore)

    return (
      <Portal>
        <RNModalize
          ref={ref}
          panGestureComponentEnabled={true}
          overlayStyle={styles.root}
          adjustToContentHeight={true}
          modalStyle={styles.modal}
          // closeOnOverlayTap={true}
          // panGestureEnabled={false}
          handlePosition="inside"
          {...props}
        >
          {children}
        </RNModalize>
      </Portal>
    )
  },
)
const useStyles = makeStyles<BottomSheetProps>()(({ colors }) => ({
  root: ({}) => ({
    backgroundColor: 'rgba(52, 52, 52, 0.5)',
  }),
  modal: {
    backgroundColor: colors.background,
    borderTopLeftRadius: normalize(16)('moderate'),
    borderTopRightRadius: normalize(16)('moderate'),
  },
}))
