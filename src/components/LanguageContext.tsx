'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, DICTIONARY, TranslationKeys } from '@/lib/i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationKeys;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: DICTIONARY.en,
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('jalamitra_lang') as Language;
    if (saved && (saved === 'en' || saved === 'kn' || saved === 'hi')) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('jalamitra_lang', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: DICTIONARY[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
