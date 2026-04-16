'use client'

import * as React from 'react'
import {
  defaultLocale,
  getDictionary,
  localeCookieName,
  normalizeLocale,
  tFor,
  type Locale,
  type TranslationKey,
} from '@/lib/i18n'

type LocaleContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: TranslationKey, params?: Record<string, string | number>) => string
}

const LocaleContext = React.createContext<LocaleContextValue | null>(null)

export function LocaleProvider({
  initialLocale = defaultLocale,
  children,
}: {
  initialLocale?: Locale
  children: React.ReactNode
}) {
  const [locale, setLocaleState] = React.useState<Locale>(initialLocale)

  const setLocale = React.useCallback((nextLocale: Locale) => {
    const normalized = normalizeLocale(nextLocale)
    setLocaleState(normalized)
    document.cookie = `${localeCookieName}=${normalized}; path=/; max-age=31536000; samesite=lax`
    window.localStorage.setItem(localeCookieName, normalized)
    document.documentElement.lang = normalized
  }, [])

  React.useEffect(() => {
    const storedLocale = window.localStorage.getItem(localeCookieName)
    const normalized = normalizeLocale(storedLocale)

    if (normalized !== locale) {
      setLocaleState(normalized)
      document.documentElement.lang = normalized
      document.cookie = `${localeCookieName}=${normalized}; path=/; max-age=31536000; samesite=lax`
      return
    }

    document.documentElement.lang = locale
  }, [locale])

  const value = React.useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale,
      t: (key, params) => tFor(locale, key, params),
    }),
    [locale, setLocale],
  )

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  )
}

export function useI18n() {
  const context = React.useContext(LocaleContext)

  if (!context) {
    throw new Error('useI18n must be used within LocaleProvider.')
  }

  return context
}

export function useDictionary() {
  const { locale } = useI18n()
  return getDictionary(locale)
}
