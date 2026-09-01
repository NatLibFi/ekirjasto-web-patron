/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "theme-ui";
import * as React from "react";
import {
  bookIsBorrowable,
  bookIsReservable,
  bookIsReserved,
  bookIsOnHold,
  bookIsFulfillable,
  bookIsUnavailable
} from "utils/book";
import {
  DownloadFulfillment,
  getFulfillmentFromLink,
  ReadExternalFulfillment
} from "utils/fulfill";

import withErrorBoundary from "./ErrorBoundary";
import Stack from "components/Stack";
import { Text } from "components/Text";
import BorrowOrReserve from "components/BorrowOrReserve";
import FulfillmentButton from "components/FulfillmentButton";
import BookStatus from "components/BookStatus";
import { AnyBook } from "interfaces";
import CancelOrReturn from "components/CancelOrReturn";
import { useTranslation } from "next-i18next";
import SelectBookCard from "./SelectBookCard";

const FulfillmentCard: React.FC<{ book: AnyBook }> = ({ book }) => {
  const { t } = useTranslation();

  return (
    <div
      aria-label={t("fulfill.ariaLabelForFulfillmentCard")}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        color: "ui.gray.extraDark"
      }}
    >
      <Stack direction="column" sx={{ my: 3, alignItems: "flex-start" }}>
        <BookStatus book={book} />
        <FulfillmentContent book={book} />
        <SelectBookCard book={book} />
      </Stack>
    </div>
  );
};

const FulfillmentContent: React.FC<{
  book: AnyBook;
}> = ({ book }) => {
  const { t } = useTranslation();

  if (bookIsBorrowable(book)) {
    return <BorrowOrReserve url={book.borrowUrl} isBorrow />;
  }
  if (bookIsReservable(book)) {
    return <BorrowOrReserve url={book.reserveUrl} isBorrow={false} />;
  }
  if (bookIsReserved(book)) {
    return (
      <CancelOrReturn
        url={book.revokeUrl}
        text={t("bookDetails.cancelReservation")}
        loadingText={t("bookDetails.cancelling")}
        id={book.id}
      />
    );
  }
  if (bookIsOnHold(book)) {
    return <BorrowOrReserve url={book.borrowUrl} isBorrow />;
  }
  if (bookIsFulfillable(book)) {
    return <AccessCard book={book} />;
  }
  if (bookIsUnavailable(book)) {
    // If the book is unavailable, we don't show anything.
    return null;
  }
  return <Text>{t("bookDetails.notSupported")}</Text>;
};

// Render the main action buttons for book list, for example
// Borrow, Reserve, Download, Read online, Cancel and Return
//
// Note: adding or removing book from Favorites is a secondary action
// and handled separately via SelectBookCard component
const AccessCard: React.FC<{ book: AnyBook }> = ({ book }) => {
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
    // E-library has currently two possible fulfillment
    // options for a book: download and read online.
    // We show buttons for these options in the book list
    // if they are available for the book,
    // as well as the cancel reservation/return book button.

    // first filter the links that should be shown
    // and then extract Fulfillments from them
    const showableFulfillments = book.fulfillmentLinks
      .filter(link => link.supportLevel === "show")
      .map(getFulfillmentFromLink);

    // find the first fulfillment that is a DownloadFulfillment
    // that has a type property 'download'
    const downloadFulfillment = showableFulfillments.find(
      (fulfillment): fulfillment is DownloadFulfillment =>
        fulfillment.type === "download"
    );

    // find the first fulfillment that is a ReadExternalFulfillment
    // and has a type property 'read-online-external'
    const readOnlineFulfillment = showableFulfillments.find(
      (fulfillment): fulfillment is ReadExternalFulfillment =>
        fulfillment.type === "read-online-external"
    );

    return (
      <>
        <CancelOrReturn
          url={book.revokeUrl}
          loadingText={t("fulfill.returning")}
          id={book.id}
          text={t("fulfill.return")}
        />

        <Stack
          sx={{
            display: "flex",
            flexDirection: ["column", "row"],
            alignItems: "flex-start",
            "row-gap": "8px"
          }}
        >
          {/* Render "Download" button if available */}
          {downloadFulfillment && (
            <FulfillmentButton
              details={downloadFulfillment}
              book={book}
              isPrimaryAction
            />
          )}

          {/* Render "Read online" button if available */}
          {readOnlineFulfillment && (
            <FulfillmentButton
              details={readOnlineFulfillment}
              book={book}
              isPrimaryAction
            />
          )}
        </Stack>
      </>
    );
  }

  // this book is not
  // borrowable, reservable, on hold, reserved or fulfillable,
  // so just return null instead of main action buttons
  return null;
};

export default withErrorBoundary(FulfillmentCard);
