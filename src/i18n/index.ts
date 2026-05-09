/**
 * Locale configuration for raddah.net
 * Defines supported languages, their direction, names, and metadata.
 */

export const locales = ['ar', 'en', 'zh'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'ar';

export interface LocaleMeta {
  code: Locale;
  name: string;
  nativeName: string;
  shortLabel: string;
  dir: 'rtl' | 'ltr';
  hrefLang: string;
  dateLocale: string;
  ogLocale: string;
}

export const localeConfig: Record<Locale, LocaleMeta> = {
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    shortLabel: 'ع',
    dir: 'rtl',
    hrefLang: 'ar',
    dateLocale: 'ar-SA',
    ogLocale: 'ar_SA',
  },
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    shortLabel: 'EN',
    dir: 'ltr',
    hrefLang: 'en',
    dateLocale: 'en-US',
    ogLocale: 'en_US',
  },
  zh: {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    shortLabel: '中',
    dir: 'ltr',
    hrefLang: 'zh-Hans',
    dateLocale: 'zh-CN',
    ogLocale: 'zh_CN',
  },
};

/** Type guard for runtime locale validation */
export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
}

/** Get locale from URL pathname, falling back to defaultLocale */
export function getLocaleFromUrl(url: URL): Locale {
  const segment = url.pathname.split('/').filter(Boolean)[0];
  return isLocale(segment) ? segment : defaultLocale;
}

/** Get HTML dir attribute for a locale */
export function getDir(locale: Locale): 'rtl' | 'ltr' {
  return localeConfig[locale].dir;
}
