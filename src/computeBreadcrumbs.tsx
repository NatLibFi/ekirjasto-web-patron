import { CollectionData, LinkData } from "interfaces";
import { AppLocale, normaliseLocale } from "../appLocales";

// Custom URL comparator to ignore trailing slashes.
const urlComparator = (
  url1: string | undefined,
  url2: string | undefined
): boolean => {
  if (url1?.endsWith("/")) {
    url1 = url1.slice(0, -1);
  }
  if (url2?.endsWith("/")) {
    url2 = url2.slice(0, -1);
  }
  return !!(url1 && url2) && url1 === url2;
};

const computeBreadcrumbs = (
  collection?: CollectionData,
  locale?: string
): LinkData[] => {
  let links: LinkData[] = [];

  if (
    collection &&
    collection.raw &&
    collection.raw["simplified:breadcrumbs"] &&
    collection.raw["simplified:breadcrumbs"][0] &&
    collection.raw["simplified:breadcrumbs"][0].link
  ) {
    const rawLinks = collection.raw["simplified:breadcrumbs"][0].link;
    links = rawLinks.map((link: any) => {
      return {
        url: link["$"].href.value,
        text: link["$"].title.value
      };
    });
    links.push({
      url: collection.url,
      text: collection.title
    });
  } else {
    links = hierarchyComputeBreadcrumbs(collection, urlComparator);
  }

  const appLocale = normaliseLocale(locale);
  return localiseLinkTexts(links, appLocale);
};

export default computeBreadcrumbs;

/**
 * Computes breadcrumbs assuming that the OPDS feed is hierarchical - uses
 * the catalog root link, the parent of the current collection if it's not
 * the root, and the current collection. The OPDS spec doesn't require a
 * hierarchy, so this may not make sense for some feeds.
 * */
export function hierarchyComputeBreadcrumbs(
  collection?: CollectionData,
  comparator?: (url1: string, url2: string) => boolean
): LinkData[] {
  const links: LinkData[] = [];

  if (!collection) {
    return [];
  }

  if (!comparator) {
    comparator = (url1, url2) => url1 === url2;
  }

  const { catalogRootLink, parentLink } = collection;

  if (catalogRootLink && !comparator(catalogRootLink.url, collection.url)) {
    links.push({
      text: catalogRootLink.text || "Catalog",
      url: catalogRootLink.url
    });
  }

  if (
    parentLink &&
    parentLink.url &&
    parentLink.text &&
    (!catalogRootLink || !comparator(parentLink.url, catalogRootLink.url)) &&
    !comparator(parentLink.url, collection.url)
  ) {
    links.push({
      text: parentLink.text,
      url: parentLink.url
    });
  }

  links.push({
    url: collection.url,
    text: collection.title
  });

  return links;
}

// define localisation map for FI, SV and EN locales
// The keys are collection entrypoints.
// this map should be used until the breadcrumbs computing is refactored
const localisationMap: { [key: string]: { [key: string]: string } } = {
  fi: {
    All: "E-kirjat ja äänikirjat",
    Book: "E-kirjat",
    Audio: "Äänikirjat"
  },
  sv: {
    All: "E-böcker och ljudböcker",
    Book: "E-böcker",
    Audio: "Ljudböcker"
  },
  en: {
    All: "E-books and Audiobooks",
    Book: "E-books",
    Audio: "Audiobooks"
  }
};

// helper function to localise link texts for current locale.
// Changes the English entrypoint parameters from backend
// to more descriptive English and gives translations
// for Finnish and Swedish
function localiseLinkTexts(
  links: LinkData[],
  appLocale: AppLocale | undefined
): LinkData[] {
  // just to be safe!
  if (!appLocale) return links;

  // create a new list for the localised links
  return links.map(link => {
    // first check if the link has text property
    if (link.text) {
      // then try to get the localised text from the map
      const localisedText = localisationMap[appLocale][link.text];

      // if there is a match and the localised text exists
      // return that version of text with this link
      if (localisedText) {
        return { ...link, text: localisedText };
      }
    }

    // if no link text or matching localisation is found
    // just return the original link without modifications
    return link;
  });
}
