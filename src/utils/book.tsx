import * as React from "react";
import {
  AnyBook,
  BookMedium,
  BorrowableBook,
  FulfillableBook,
  OnHoldBook,
  ReservableBook,
  ReservedBook,
  UnsupportedBook
} from "interfaces";
import { Book, Headset } from "../icons";
import { TFunction } from "next-i18next";

// Select authors or contributors based on availability
export function getAuthors(book: AnyBook, lim?: number): string[] {
  let authorsList: string[];

  if (book.authors && book.authors.length > 0) {
    // use authors if available
    authorsList = book.authors;
  } else if (book.contributors && book.contributors.length > 0) {
    // use contributors if authors are not available
    authorsList = book.contributors;
  } else {
    // no authors nor contributors are available
    authorsList = [];
  }

  // Limit the number of authors returned if 'lim' is specified
  return lim ? authorsList.slice(0, lim) : authorsList;
}

export function getAvailabilityString(
  book: AnyBook,
  t: TFunction
): string | null {
  const status = book.status;
  const availableCopies = book.copies?.available;
  const totalCopies = book.copies?.total;
  const queue = typeof book.holds?.total === "number" ? book.holds.total : null;
  const until = book.availability?.until;

  switch (status) {
    case "borrowable":
      if (
        typeof availableCopies !== "number" ||
        typeof totalCopies !== "number"
      ) {
        return null;
      }

      const borrowableString = t("book.borrowable", {
        availableCopies,
        totalCopies
      });

      return borrowableString;

    case "reservable":
      if (
        typeof availableCopies !== "number" ||
        typeof totalCopies !== "number"
      )
        return null;

      let reservableString = t("book.reservable", {
        availableCopies,
        totalCopies
      });

      if (queue !== null) {
        reservableString += t("book.patronsInQueue", { queue });
      }

      return reservableString;

    case "reserved":
      const position = book.holds?.position;

      if (!position || isNaN(position)) return null;

      const queueReserved =
        typeof book.holds?.total === "number" ? book.holds.total : null;

      const reservedString = t("book.reserved", {
        position,
        queueReserved,
        availableCopies,
        totalCopies
      });

      return reservedString;

    case "on-hold":
      const untilStr = until ? new Date(until).toDateString() : undefined;
      let onHoldString = t("book.onHold");

      if (untilStr) {
        onHoldString += t("book.until", { untilStr });
      }

      return onHoldString;

    case "fulfillable":
      const availableFor = until ? getLoanExpiryString(until, t) : undefined;

      if (availableFor === undefined) return null;

      const fulfillableString = t("book.fulfillable", { availableFor });
      return fulfillableString;

    case "unsupported":
      return null;
  }
}

function getLoanExpiryString(expiryDateString: string, t: TFunction): string {
  // Parse the expiry date and current date in millis
  const expiryDateInMillis = new Date(expiryDateString).getTime();
  const currentDateInMillis = new Date().getTime();

  // Calculate the difference
  const differenceInMillis = expiryDateInMillis - currentDateInMillis;

  // Convert to days
  const differenceInDays = Math.floor(
    differenceInMillis / (1000 * 60 * 60 * 24)
  );

  // If there is less than a day of time, show it in hours
  if (differenceInDays < 1) {
    const differenceInHours = Math.floor(differenceInMillis / (1000 * 60 * 60));

    // if there is less than an hour of loan time, show it
    if (differenceInHours < 1) {
      return t("book.lessThenHour");
    }

    // Return number of hours left
    return t("book.differenceInHours", { differenceInHours });
  }
  // Return number of days left
  return t("book.differenceInDays", { differenceInDays });
}

export function queueString(book: AnyBook) {
  const holds = book.holds?.total;
  return typeof holds === "number"
    ? `There are ${holds} other patrons in the queue.`
    : "";
}

export function bookIsFulfillable(book: AnyBook): book is FulfillableBook {
  return book.status === "fulfillable";
}

export function bookIsUnsupported(book: AnyBook): book is UnsupportedBook {
  return book.status === "unsupported";
}

export function bookIsReserved(book: AnyBook): book is ReservedBook {
  return book.status === "reserved";
}

export function bookIsReservable(book: AnyBook): book is ReservableBook {
  return book.status === "reservable";
}

export function bookIsOnHold(book: AnyBook): book is OnHoldBook {
  return book.status === "on-hold";
}

export function bookIsBorrowable(book: AnyBook): book is BorrowableBook {
  return book.status === "borrowable";
}

export function bookIsAudiobook(book: AnyBook): boolean {
  if (getMedium(book) === "http://bib.schema.org/Audiobook") {
    return true;
  }
  return false;
}

export const bookMediumMap: {
  [key in BookMedium]: {
    name: string;
    icon: React.ComponentType<{ className?: string }>;
  };
} = {
  "http://bib.schema.org/Audiobook": {
    name: "Audiobook",
    icon: Headset
  },
  "http://schema.org/EBook": { name: "eBook", icon: Book },
  "http://schema.org/Book": { name: "Book", icon: Book }
};

export function getMedium(book: AnyBook): BookMedium | "" {
  if (!book.raw || !book.raw["$"] || !book.raw["$"]["schema:additionalType"]) {
    return "";
  }

  return book.raw["$"]["schema:additionalType"].value
    ? book.raw["$"]["schema:additionalType"].value
    : "";
}
