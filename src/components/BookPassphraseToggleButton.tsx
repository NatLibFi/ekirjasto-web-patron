/** @jsxRuntime classic */
/** @jsx jsx */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { jsx } from "theme-ui";
import Button from "components/Button";
import React from "react";

// define the alternating texts for the toggle button
export const HIDE_PASSPHRASE_TEXT: string = "Hide passphrase";
export const SHOW_PASSPHRASE_TEXT: string = "Show passphrase";

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
  // change text based on if passhphrase is currently visible or not
  const buttonText = isVisible ? HIDE_PASSPHRASE_TEXT : SHOW_PASSPHRASE_TEXT;

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
    >
      {buttonText}
    </Button>
  );
};

export default BookPassphraseToggleButton;
