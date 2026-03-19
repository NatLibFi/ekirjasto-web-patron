/** @jsxRuntime classic */
/** @jsx jsx */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { jsx } from "theme-ui";
import { useTranslation } from "next-i18next";
import Button from "components/Button";
import React from "react";

// define props for the BookPassphraseToggleButton component
// isVisible indicates if the passphrase card is visible
// onToggle is function that toggles the visibility of the passphrase card
interface BookPassphraseToggleButtonProps {
  isVisible: boolean;
  onToggle: () => void;
}

// Component that renders a button that toggles the visibility of the passphrase card
const BookPassphraseToggleButton: React.FC<BookPassphraseToggleButtonProps> = ({
  isVisible,
  onToggle
}) => {
  const { t } = useTranslation();

  // change toggle button text based on
  // if passhphrase is currently visible or not
  const buttonText = isVisible
    ? t("bookPassphrase.hidePassphrase")
    : t("bookPassphrase.showPassphrase");

  // define the style for the toggle button
  const buttonStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  };

  return (
    <Button
      onClick={onToggle}
      sx={buttonStyle}
      aria-pressed={isVisible}
      aria-label={buttonText}
      data-testid="book-passphrase-toggle-button"
    >
      {buttonText}
    </Button>
  );
};

export default BookPassphraseToggleButton;
