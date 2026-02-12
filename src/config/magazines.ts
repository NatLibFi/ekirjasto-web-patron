/**
 * Centralized configuration for magazine-related URLs and settings
 */

// Base URLs for the magazine reader interface
const MAGAZINE_READER_URLS = {
  production: "https://lehdet.e-kirjasto.fi",
  playground: "https://lehdet-testing.e-kirjasto.fi"
} as const;

// API URLs for magazine catalog data
const MAGAZINE_API_URLS = {
  production: "https://lehdet.e-kirjasto.fi/feed/catalog",
  playground: "https://lehdet-testing.e-kirjasto.fi/feed/catalog"
} as const;

/**
 * Get the magazine reader base URL based on environment
 */
export function getMagazineReaderUrl(): string {
  return process.env.NODE_ENV === "production"
    ? MAGAZINE_READER_URLS.production
    : MAGAZINE_READER_URLS.playground;
}

/**
 * Get the magazine API URL based on environment
 */
export function getMagazineApiUrl(): string {
  return process.env.NODE_ENV === "production"
    ? MAGAZINE_API_URLS.production
    : MAGAZINE_API_URLS.playground;
}

/**
 * Get the allowed origin for magazine iframe communication
 */
export function getMagazineAllowedOrigin(): string {
  const baseUrl = getMagazineReaderUrl();
  return process.env.NEXT_PUBLIC_MAGAZINES_ORIGIN || new URL(baseUrl).origin;
}

/**
 * Configuration constants
 */
export const MAGAZINE_CONFIG = {
  // Storage key prefix for saving last visited paths
  STORAGE_KEY_PREFIX: "magazines:lastPath:",

  // Default iframe permissions
  IFRAME_ALLOW: "fullscreen; clipboard-read; clipboard-write",

  // Default iframe sandbox permissions
  IFRAME_SANDBOX:
    "allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
} as const;
