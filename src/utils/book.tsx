import * as React from "react";
import {
  BookData,
  FetchErrorData,
  BookMedium,
  MediaLink
} from "opds-web-client/lib/interfaces";
import { BookFulfillmentState } from "interfaces";

import { Book, Headset } from "../icons";

export function getAuthors(book: BookData, lim?: number): string[] {
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

export function dedupeLinks<T extends MediaLink>(links: T[]) {
  return links.reduce<T[]>((uniqueArr, current) => {
    const isDup = uniqueArr.find(
      uniqueLink => uniqueLink.type === current.type
    );

    return isDup ? uniqueArr : [...uniqueArr, current];
  }, []);
}

function hasBorrowRelation(book: BookData) {
  return typeof book.borrowUrl === "string";
}

/**
 * the default assumption is that a book is available. See:
 * https://github.com/NYPL-Simplified/Simplified/wiki/OPDS-For-Library-Patrons#opdsavailability---describing-resource-availability
 */
const DEFAULT_AVAILABILITY = "available";

/**
 * This is mapped from a conversation with Leonard and the OPDS wiki:
 * https://github.com/NYPL-Simplified/Simplified/wiki/OPDS-For-Library-Patrons#opdsavailability---describing-resource-availability
 */
export function getFulfillmentState(book: BookData): BookFulfillmentState {
  const availabilityStatus = book.availability?.status ?? DEFAULT_AVAILABILITY;

  if (book.openAccessLinks && book.openAccessLinks.length > 0)
    return "OPEN_ACCESS";

  if (availabilityStatus === "available" && book.fulfillmentLinks)
    return "AVAILABLE_TO_ACCESS";

  if (availabilityStatus === "available" && hasBorrowRelation(book))
    return "AVAILABLE_TO_BORROW";

  if (availabilityStatus === "ready" && hasBorrowRelation(book))
    return "READY_TO_BORROW";

  if (availabilityStatus === "unavailable" && hasBorrowRelation(book))
    return "AVAILABLE_TO_RESERVE";

  if (availabilityStatus === "reserved") return "RESERVED";

  return "FULFILLMENT_STATE_ERROR";
}

export function getErrorMsg(error: FetchErrorData | null): string | null {
  const response = error?.response;
  if (response) {
    try {
      const responseObj = JSON.parse(response);
      // try to get the debug_message but otherwise just return
      // the full response as a string.
      // eslint-disable-next-line camelcase
      return responseObj?.debug_message ?? response;
    } catch {
      // it's not valid json. Just return it.
      return response;
    }
  }
  return null;
}

export const bookMediumMap: {
  [key in BookMedium]: React.ReactNode;
} = {
  "http://bib.schema.org/Audiobook": {
    name: "Audiobook",
    icon: Headset
  },
  "http://schema.org/EBook": { name: "eBook", icon: Book },
  "http://schema.org/Book": { name: "Book", icon: Book }
};
