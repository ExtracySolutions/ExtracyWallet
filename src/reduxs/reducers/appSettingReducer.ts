import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getI18n } from 'react-i18next'

export enum Language {
  en = 'en',
  vi = 'vi',
}

type AppSettingState = {
  language: Language
  currency: string
}

const defaultAppSettingState: AppSettingState = {
  language: Language.en,
  currency: 'vnd',
}

const appSettingSlice = createSlice({
  name: 'appSetting',
  initialState: defaultAppSettingState,
  reducers: {
    changeLanguage(state: AppSettingState, action: PayloadAction<Language>) {
      const i18n = getI18n()
      i18n.changeLanguage(action.payload)
      state.language = action.payload
    },
    changeCurrency(state: AppSettingState, action: PayloadAction<string>) {
      state.currency = action.payload
    },
  },
})

export const { changeLanguage, changeCurrency } = appSettingSlice.actions
export const AppSettingReducer = appSettingSlice.reducer
