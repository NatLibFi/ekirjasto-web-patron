import * as React from "react";
import { PathForContext } from "opds-web-client/lib/components/context/PathForContext";
import LibraryContext from "../components/context/LibraryContext";

/**
 * uses pathFor to construct the link to either
 * another collection or a book within the same
 * OPDS catalog. Hook version of CatalogLink in
 * opds-web-client.
 *
 * it uses the context provided catalog by default
 */
export function useGetCatalogLink(collectionUrlOverride?: string) {
  const pathFor = React.useContext(PathForContext);
  const library = React.useContext(LibraryContext);

  // use the context provided library by default
  let collectionUrl: string;
  if (collectionUrlOverride) {
    collectionUrl = collectionUrlOverride;
  } else {
    collectionUrl = library.catalogUrl;
  }

  function getCatalogLink(bookUrl: string) {
    return pathFor(collectionUrl, bookUrl);
  }

  return getCatalogLink;
}

/**
 * Similar to the above, but simply gets the collectionUrl for a
 * provided bookUrl.
 */
function useCatalogLink(bookUrl: string, collectionUrlOverride?: string) {
  const getCalalogLink = useGetCatalogLink(collectionUrlOverride);

  const location = getCalalogLink(bookUrl);

  return location;
}

export default useCatalogLink;
