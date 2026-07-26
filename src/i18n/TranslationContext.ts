import React from 'react';
import { Language } from '../types';

export interface TranslationContextType {
  locale: Language;
  t: (key: string) => string;
  setLocale: (lang: Language) => void;
}

export const TranslationContext = React.createContext<TranslationContextType>({
  locale: 'english',
  t: (key: string) => key,
  setLocale: () => {},
});

export function useTranslation() {
  return React.useContext(TranslationContext);
}

