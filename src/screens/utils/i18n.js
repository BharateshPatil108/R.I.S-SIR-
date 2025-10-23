import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import your language files
import en from '../res/String_En';
import kn from '../res/String_Kn';

// Function to load the language from AsyncStorage
const loadLanguage = async () => {
  try {
    const storedLanguage = await AsyncStorage.getItem('appLanguage');
    return storedLanguage || 'en'; // Default to English if no language is stored
  } catch (error) {
    // console.log('Error loading language from AsyncStorage', error);
    return 'en'; // Default to English in case of error
  }
};

// Configuration
const initI18n = async () => {
  const language = await loadLanguage();

  i18n
    .use(initReactI18next)
    .init({
      compatibilityJSON: 'v3',
      fallbackLng: 'en', // Fallback language is English
      lng: language, // Set default language dynamically
      resources: {
        en: { translation: en },
        kn: { translation: kn },
      },
      interpolation: {
        escapeValue: false, // React already handles escaping
      },
    });
};

// Call the initialization function
initI18n();

export default i18n;
