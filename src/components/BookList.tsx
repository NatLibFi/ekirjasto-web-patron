/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "theme-ui";
import * as React from "react";
import { truncateString, stripHTML } from "../utils/string";
import {
  bookIsBorrowable,
  bookIsFulfillable,
  bookIsReservable,
  bookIsReserved,
  bookIsOnHold,
  getAuthors
} from "../utils/book";
import Lane from "./Lane";
import Button, { NavButton } from "./Button";
import LoadingIndicator from "./LoadingIndicator";
import { H2, Text } from "./Text";
import BookCover from "./BookCover";
import BorrowOrReserve from "./BorrowOrReserve";
import { AnyBook, CollectionData, LaneData } from "interfaces";
import { fetchCollection } from "dataflow/opds1/fetch";
import useSWRInfinite from "swr/infinite";
import useUser from "components/context/UserContext";
import Stack from "components/Stack";
import CancelOrReturn from "components/CancelOrReturn";
import FulfillmentButton from "components/FulfillmentButton";
import {
  getFulfillmentFromLink,
  shouldRedirectToCompanionApp
} from "utils/fulfill";
import BookStatus from "components/BookStatus";
import Link from "./Link";
import { APP_CONFIG } from "utils/env";
import SelectBookCard from "./SelectBookCard";
import { useTranslation, TFunction } from "next-i18next";

const ListLoadingIndicator = () => {
  const { t } = useTranslation();

  return (
    <div
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: 2,
        fontWeight: "heading",
        p: 3
      }}
    >
      <LoadingIndicator />
      {t("bookList.loading")}
    </div>
  );
};

export const InfiniteBookList: React.FC<{ firstPageUrl: string }> = ({
  firstPageUrl
}) => {
  const { token } = useUser();
  const getKey = (pageIndex: number, previousData: CollectionData | null) => {
    // first page, no previous data
    if (pageIndex === 0) return [firstPageUrl, token];
    // reached the end
    if (!previousData?.nextPageUrl) return null;
    // otherwise return the next page url
    return [previousData.nextPageUrl, token];
  };
  const { data, size, error, setSize } = useSWRInfinite(
    getKey,
    fetchCollection
  );

  const { t } = useTranslation();
  const isFetchingInitialData = !data && !error;
  const lastItem = data && data[data.length - 1];
  const hasMore = !!lastItem?.nextPageUrl;
  const isFetchingMore = !!(!error && hasMore && size > (data?.length ?? 0));
  const isFetching = isFetchingInitialData || isFetchingMore;

  // extract the books from the array of collections in data
  const books =
    data?.reduce<AnyBook[]>(
      (total, current) => [...total, ...(current.books ?? [])],
      []
    ) ?? [];

  return (
    <>
      <BookList books={books} />
      {isFetching ? (
        <ListLoadingIndicator />
      ) : hasMore ? (
        <div sx={{ display: "flex", justifyContent: "center", p: 3 }}>
          <Button
            size="lg"
            color="brand.primary"
            onClick={() => setSize(size => size + 1)}
            sx={{ maxWidth: 300 }}
          >
            {t("bookList.viewMore")}
          </Button>
        </div>
      ) : null}
    </>
  );
};

export const BookList: React.FC<{
  books: AnyBook[];
}> = ({ books }) => {
  return (
    <ul sx={{ px: [3, 5] }} data-testid="listview-list">
      {books.map(book => (
        <BookListItem key={book.id} book={book} />
      ))}
    </ul>
  );
};

export const BookListItem: React.FC<{
  book: AnyBook;
}> = ({ book: collectionBook }) => {
  const { loans } = useUser();
  // if the book exists in loans, use that version
  const loanedBook = loans?.find(loan => loan.id === collectionBook.id);
  const book = loanedBook ?? collectionBook;
  const { t } = useTranslation();

  return (
    <li
      sx={{
        listStyle: "none",
        borderBottom: "1px solid",
        borderColor: "ui.gray.light",
        py: 3
      }}
      aria-label={`Book: ${book.title}`}
    >
      <Stack
        sx={{
          alignItems: "flex-start"
        }}
        spacing={3}
      >
        <Link
          bookUrl={book.url}
          aria-label={`View ${book.title}`}
          sx={{
            flex: ["0 0 100px", "0 0 100px", "0 0 148px"],
            height: [141, 141, 219]
          }}
        >
          <BookCover book={book} showMedium={APP_CONFIG.showMedium} />
        </Link>
        <Stack direction="column" sx={{ alignItems: "flex-start" }}>
          <div>
            <H2 sx={{ mb: 0, display: "inline" }}>
              <Link
                bookUrl={book.url}
                sx={{ variant: "text.link.bold", color: "brand.primary" }}
                aria-label={book.title}
              >
                {truncateString(book.title, 50)}
              </Link>
            </H2>
            {book.subtitle && (
              <Text variant="callout" aria-label="Subtitle">
                , {truncateString(book.subtitle, 50)}
              </Text>
            )}
            <Text aria-label="Authors" sx={{ display: "block" }}>
              {limitedAuthorsList(book, t)}
            </Text>
          </div>

          <BookStatus book={book} />
          <BookListCTA book={book} />
          <SelectBookCard book={book} />
          <Description
            book={book}
            sx={{ display: ["none", "none", "block"] }}
          />
        </Stack>
      </Stack>
      <Description
        book={book}
        sx={{ display: ["block", "block", "none"], mt: 2 }}
      />
    </li>
  );
};

const Description: React.FC<{ book: AnyBook; className?: string }> = ({
  book,
  className
}) => {
  const { t } = useTranslation();

  return (
    <div className={className}>
      <Text variant="text.body">
        {truncateString(stripHTML(book.summary ?? ""), 280)}
      </Text>
      <NavButton
        bookUrl={book.url}
        variant="link"
        sx={{ verticalAlign: "baseline", ml: 1 }}
      >
        {t("bookList.readMore")}
      </NavButton>
    </div>
  );
};

const BookListCTA: React.FC<{ book: AnyBook }> = ({ book }) => {
  const { t } = useTranslation();

  if (bookIsBorrowable(book)) {
    return <BorrowOrReserve url={book.borrowUrl} isBorrow />;
  }

  if (bookIsReservable(book)) {
    return <BorrowOrReserve url={book.reserveUrl} isBorrow={false} />;
  }

  if (bookIsOnHold(book)) {
    return <BorrowOrReserve url={book.borrowUrl} isBorrow />;
  }

  if (bookIsReserved(book)) {
    return (
      <CancelOrReturn
        url={book.revokeUrl}
        id={book.id}
        text={t("bookList.cancelReservation")}
        loadingText={t("bookList.cancelling")}
      />
    );
  }

  if (bookIsFulfillable(book)) {
    // we will show a fulfillment button if there is only one option
    // and we are not supposed to redirect the user to the companion app
    const showableLinks = book.fulfillmentLinks.filter(
      link => link.supportLevel === "show"
    );
    const shouldRedirectUser = shouldRedirectToCompanionApp(
      book.fulfillmentLinks
    );

    const showableFulfillments = showableLinks.map(getFulfillmentFromLink);
    const singleFulfillment =
      showableFulfillments.length === 1 ? showableFulfillments[0] : undefined;

    return (
      <>
        <CancelOrReturn
          url={book.revokeUrl}
          loadingText={t("bookList.returning")}
          id={book.id}
          text={t("bookList.return")}
        />
        {singleFulfillment && !shouldRedirectUser ? (
          <FulfillmentButton
            details={singleFulfillment}
            book={book}
            isPrimaryAction
          />
        ) : null}
      </>
    );
  }

  return null;
};

export const LanesView: React.FC<{ lanes: LaneData[] }> = ({ lanes }) => {
  return (
    <ul sx={{ m: 0, p: 0 }}>
      {lanes.map(lane => (
        <Lane key={lane.url} lane={lane} />
      ))}
    </ul>
  );
};

function limitedAuthorsList(book: AnyBook, t: TFunction): string {
  const { authors } = book;

  // return a placeholder if authors are not defined
  if (!authors) return t("bookList.unknownAuthor");

  // get the names of the first two authors
  const limitedAuthorsList = getAuthors(book, 2);

  // count how many additional authors there are after the first two
  const additionalAuthorCount = authors.length - 2;

  // if there are more than two authors, concatenate string telling how many more
  if (additionalAuthorCount > 0) {
    limitedAuthorsList.push(
      t("bookList.moreAuthors", { additionalAuthorCount })
    );
  }

  // return the authors' names as a comma-separated string
  return limitedAuthorsList.join(", ");
}
