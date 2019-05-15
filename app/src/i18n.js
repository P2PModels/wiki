import i18n from 'i18next'
import Backend from 'i18next-fetch-backend'
import { initReactI18next } from 'react-i18next'

i18n
  // load translation using fetch -> see /public/locales
  // learn more: https://github.com/i18next/i18next-fetch-backend
  .use(Backend)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    lng: 'en',
    fallbackLng: 'en',
    ns: '',
    defaultNS: '',
    load: 'languageOnly',
    backend: {
      // We don't expect to use namespaces very often, so most of the keys are
      // going to be inside `locales/{{lng}}.json`.
      loadPath: (lng, ns) =>
        ns ? `locales/${lng}-${ns}.json` : `locales/${lng}.json`,
    },
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  })

export default i18n
