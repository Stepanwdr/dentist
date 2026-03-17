// src/shared/i18n/core.tsx
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { dictionaries, type Locale, monthNames, dayNamesShort } from './dictionaries';

// Module-level locale for non-React helpers (e.g., date formatters)
let currentLocale: Locale = 'ru';
export function getLocale(): Locale {
  return currentLocale;
}

export function setLocaleGlobal(next: Locale) {
  currentLocale = next;
}

export type I18nContextType = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode; initialLocale?: Locale }> = ({
  children,
  initialLocale = 'ru',
}) => {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    setLocaleGlobal(l);
  }, []);

  // Ensure module-level is in sync on first render
  if (currentLocale !== locale) setLocaleGlobal(locale);

  const t = useCallback(
    (key: string) => {
      const dict = dictionaries[locale];
      return dict[key] ?? key;
    },
    [locale]
  );

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export function useI18n(): I18nContextType {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}

// Expose month/day helpers for date formatting modules
export function getMonthName(monthIndex: number, type: 'full' | 'short' = 'short'): string {
  const loc = getLocale();
  return monthNames[loc][type][monthIndex] ?? '';
}

export function getDayNameShort(dayIndex: number): string {
  const loc = getLocale();
  return dayNamesShort[loc][dayIndex] ?? '';
}

export { dictionaries };
