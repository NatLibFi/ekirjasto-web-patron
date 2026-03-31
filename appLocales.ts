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
