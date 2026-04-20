/** @jsxRuntime classic */
/** @jsx jsx */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { APP_CONFIG } from "utils/env";
import { fetchBook } from "dataflow/opds1/fetch";
import { getAuthors, getSubtitle } from "utils/book";
import { H1, Text } from "components/Text";
import { jsx } from "theme-ui";
import { PageLoader } from "../LoadingIndicator";
import { truncateString } from "../../utils/string";
import { useRouter } from "next/router";
import * as React from "react";
import Accessibility from "./Accessibility";
import BookCover from "../BookCover";
import BookPassphrase from "./BookPassphrase";
import BreadcrumbBar from "../BreadcrumbBar";
import DetailField from "../BookMetaDetail";
import extractParam from "dataflow/utils";
import FulfillmentCard from "./FulfillmentCard";
import Head from "next/head";
import MediumIndicator from "components/MediumIndicator";
import Recommendations from "./Recommendations";
import ReportProblem from "./ReportProblem";
import SelectBookCard from "../SelectBookCard";
import Summary from "./Summary";
import useBreadcrumbContext from "components/context/BreadcrumbContext";
import useSWR from "swr";
import useUser from "components/context/UserContext";
import { useTranslation } from "next-i18next";
import useLibraryContext from "components/context/LibraryContext";

export const BookDetails: React.FC = () => {
  const { locale, query } = useRouter();
  const { catalogUrl } = useLibraryContext();
  const bookUrl = extractParam(query, "bookUrl");

  // define cache key (unique) for SWR based on
  // bookUrl, locale and catalogUrl.
  // note: if bookUrl or locale (or catalogUrl) is missing,
  // we don't fetch anything
  const key =
    bookUrl && locale && catalogUrl
      ? ([bookUrl, catalogUrl, locale] as const)
      : null;

  // define the fetcher function for SWR.
  // Token is undefined here because authentication
  // is not required the fetch normal book data from backend
  const fetcher = (
    urlForBook: string,
    urlForCatalog: string,
    appLocale: string
  ): Promise<AnyBook> =>
    fetchBook(urlForBook, urlForCatalog, undefined, appLocale);

  // SWR calls fetchBook when it needs new data
  // data is the fetched book and error is any happened error during fetching
  const { data, error } = useSWR(key, fetcher);

  // get user's loaned and reserved books (MyBooks)
  const { loans } = useUser();
  // always use the MyBooks version of the book, if it is available
  // otherwise, just use the fetched data as the book
  const book: AnyBook =
    loans?.find(loanedBook => data?.id === loanedBook.id) ?? data;

  const subtitle = getSubtitle(book);
  const { t } = useTranslation();

  // get current breadcrumbs and update function from context
  const { storedBreadcrumbs, setStoredBreadcrumbs } = useBreadcrumbContext();

  // effect that clears the breadcrumbs whenever book details page is opened.
  // If the user changes locale in book detail page, the stored breadcrumbs
  // become outdated. We cannot easily update the breadcrumbs in book detail page,
  // because they are computed in collection pages on locale change,
  // so we just clear the breadcrumbs so that wrong language is not used.
  // Note: this should be only temporary fix for now
  React.useEffect(() => {
    setStoredBreadcrumbs([]);
  }, [setStoredBreadcrumbs]);

  if (error) {
    // just throw the error and let it be handled by an error boundary
    throw error;
  }

  if (!book) return <PageLoader />;

  return (
    <section aria-label={t("bookDetails.ariaLabelForBookDetails")}>
      <Head>
        <title>{book.title}</title>
      </Head>

      <BreadcrumbBar
        breadcrumbs={storedBreadcrumbs}
        currentLocation={truncateString(book.title, 60, false)}
      />

      <div sx={{ maxWidth: 1100, mx: "auto" }}>
        <div
          sx={{
            display: "flex",
            mx: [3, 5],
            my: 4,
            flexWrap: ["wrap", "nowrap"]
          }}
        >
          <div
            sx={{
              flex: ["1 1 auto", 0.33],
              mr: [0, 4],
              mb: [3, 0]
            }}
          >
            <BookCover book={book} sx={{ maxWidth: [180, "initial"] }} />
          </div>

          <div
            sx={{
              flex: ["1 1 auto", 0.66],
              display: "flex",
              flexDirection: "column"
            }}
            aria-label={t("bookDetails.ariaLabelForBookInfo")}
          >
            <H1 sx={{ m: 0 }}>
              {book.title}
              {subtitle && `: ${subtitle}`}
            </H1>

            <Text variant="text.callouts.regular">
              {getAuthors(book)?.join(", ") ?? t("bookDetails.unknownAuthor")}
            </Text>

            {APP_CONFIG.showMedium && <MediumIndicator book={book} />}

            <FulfillmentCard book={book} sx={{ mt: 3 }} />

            <SelectBookCard book={book} />

            <BookPassphrase book={book} />

            <Summary book={book} sx={{ mt: 3 }} />

            <div sx={{ mt: 2 }}>
              <DetailField
                heading={t("bookDetails.headingForPublisher")}
                details={book.publisher}
              />
              <DetailField
                heading={t("bookDetails.headingForPublished")}
                details={book.published}
              />
              <DetailField
                heading={t("bookDetails.headingForCategories")}
                details={book.categories?.join(", ")}
              />
              <DetailField
                heading={t("bookDetails.headingForAudience")}
                details={book.audience?.join(", ")}
              />
              <DetailField
                heading={t("bookDetails.headingForAgeRange")}
                details={book.ageRange?.join(", ")}
              />
              <DetailField
                heading={t("bookDetails.headingForBookFormat")}
                details={book.format}
              />
              <Accessibility book={book} sx={{ mt: 3 }} />
            </div>

            <ReportProblem book={book} />
          </div>
        </div>
      </div>

      <Recommendations book={book} />
    </section>
  );
};

export default BookDetails;
