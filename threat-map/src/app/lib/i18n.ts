import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: { translation: { profile: 'Profile', save: 'Save', bio: 'Bio', username: 'Username' } },
      fr: { translation: { profile: 'Profil', save: 'Enregistrer', bio: 'Bio', username: "Nom d'utilisateur" } },
      es: { translation: { profile: 'Perfil', save: 'Guardar', bio: 'Bio', username: 'Nombre de usuario' } },
    },
  })

export default i18n
