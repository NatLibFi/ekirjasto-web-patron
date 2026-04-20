// applocales.ts

// This file contains i18n locale (language) definitions for the E-kirjasto app
// Import these consts and functions to files where you need app locales

// ******************************************************************
// APP LOCALES

// define specific AppLocale type for locales
export type AppLocale = typeof APP_LOCALES[number];

// define all the supported locales for app:
// - Finnish (fi)
// - Swedish (sv)
// - English (en)
// No regions are used in these language codes
export const APP_LOCALES = ["fi", "sv", "en"] as const;

// define the default language for the app,
// it should be Finnish if no other information
// of user's preferred language is available
export const APP_DEFAULT_LOCALE: AppLocale = "fi";

// define the fallback locale to be used
// if a key is missing in the current locale,
// we usually have at least the English translations available
export const APP_FALLBACK_LOCALE: AppLocale = "en";

// ******************************************************************
// TRANSLATION FILES:

// define the language that is the base for app translations
// this means that public/locales/en/translation.json
// is our primary source language
export const TRANSLATIONS_PRIMARY_LOCALE: AppLocale = "en";

// define other languages that the app is translated to
// these secondary locales are synced with the source locale,
// which means that FI and SV files follow the updates made to EN file
export const TRANSLATIONS_SECONDARY_LOCALES: AppLocale[] = ["fi", "sv"];

// ******************************************************************
// TESTS:

// define the default locale that the tests should use
// English is set as locale to test mock router
// so we can write tests using the English strings
// note: testing locale is defined as type of string
export const APP_DEFAULT_LOCALE_FOR_TESTING: string = "en";

// ******************************************************************
// HELPER FUNCTIONS:

// define type guard function
// that checks if the string given as parameter is of type AppLocale
export function isAppLocale(locale: string): locale is AppLocale {
  // get list of supported locales as string
  const supportedLocales = APP_LOCALES as readonly string[];

  // returns true only if the locale is a supported locale
  return supportedLocales.includes(locale);
}

// function that returns a valid app locale after checking it
// or the app default locale as fallback
// locale to check is given as a string parameter
export function normaliseLocale(rawLocale?: string): AppLocale {
  // check that we have a input
  if (!rawLocale) {
    // no input, just return default locale
    return APP_DEFAULT_LOCALE;
  }

  // try to format the locale
  const normalisedLocale = formatRawLocale(rawLocale);

  // check that locale is valid and supported in app
  if (!normalisedLocale || !isAppLocale(normalisedLocale)) {
    // no locale to check after normalising or
    // normalised locale is not valid app locale
    // just return default locale
    return APP_DEFAULT_LOCALE;
  }

  // return valid app locale
  return normalisedLocale;
}

// Helper function that returns raw locale string formatted
function formatRawLocale(rawLocale: string): string {
  // first trim the input and remove any
  // leading or trailign whitespaces
  const trimmedLocale = rawLocale.trim();

  // if for some reason region part is present,
  // try separate it from the language code,
  // for example format "en-US" to just "en"
  const baseLocale = trimmedLocale.split("-")[0];

  // change to lowercase just in case
  const formattedLocale = baseLocale.toLowerCase();

  // return after formatting
  return formattedLocale;
}
