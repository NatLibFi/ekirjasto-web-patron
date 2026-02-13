/** @jsxRuntime classic */
/** @jsx jsx */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { APP_CONFIG } from "utils/env";
import { fetchBook } from "dataflow/opds1/fetch";
import { getAuthors } from "utils/book";
import { H1, Text } from "components/Text";
import { jsx } from "theme-ui";
import { PageLoader } from "../LoadingIndicator";
import { truncateString } from "../../utils/string";
import { useRouter } from "next/router";
import * as React from "react";
import Accessibility from "./Accessibility";
import BookCover from "../BookCover";
import BreadcrumbBar from "../BreadcrumbBar";
import DetailField from "../BookMetaDetail";
import extractParam from "dataflow/utils";
import FulfillmentCard from "./FulfillmentCard";
import Head from "next/head";
import MediumIndicator from "components/MediumIndicator";
import Recommendations from "./Recommendations";
import ReportProblem from "./ReportProblem";
import Summary from "./Summary";
import useBreadcrumbContext from "components/context/BreadcrumbContext";
import useSWR from "swr";
import useUser from "components/context/UserContext";

export const BookDetails: React.FC = () => {
  const { query } = useRouter();
  const bookUrl = extractParam(query, "bookUrl");
  const { data, error } = useSWR(bookUrl ?? null, fetchBook);
  const { loans } = useUser();
  const { storedBreadcrumbs } = useBreadcrumbContext();
  // use the loans version if it exists
  const book = loans?.find(loanedBook => data?.id === loanedBook.id) ?? data;

  if (error) {
    // just throw the error and let it be handled by an error boundary
    throw error;
  }

  if (!book) return <PageLoader />;

  return (
    <section aria-label="Book details">
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
            aria-label="Book info"
          >
            <H1 sx={{ m: 0 }}>
              {book.title}
              {book.subtitle && `: ${book.subtitle}`}
            </H1>

            <Text variant="text.callouts.regular">
              by&nbsp;
              {getAuthors(book)?.join(", ") ?? "Unknown"}
            </Text>

            {APP_CONFIG.showMedium && <MediumIndicator book={book} />}

            <FulfillmentCard book={book} sx={{ mt: 3 }} />

            <Summary book={book} />

            <div sx={{ mt: 2 }}>
              <DetailField heading="Publisher" details={book.publisher} />
              <DetailField heading="Published" details={book.published} />
              <DetailField
                heading="Categories"
                details={book.categories?.join(", ")}
              />
              <DetailField
                heading="Audience"
                details={book.audience?.join(", ")}
              />
              <DetailField
                heading="Age range"
                details={book.ageRange?.join(", ")}
              />
              <DetailField heading="Book format" details={book.format} />
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
