import React from 'react';
import { Language } from '../types';
import { TranslationContext, useTranslation } from './TranslationContext';
import { TRANSLATIONS } from './translations';

export { useTranslation };

export function LanguageProvider({ children, language, onLanguageChange }: {
  children: React.ReactNode;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}): React.ReactElement {
  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] ?? TRANSLATIONS['english']?.[key] ?? key;
  };

  return React.createElement(
    TranslationContext.Provider,
    { value: { locale: language, t, setLocale: onLanguageChange } },
    children
  );
}

export const LANGUAGES: { key: Language; label: string; native: string; flag: string }[] = [
  { key: 'english', label: 'English', native: 'English', flag: '🇬🇧' },
  { key: 'shona', label: 'Shona', native: 'chiShona', flag: '🇿🇼' },
  { key: 'ndebele', label: 'Ndebele', native: 'isiNdebele', flag: '🇿🇼' },
];

