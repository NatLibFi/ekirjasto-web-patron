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

export function getAuthors(book: AnyBook, lim?: number): string[] {
  // select contributors if the authors array is undefined or empty.
  const allAuth =
    typeof book.authors?.length === "number" && book.authors.length > 0
      ? book.authors
      : typeof book.contributors?.length === "number" &&
        book.contributors.length > 0
      ? book.contributors
      : ["Authors unknown"];

  // now limit it to however many
  if (lim) {
    return allAuth.slice(0, lim);
  }
  return allAuth;
}

export function getAuthorsString(book: AnyBook): string {
  const { authors } = book;
  if (!authors) return "Unknown Author";
  const authorsArray = getAuthors(book, 2);

  if (authors.length > 2) {
    authorsArray.push(`& ${authors.length - 2} more`);
  }

  return authorsArray.join(", ");
}

export function availabilityString(book: AnyBook) {
  const status = book.status;
  const availableCopies = book.copies?.available;
  const totalCopies = book.copies?.total;
  const queue = typeof book.holds?.total === "number" ? book.holds.total : null;

  switch (status) {
    case "borrowable":
      return typeof availableCopies === "number" &&
        typeof totalCopies === "number"
        ? `${availableCopies} out of ${totalCopies} copies available.`
        : null;
    case "reservable":
      return typeof availableCopies === "number" &&
        typeof totalCopies === "number"
        ? `${availableCopies} out of ${totalCopies} copies available.${
            queue !== null ? ` ${queue} patrons in the queue.` : ""
          }`
        : null;

    case "reserved":
      const position = book.holds?.position;
      const queueReserved =
        typeof book.holds?.total === "number" ? book.holds.total : null;

      if (!position || isNaN(position)) return null;
      return `You are in position ${position} out of ${queueReserved} in the queue. ${availableCopies} out of ${totalCopies} copies available.`;

    case "on-hold":
      const until = book.availability?.until
        ? new Date(book.availability.until).toDateString()
        : "NaN";
      const untilStr = until === "NaN" ? undefined : until;

      return `You have this book on hold${
        untilStr ? ` until ${untilStr}` : ""
      }.`;

    case "fulfillable":
      const availableFor = book.availability?.until
        ? daysUntilLoanExpiry(book.availability?.until)
        : "NaN";

      return availableFor !== "NaN"
        ? `You have this book on loan for ${availableFor}.`
        : null;

    case "unsupported":
      return null;
  }
}

function daysUntilLoanExpiry(expiryDateString) {
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
      return "less than an hour";
    }

    // Return number of hours left
    return `${differenceInHours} hours`;
  }
  // Return number of days left
  return `${differenceInDays} days`;
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
