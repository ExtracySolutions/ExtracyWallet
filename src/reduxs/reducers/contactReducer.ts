import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type Contact = {
  address: string
  index: number
  name: string
  randomNumber?: number
}

type ContactState = {
  selectContact: Contact
}
const defaultContactState: ContactState = {
  selectContact: {
    address: '',
    index: -1,
    name: '',
    randomNumber: 0,
  },
}

const contactSlice = createSlice({
  name: 'contact',
  initialState: defaultContactState,
  reducers: {
    setSelectContact(state: ContactState, action: PayloadAction<Contact>) {
      const RandomNumber = Math.floor(Math.random() * 100) + 1
      state.selectContact = { ...action.payload, randomNumber: RandomNumber }
    },
  },
})

export const { setSelectContact } = contactSlice.actions
export const ContactReducer = contactSlice.reducer
