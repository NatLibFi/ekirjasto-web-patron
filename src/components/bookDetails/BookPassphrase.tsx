/** @jsxRuntime classic */
/** @jsx jsx */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { AnyBook } from "interfaces";
import { jsx } from "theme-ui";
import * as React from "react";
import BookPassphraseInstructionsText from "components/BookPassphraseInstructionsText";
import BookPassphraseCard from "components/BookPassphraseCard";
import Stack from "components/Stack";
import useUser from "components/context/UserContext";

// define props for the BookPassphrase component
interface BookPassphraseProps {
  book: AnyBook;
}

// Component to help user handle the book passhrase.
// Book passhrase is a LCP password string.
// Users need their personal passphrase
// when they download a book file and
// open it in a separate reader software
const BookPassphrase: React.FC<BookPassphraseProps> = ({ book }) => {
  // get the user's authentication status
  const { isAuthenticated } = useUser();

  // check if book is an eBook format (ePub or PDF)
  const isEbook = book.format === "ePub" || book.format === "PDF";

  // check if book has a passphrase
  const hasPassphrase = book.passphrase !== undefined;

  // determine if the passphrase should be shown
  const shouldShowPassphrase = isAuthenticated && hasPassphrase && isEbook;

  // define style for the Stack component
  const stackStyle: React.CSSProperties = {
    alignItems: "flex-start",
    marginBottom: "16px"
  };

  // component is only rendered if the
  // - user is logged-in
  // - book passphrase exists
  // - book is ePub or PDF
  return (
    <>
      {shouldShowPassphrase && (
        <Stack direction="column" sx={stackStyle}>
          {/* first render instructions how to use book passhprase */}
          <BookPassphraseInstructionsText />

          {/* then render the passphrase card */}
          <BookPassphraseCard passphrase={book.passphrase} />
        </Stack>
      )}
    </>
  );
};

export default BookPassphrase;
