import { createInstance } from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './translations/en.json'
import ua from './translations/ua.json'

const i18n = createInstance({
  fallbackLng: 'en',
  lng: 'ua',
  debug: false,
  returnObjects: true,
  resources: {
    ua,
    en,
  },
})

i18n.use(initReactI18next).init()

export default i18n
