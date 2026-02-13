/** @jsxRuntime classic */
/** @jsx jsx */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { jsx } from "theme-ui";
import { Text } from "components/Text";
import React from "react";

// define the instructions text string
export const INSTRUCTIONS_TEXT: string =
  "If you download the book, please copy the password below for your EPUB reader.";

// Component that instructs the user
// so that user knows how to use the book passphrase
const BookPassphraseInstructionsText: React.FC = () => {
  // define style for the intruction text
  const textStyle: React.CSSProperties = {
    fontSize: "-1"
  };

  return <Text sx={textStyle}>{INSTRUCTIONS_TEXT}</Text>;
};

export default BookPassphraseInstructionsText;
