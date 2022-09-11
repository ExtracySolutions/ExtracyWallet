import I18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from './en'
import vi from './vi'

const resources = {
  en: {
    translation: en,
  },
  vi: {
    translation: vi,
  },
}

I18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  keySeparator: '.',
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
})

// The method we'll use insteed of the regular string
export function strings(name: string, params: any = {}) {
  return I18n.t(name, params)
}
export default I18n
