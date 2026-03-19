/** @jsxRuntime classic */
/** @jsx jsx */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { jsx } from "theme-ui";
import { Text } from "components/Text";
import { useTranslation } from "next-i18next";
import React from "react";

// define props for the BookPassphraseDisplayText component
interface BookPassphraseDisplayTextProps {
  passphrase: string;
}

// PassphraseDisplayText component is for displaying the actual passphrase
const BookPassphraseDisplayText: React.FC<BookPassphraseDisplayTextProps> = ({
  passphrase
}) => {
  const { t } = useTranslation();

  // define style for the Stack component
  // for example use monospace font
  const textStyle: React.CSSProperties = {
    fontFamily: "monospace",
    fontSize: "-1",
    wordBreak: "break-all",
    backgroundColor: "ui.gray.lightWarm",
    padding: "5px",
    borderRadius: "1"
  };

  return (
    <Text
      sx={textStyle}
      aria-label={t("bookPassphrase.ariaLabelForPassphrase")}
      data-testid="book-passphrase-display-text"
    >
      {passphrase}
    </Text>
  );
};

export default BookPassphraseDisplayText;
