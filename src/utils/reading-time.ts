import type { Locale } from '@/i18n';

/**
 * Estimate reading time in minutes.
 * Reading speeds vary per script: Arabic ~180wpm, English ~225wpm, Chinese ~350cpm.
 */
export function readingTime(content: string, locale: Locale): number {
  const text = content.replace(/<[^>]*>/g, '').trim();

  if (locale === 'zh') {
    // Chinese: count characters
    const chars = text.replace(/\s+/g, '').length;
    return Math.max(1, Math.round(chars / 350));
  }

  // Arabic & English: count words
  const words = text.split(/\s+/).length;
  const wpm = locale === 'ar' ? 180 : 225;
  return Math.max(1, Math.round(words / wpm));
}
