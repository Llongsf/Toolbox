"use client";

import * as React from "react";
import { Locale, TranslationKey, t } from "@/lib/i18n";
import { useAppStore } from "@/lib/store";

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = React.createContext<I18nContextValue>({
  locale: "zh",
  setLocale: () => {},
  t: (key) => key,
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const { locale, setLocale } = useAppStore();

  const value = React.useMemo(
    () => ({
      locale,
      setLocale,
      t: (key: TranslationKey) => t(locale, key),
    }),
    [locale, setLocale]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return React.useContext(I18nContext);
}