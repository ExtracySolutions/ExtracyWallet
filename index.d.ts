type ToastType = import('react-native-toast-notifications').ToastType

//@ts-ignore
declare global {
  const toast: ToastType
}

declare var toast: ToastType
