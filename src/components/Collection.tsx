/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "theme-ui";
import * as React from "react";
import { PageLoader } from "../components/LoadingIndicator";
import { InfiniteBookList, LanesView } from "./BookList";
import Head from "next/head";
import PageTitle from "./PageTitle";
import { Text } from "./Text";
import BreadcrumbBar from "./BreadcrumbBar";
import computeBreadcrumbs from "computeBreadcrumbs";
import useCollection from "hooks/useCollection";
import ApplicationError from "errors";
import ErrorComponent from "components/Error";
import useBreadcrumbContext from "../components/context/BreadcrumbContext";
import { useTranslation } from "next-i18next";

export const Collection: React.FC<{
  title?: string;
}> = ({ title }) => {
  const { collection, collectionUrl, isValidating, error } = useCollection();
  const { t } = useTranslation();

  const isLoading = !collection && isValidating;

  const hasLanes = collection?.lanes && collection.lanes.length > 0;
  const hasBooks = collection?.books && collection.books.length > 0;
  const pageTitle = isLoading ? "" : title ?? collection?.title ?? "Collection";

  // get the breadcrumbs context
  const { storedBreadcrumbs, setStoredBreadcrumbs } = useBreadcrumbContext();

  // build the breadcrumbs for the current collection.
  // note: collection is always fetched with the current locale,
  // so when the user changes language, this function should
  // be also run automatically and the builder should
  // compute new breadcrumbs using the new locale
  const collectionBreadcrumbs = React.useMemo(
    () => computeBreadcrumbs(collection),
    [collection]
  );

  // effect that updates the breadcrumbs stored in context
  // whenever collectionBreadcrumbs changes
  React.useEffect(() => {
    setStoredBreadcrumbs(collectionBreadcrumbs);
  }, [collectionBreadcrumbs, setStoredBreadcrumbs]);

  if (error) return <ErrorComponent info={error?.info} />;

  if (!collectionUrl)
    throw new ApplicationError({
      detail: "Cannot render collection on page without collectionUrl"
    });

  return (
    <div
      sx={{
        flex: "1 1 auto",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <BreadcrumbBar breadcrumbs={storedBreadcrumbs} />
      <PageTitle collection={collection}>{pageTitle}</PageTitle>
      {isLoading ? (
        <PageLoader />
      ) : hasLanes ? (
        <LanesView lanes={collection?.lanes ?? []} />
      ) : hasBooks ? (
        <InfiniteBookList firstPageUrl={collectionUrl} />
      ) : (
        <div
          sx={{
            display: "flex",
            flex: "1 1 auto",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Text variant="text.callouts">{t("collection.empty")}</Text>
        </div>
      )}
    </div>
  );
};

export default Collection;
