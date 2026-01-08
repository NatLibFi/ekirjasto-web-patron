// nextjs/i18n.js

import { tx, normalizeLocale } from '@transifex/native';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

const TRANSLATIONS_TTL_SEC = 60 * 60 * 24; // 24H

/**
 * Used by SSR to pass translation to browser
 *
 * @param {*} { locale, locales }
 * @return {*} { locale, locales, translations }
 */
export async function getServerSideTranslations({ locale, locales }) {
  tx.init({
    token: publicRuntimeConfig.TxNativePublicToken,
  });
  
  // ensure that nextjs locale is in the Transifex format,
  // for example, de-de -> de_DE
  const txLocale = normalizeLocale(locale);

  // load translations over-the-air
  await tx.fetchTranslations(txLocale);

    // bind a helper object in the Native instance for auto-refresh
    tx._autorefresh = tx._autorefresh || {};
    if (!tx._autorefresh[txLocale]) {
      tx._autorefresh[txLocale] = Date.now();
    }
  
    // check for stale content in the background
    if (Date.now() - tx._autorefresh[txLocale] > TRANSLATIONS_TTL_SEC * 1000) {
      tx._autorefresh[txLocale] = Date.now();
      tx.fetchTranslations(txLocale, { refresh: true });
    }

  return {
    locale,
    locales,
    translations: tx.cache.getTranslations(txLocale),
  };
}

/**
 * Initialize client side Transifex Native instance cache
 *
 * @param {*} { locale, translations }
 */
export function setClientSideTranslations({ locale, translations }) {
  if (!locale || !translations) return;
  tx.init({
    currentLocale: locale,
  });
  tx.cache.update(locale, translations);
}