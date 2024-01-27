import { createInstance } from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './translations/en.json'
import ua from './translations/ua.json'

const i18n = createInstance({
  fallbackLng: 'ua',
  lng: 'ua',
  debug: false,
  returnObjects: true,
  resources: {
    en,
    ua,
  },
})

i18n.use(initReactI18next).init()

export default i18n
