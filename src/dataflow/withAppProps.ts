import { LibraryData, OPDS1 } from "../interfaces";
import { GetStaticProps, GetStaticPropsContext } from "next";
import {
  getCatalogRootUrl,
  fetchAuthDocument,
  buildLibraryData
} from "dataflow/getLibraryData";
import ApplicationError, { PageNotFoundError } from "errors";
import { getAuthDocHref } from "utils/auth";
import { findSearchLink } from "dataflow/opds1/parse";
import { fetchFeed, fetchSearchData } from "dataflow/opds1/fetch";
import extractParam from "dataflow/utils";
import { ParsedUrlQuery } from "querystring";
import track from "analytics/track";

export type AppProps = {
  library?: LibraryData;
  error?: OPDS1.ProblemDocument;
};

export default function withAppProps(
  defaultLibSlug?: string,
  pageGetServerSideProps?: GetStaticProps
): GetStaticProps<AppProps> {
  return async (ctx: GetStaticPropsContext<ParsedUrlQuery>) => {
    /**
     * Determine the catalog url
     * Get library catalog
     * Fetch the auth document provided in it
     */
    try {
      const librarySlug = defaultLibSlug
        ? defaultLibSlug
        : extractParam(ctx.params, "library");

      if (!librarySlug)
        throw new PageNotFoundError(
          "A library slug is required to be provided in the URL. Eg: https://domain.com/:library"
        );

      const catalogUrl = await getCatalogRootUrl(librarySlug);
      const catalog = await fetchFeed(catalogUrl);
      const authDocHref = getAuthDocHref(catalog);
      const authDocument = await fetchAuthDocument(authDocHref);
      const searchDataUrl = findSearchLink(catalog)?.href;
      const searchData = await fetchSearchData(searchDataUrl);
      const library = buildLibraryData(
        authDocument,
        catalogUrl,
        librarySlug,
        catalog,
        searchData
      );
      // fetch the static props for the page
      const pageResult = (await pageGetServerSideProps?.(ctx)) ?? { props: {} };
      return {
        ...pageResult,
        props: {
          ...pageResult.props,
          library
        },
        // revalidate library-wide data once per hour per route
        revalidate: 60 * 60
      };
    } catch (e) {
      // show the error page if there was an ApplicationError
      if (e instanceof ApplicationError) {
        track.error(e, { severity: "error" });
        return {
          props: {
            error: e.info
          },
          // library data will be revalidated often for error pages.
          revalidate: 1
        };
      }
      // otherwise we probably can't recover at all,
      // so rethrow.
      throw e;
    }
  };
}
