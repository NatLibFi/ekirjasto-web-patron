import OPDSParser, {
  OPDSFeed,
  OPDSEntry
} from "@natlibfi/ekirjasto-opds-feed-parser";
import ApplicationError, { ServerError } from "errors";
import { AnyBook, CollectionData, OPDS1 } from "interfaces";
import { entryToBook, feedToCollection } from "dataflow/opds1/parse";
import fetchWithHeaders from "dataflow/fetch";
import parseSearchData from "dataflow/opds1/parseSearchData";
import { normaliseLocale } from "../../../appLocales";
import { APP_CONFIG } from "utils/env";

const parser = new OPDSParser();
/**
 * Function that will fetch opds and parse it into either
 * a Feed or an Entry
 */
export async function fetchOPDS(
  url: string,
  token?: string,
  additionalHeaders?: { [key: string]: string }
): Promise<OPDSEntry | OPDSFeed> {
  const response = await fetchWithHeaders(url, token, additionalHeaders);
  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!response.ok) {
    const json = await response.json();
    throw new ServerError(url, response.status, json);
  }

  const text = await response.text();

  try {
    // parse the text into an opds feed or entry
    return await parser.parse(text);
  } catch (e) {
    throw new ApplicationError(
      {
        title: "OPDS Error",
        detail: "Could not parse fetch response into an OPDS Feed or Entry"
      },
      e
    );
  }
}

/**
 * A function specifically for fetching a feed
 */
export async function fetchFeed(
  url: string,
  token?: string,
  locale?: string
): Promise<OPDSFeed> {
  // define additional headers, including Accept-Language based on locale
  const additionalHeaders = getAdditionalHeaders(locale);

  const result = await fetchOPDS(url, token, additionalHeaders);

  if (result instanceof OPDSFeed) {
    return result;
  }

  throw new ApplicationError({
    title: "OPDS Error",
    detail: `Network response was expected to be an OPDS 1.x Feed, but was not parseable as such. Url: ${url}`
  });
}

/**
 * A function specifically for fetching an entry
 */
export async function fetchEntry(
  url: string,
  token?: string,
  locale?: string
): Promise<OPDSEntry> {
  // define additional headers, including Accept-Language based on locale
  const additionalHeaders = getAdditionalHeaders(locale);

  const result = await fetchOPDS(url, token, additionalHeaders);

  if (result instanceof OPDSEntry) {
    return result;
  }

  throw new ApplicationError({
    title: "OPDS Error",
    detail: `Network response was expected to be an OPDS 1.x Entry, but was not parseable as such. Url: ${url}`
  });
}

/**
 * A function to fetch a feed and convert it to a collection
 */
export async function fetchCollection(
  url: string,
  token?: string,
  locale?: string
): Promise<CollectionData> {
  const feed = await fetchFeed(url, token, locale);
  const collection = feedToCollection(feed, url);
  return collection;
}

/**
 * A function to fetch an entry and convert it to a book
 */
export async function fetchBook(
  url: string,
  catalogUrl: string,
  token?: string,
  locale?: string
): Promise<AnyBook> {
  const entry = await fetchEntry(url, token, locale);
  const book = entryToBook(entry, catalogUrl);
  return book;
}

/**
 * Fetch a bearer token to use to download a book
 */
export async function fetchBearerToken(
  url: string,
  token?: string
): Promise<OPDS1.BearerTokenDocument> {
  const response = await fetchWithHeaders(url, token);
  const json = await response.json();

  if (!response.ok) {
    throw new ServerError(url, response.status, json);
  }

  return json;
}

/**
 * Utilities
 */

export function stripUndefined(json: any) {
  return JSON.parse(JSON.stringify(json));
}

/**
 * Fetches the search description for the catalog root, used for the global
 * search bar
 */
export async function fetchSearchData(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    const details = await response.json();
    throw new ServerError(url, response.status, details);
  }

  const text = await response.text();
  const data = await parseSearchData(text, url);
  return data;
}

// function for defining the additional headers
// for OPDS requests such as fethcFeed and fetchEntry.
// Returns a header object
//   - Accept-Language header:
//     * is used to forward the user's preferred language
//     * server should return the content in this language
function getAdditionalHeaders(locale?: string) {
  // define a language string
  // if the locale given as parameter is valid, use that
  // otherwise just use the app default locale
  const language: string = normaliseLocale(locale);

  return {
    "Accept-Language": language
  };
}

/**
 * Function that checks the URL given as parameter.
 * Returns true if the url starts with
 * any of the allowed library OPDS base URLs
 * Note: for E-kirjasto prod this should normally be
 * "https://lib.e-kirjasto.fi/ekirjasto"
 */
export function isValidOPDSUrl(url: string): boolean {
  // first get allowed base URLs for OPDS fetches
  const allowedUrlBases = getAllowedOPDSUrlBases();

  // check if no (allowed) bases are found
  if (allowedUrlBases.length === 0) {
    // no allowed url bases found, just return false
    // note: this should not happen for E-kirjasto
    return false;
  }

  // check if the url starts with any of the allowed base URLs
  // is true if at least one base url matches
  const isValid = allowedUrlBases.some(urlBase => url.startsWith(urlBase));

  // return the result of the url validation
  return isValid;
}

/**
 * Function that returns all allowed base URLs for OPDS requests.
 * Allowed base urls are extracted from the library's authDocUrl.
 */
function getAllowedOPDSUrlBases(): string[] {
  // first get the list of libraries objects from app configuration
  const libraries = APP_CONFIG.libraries;

  if (!libraries) {
    // no libraries found
    // just return empty list
    return [];
  }

  // map through all libraries' authDocUrl
  // and remove the string end
  const urlBases = Object.values(libraries).map(library => {
    if (!library) {
      // no library, just skip
      return null;
    }

    if (typeof library.authDocUrl !== "string") {
      // wrong type, just skip
      return null;
    }

    // remove "/authentication_document" from the string end
    return library.authDocUrl.replace(/\/authentication_document$/, "");
  });

  // filter out all empty strings, non-strings and nulls (invalid base urls)
  const allowedUrlBases = urlBases.filter(
    (urlBase): urlBase is string => !!urlBase
  );

  // return the filtered list
  return allowedUrlBases;
}
