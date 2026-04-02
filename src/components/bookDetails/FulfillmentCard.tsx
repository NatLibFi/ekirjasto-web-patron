/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "theme-ui";
import * as React from "react";
import {
  bookIsBorrowable,
  bookIsReservable,
  bookIsReserved,
  bookIsOnHold,
  bookIsFulfillable
} from "utils/book";
import withErrorBoundary from "../ErrorBoundary";
import Stack from "components/Stack";
import { Text } from "components/Text";
import BorrowOrReserve from "components/BorrowOrReserve";
import FulfillmentButton from "components/FulfillmentButton";
import {
  getFulfillmentsFromBook,
  shouldRedirectToCompanionApp
} from "utils/fulfill";
import BookStatus from "components/BookStatus";
import { AnyBook, FulfillableBook, FulfillmentLink } from "interfaces";
import CancelOrReturn from "components/CancelOrReturn";
import { useTranslation } from "next-i18next";

const FulfillmentCard: React.FC<{ book: AnyBook }> = ({ book }) => {
  const { t } = useTranslation();

  return (
    <div
      aria-label={t("bookDetails.ariaLabelForFulfillmentCard")}
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
    return <AccessCard links={book.fulfillmentLinks} book={book} />;
  }
  return <Text>{t("bookDetails.notSupported")}</Text>;
};

/**
 * Handles the case where it is ready for access either via openAccessLink or
 * via fulfillmentLink.
 */
const AccessCard: React.FC<{
  book: FulfillableBook;
  links: readonly FulfillmentLink[];
}> = ({ book, links }) => {
  const fulfillments = getFulfillmentsFromBook(book);

  const isFulfillable = fulfillments.length > 0;
  const redirectUser = shouldRedirectToCompanionApp(links);

  const { t } = useTranslation();

  return (
    <>
      <CancelOrReturn
        url={book.revokeUrl}
        loadingText={t("bookDetails.returning")}
        id={book.id}
        text={t("bookDetails.return")}
      />
      {isFulfillable && redirectUser && (
        <Text variant="text.body.italic">
          {t("bookDetails.readOnComputer")}
        </Text>
      )}
      {isFulfillable && (
        <Stack sx={{ flexWrap: "wrap" }}>
          {fulfillments.map(details => (
            <FulfillmentButton
              key={details.id}
              details={details}
              book={book}
              isPrimaryAction={!redirectUser}
            />
          ))}
        </Stack>
      )}
    </>
  );
};

export default withErrorBoundary(FulfillmentCard);
