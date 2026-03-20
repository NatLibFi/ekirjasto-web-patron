/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "theme-ui";
import * as React from "react";
import { MediumIcon } from "components/MediumIndicator";
import { AnyBook } from "interfaces";
import { bookIsFulfillable, getAvailabilityString } from "utils/book";
import { Text } from "components/Text";
import { shouldRedirectToCompanionApp } from "utils/fulfill";
import SvgPhone from "icons/Phone";
import { APP_CONFIG } from "utils/env";
import { useTranslation } from "next-i18next";

const BookStatus: React.FC<{ book: AnyBook }> = ({ book }) => {
  const { status } = book;
  const { t } = useTranslation();

  const redirectUser = bookIsFulfillable(book)
    ? shouldRedirectToCompanionApp(book.fulfillmentLinks)
    : false;

  const companionAppPart = redirectUser
    ? ` ${
        APP_CONFIG.companionApp === "E-kirjasto" ? t("bookStatus.inTheApp") : ""
      }`
    : "";

  const str =
    status === "borrowable"
      ? t("bookStatus.availableToBorrow")
      : status === "reservable"
      ? t("bookStatus.unavailable")
      : status === "reserved"
      ? t("bookStatus.reserved")
      : status === "on-hold"
      ? t("bookStatus.readyToBorrow")
      : status === "fulfillable"
      ? t("bookStatus.readyToRead", { companionAppPart })
      : t("bookStatus.unsupported");

  return (
    <div>
      <div sx={{ display: "flex", alignItems: "center" }}>
        {redirectUser ? (
          <SvgPhone sx={{ fontSize: 24 }} />
        ) : (
          <MediumIcon book={book} sx={{ mr: 1 }} />
        )}
        <Text variant="text.body.bold" sx={{ fontWeight: 600 }}>
          {str}
        </Text>
      </div>
      <Availability book={book} />
    </div>
  );
};

const Availability: React.FC<{ book: AnyBook }> = ({ book }) => {
  const { t } = useTranslation();
  const availabilityString = getAvailabilityString(book, t);

  return (
    <Text
      variant="text.body.italic"
      sx={{ fontSize: "-1", color: "ui.gray.dark", my: 1 }}
    >
      {availabilityString}
    </Text>
  );
};

export default BookStatus;
