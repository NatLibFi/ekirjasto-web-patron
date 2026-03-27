/** @jsxRuntime classic */
/** @jsx jsx */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { jsx } from "theme-ui";
import { Text } from "components/Text";
import { useTranslation } from "next-i18next";
import React from "react";

// Component that instructs the user
// so that user knows how to use the book passphrase
const BookPassphraseInstructionsText: React.FC = () => {
  const { t } = useTranslation();

  // define style for the intruction text
  const textStyle: React.CSSProperties = {
    fontSize: "-1"
  };

  return (
    <Text
      sx={textStyle}
      aria-live="polite"
      data-testid="book-passphrase-instructions-text"
    >
      {t("bookPassphrase.instructionsText")}
    </Text>
  );
};

export default BookPassphraseInstructionsText;
