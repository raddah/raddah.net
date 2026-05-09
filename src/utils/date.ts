import type { Locale } from '@/i18n';
import { localeConfig } from '@/i18n';

/** Format a date in the user's locale */
export function formatDate(date: Date, locale: Locale): string {
  const config = localeConfig[locale];
  return new Intl.DateTimeFormat(config.dateLocale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/** Short ISO date (YYYY-MM-DD) for datetime attribute */
export function isoDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

/** Format a number in the user's locale (Arabic-Indic for Arabic) */
export function formatNumber(n: number, locale: Locale): string {
  return new Intl.NumberFormat(localeConfig[locale].dateLocale).format(n);
}
