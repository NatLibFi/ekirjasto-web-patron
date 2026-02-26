/** @jsxRuntime classic */
/** @jsx jsx */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { jsx } from "theme-ui";
import {
  faCopy,
  faCheck,
  IconDefinition
} from "@fortawesome/free-solid-svg-icons";
import Button from "components/Button";
import React, { useState, useEffect } from "react";

// define the text and icon for normal button state
// as well as text and icon that indicate successful copying
export const COPY_PASSPHRASE_TEXT: string = "Copy";
export const COPY_PASSPHRASE_ICON: IconDefinition = faCopy;
export const COPIED_PASSPHRASE_TEXT: string = "Copied!";
export const COPIED_PASSPHRASE_ICON: IconDefinition = faCheck;

// define aria label for button
export const COPY_PASSPHRASE_LABEL: string = "Copy book passphrase";

// define the timeout duration in milliseconds.
// This should be enough time for the user to
// notice the Copied! text before it disappears
export const COPIED_PASSPHRASE_TIMEOUT: number = 2500;

// define props for the BookPassphraseCopyButton component
interface BookPassphraseCopyButtonProps {
  stringToCopy: string;
}

// Component that renders a button to copy a string to the user's clipboard
// The string that will be copied to clipboard is given as parameter
const BookPassphraseCopyButton: React.FC<BookPassphraseCopyButtonProps> = ({
  stringToCopy
}) => {
  // define a button state "isCopied"
  // so we can keep tabs if button was clicked
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // function to copy text to clipboard
  // if copying was successful, set new button state
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(stringToCopy);
      setIsCopied(true);
    } catch (error) {
      console.error("Error copying to clipboard:", error);
    }
  };

  // reset button after 2,5 seconds
  // return the normal state for button
  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, COPIED_PASSPHRASE_TIMEOUT);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  // check if the clipboard API is available in the user's browser
  const isClipboardAvailable = Boolean(navigator.clipboard);

  // get the text and icon based on copied state
  const { buttonText, buttonIcon } = isCopied
    ? { buttonText: COPIED_PASSPHRASE_TEXT, buttonIcon: COPIED_PASSPHRASE_ICON }
    : { buttonText: COPY_PASSPHRASE_TEXT, buttonIcon: COPY_PASSPHRASE_ICON };

  // define the style for the button
  // gap is the space between text and icon inside the button
  const buttonStyle: React.CSSProperties = {
    width: "110px",
    height: "30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px"
  };

  return (
    <>
      {/* copy button is only visible if clipboard is available */}
      {isClipboardAvailable && (
        <Button
          onClick={copyToClipboard}
          sx={buttonStyle}
          aria-label={COPY_PASSPHRASE_LABEL}
          data-testid="book-passphrase-copy-button"
        >
          {buttonText}
          <FontAwesomeIcon icon={buttonIcon} />
        </Button>
      )}
    </>
  );
};

export default BookPassphraseCopyButton;
