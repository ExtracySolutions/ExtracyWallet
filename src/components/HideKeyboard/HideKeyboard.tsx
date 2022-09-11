import React from 'react'

import { Keyboard, TouchableWithoutFeedback } from 'react-native'

export const HideKeyboard = ({ children }: { children: React.ReactNode }) => {
  const dismiss = () => Keyboard.dismiss()
  return (
    <TouchableWithoutFeedback accessible={false} onPress={dismiss}>
      {children}
    </TouchableWithoutFeedback>
  )
}
