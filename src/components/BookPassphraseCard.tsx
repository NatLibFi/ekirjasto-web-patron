/** @jsxRuntime classic */
/** @jsx jsx */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { jsx } from "theme-ui";
import BookPassphraseCopyButton from "components/BookPassphraseCopyButton";
import BookPassphraseDisplayText from "components/BookPassphraseDisplayText";
import React from "react";
import Stack from "components/Stack";

// define props for the BookPassphraseCard component
interface BookPassphraseCardProps {
  passphrase: string;
}

// Component that displays the actual book passphrase string
// and also a button for the user to easily copy the passphrase.
// User can also select and copy the passphrase manually.
const BookPassphraseCard: React.FC<BookPassphraseCardProps> = ({
  passphrase
}) => {
  // define style for the Stack component
  const stackStyle: React.CSSProperties = {
    alignItems: "center"
  };

  return (
    <Stack direction="row" sx={stackStyle}>
      {/* first render the actual book passhprase as text */}
      <BookPassphraseDisplayText passphrase={passphrase} />

      {/* then render the button to copy the book passhprase to clibpboard */}
      <BookPassphraseCopyButton stringToCopy={passphrase} />
    </Stack>
  );
};

export default BookPassphraseCard;
