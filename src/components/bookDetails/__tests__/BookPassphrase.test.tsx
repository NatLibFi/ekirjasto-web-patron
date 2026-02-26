import BookPassphrase from "../BookPassphrase";
import { COPIED_PASSPHRASE_TIMEOUT } from "../../BookPassphraseCopyButton";
import { FulfillableBook } from "interfaces";
import * as React from "react";
import { act, fireEvent, fixtures, setup, screen, within } from "test-utils";

// define default testbook for testing
// book that is eBook (epub or pdf)
// and has a book passphrase
const testBook = fixtures.mergeBook<FulfillableBook>({
  ...fixtures.book,
  status: "fulfillable",
  fulfillmentLinks: [],
  revokeUrl: "/revoke",
  format: "ePub",
  passphrase: "SecretBookPassphrase"
});

// variation of default testbook
// book has no passphrase
const testBookWithoutPassphrase = fixtures.mergeBook<FulfillableBook>({
  ...testBook,
  passphrase: undefined
});

// variation of default testbook
// book is audiobook, not an ebook
const testBookAudiobook = fixtures.mergeBook<FulfillableBook>({
  ...testBook,
  format: "Audiobook"
});

function renderBookPassphraseComponent(
  book: FulfillableBook,
  isAuthenticated: boolean
) {
  // Render the component with defaults
  // and allow overrides per test
  return setup(<BookPassphrase book={book} />, {
    user: { isAuthenticated }
  });
}

describe("BookPassphrase component", () => {
  describe("visibility", () => {
    test("is visible if user is authenticated and book is eBook that has book passphrase", () => {
      renderBookPassphraseComponent(testBook, true);

      expect(
        screen.getByTestId("book-passphrase-component")
      ).toBeInTheDocument();
    });

    test("is hidden if user is not authenticated", () => {
      renderBookPassphraseComponent(testBook, false);

      expect(
        screen.queryByTestId("book-passphrase-component")
      ).not.toBeInTheDocument();
    });

    test("is hidden if book has no passphrase", () => {
      renderBookPassphraseComponent(testBookWithoutPassphrase, true);

      expect(
        screen.queryByTestId("book-passphrase-component")
      ).not.toBeInTheDocument();
    });

    test("is hidden if book is audiobook", () => {
      renderBookPassphraseComponent(testBookAudiobook, true);

      expect(
        screen.queryByTestId("book-passphrase-component")
      ).not.toBeInTheDocument();
    });
  });

  describe("rendering", () => {
    test("renders book passphrase instructions text", () => {
      renderBookPassphraseComponent(testBook, true);
      const component = screen.getByTestId("book-passphrase-component");

      expect(
        within(component).getByTestId("book-passphrase-instructions-text")
      ).toBeInTheDocument();
    });

    test("renders book passphrase toggle button", async () => {
      renderBookPassphraseComponent(testBook, true);

      const component = screen.getByTestId("book-passphrase-component");
      const toggleButton = within(component).getByTestId(
        "book-passphrase-toggle-button"
      );

      expect(toggleButton).toHaveRole("button");
      expect(toggleButton).toBeInTheDocument();
    });

    test("renders book passphrase", async () => {
      renderBookPassphraseComponent(testBook, true);

      const component = screen.getByTestId("book-passphrase-component");
      const toggleButton = within(component).getByTestId(
        "book-passphrase-toggle-button"
      );
      fireEvent.click(toggleButton);

      const displayText = within(component).getByTestId(
        "book-passphrase-display-text"
      );
      const bookPassphraseString = screen.getByText("SecretBookPassphrase");

      expect(displayText).toBeInTheDocument();
      expect(bookPassphraseString).toBeInTheDocument();
    });

    test("renders book passphrase copy button", async () => {
      renderBookPassphraseComponent(testBook, true);

      const component = screen.getByTestId("book-passphrase-component");
      const toggleButton = within(component).getByTestId(
        "book-passphrase-toggle-button"
      );
      fireEvent.click(toggleButton);

      const copyButton = within(component).getByTestId(
        "book-passphrase-copy-button"
      );

      expect(copyButton).toHaveRole("button");
      expect(copyButton).toBeInTheDocument();
    });
  });

  describe("functionality", () => {
    test("toggles book passphrase visibility when toggle button is clicked", async () => {
      renderBookPassphraseComponent(testBook, true);

      const component = screen.getByTestId("book-passphrase-component");
      const toggleButton = within(component).getByTestId(
        "book-passphrase-toggle-button"
      );
      expect(toggleButton).toHaveAttribute("aria-pressed", "false");

      fireEvent.click(toggleButton);
      expect(toggleButton).toHaveAttribute("aria-pressed", "true");

      fireEvent.click(toggleButton);
      expect(toggleButton).toHaveAttribute("aria-pressed", "false");
    });

    test("copies passphrase to clipboard when copy button is clicked", async () => {
      renderBookPassphraseComponent(testBook, true);

      // mock clipboard's writeText function
      const mockWriteText = jest.fn().mockResolvedValue(undefined);

      // replace writeText with mock implementation
      const writeTextSpy = jest
        .spyOn(navigator.clipboard, "writeText")
        .mockImplementation(mockWriteText);

      const component = screen.getByTestId("book-passphrase-component");
      const toggleButton = within(component).getByTestId(
        "book-passphrase-toggle-button"
      );

      fireEvent.click(toggleButton);

      const copyButton = within(component).getByTestId(
        "book-passphrase-copy-button"
      );

      await act(async () => {
        fireEvent.click(copyButton);
      });

      expect(mockWriteText).toHaveBeenCalledWith("SecretBookPassphrase");

      // restore writeText from mock to default
      writeTextSpy.mockRestore();
    });

    test("shows feedback after succesfully copying passphrase", async () => {
      renderBookPassphraseComponent(testBook, true);

      // mock clipboard's writeText function
      const mockWriteText = jest.fn().mockResolvedValue(undefined);

      // replace writeText with mock implementation
      const writeTextSpy = jest
        .spyOn(navigator.clipboard, "writeText")
        .mockImplementation(mockWriteText);

      // use fake timer so we can control time
      jest.useFakeTimers();

      const component = screen.getByTestId("book-passphrase-component");
      const toggleButton = within(component).getByTestId(
        "book-passphrase-toggle-button"
      );

      fireEvent.click(toggleButton);

      const copyButton = within(component).getByTestId(
        "book-passphrase-copy-button"
      );
      expect(copyButton).toBeInTheDocument();

      // this should be the button default content
      const initialContent = copyButton.innerHTML;

      fireEvent.click(copyButton);

      // wait the component to update after click
      await act(async () => {});

      // button content should be changed
      const changedContent = copyButton.innerHTML;
      expect(changedContent).not.toEqual(initialContent);

      // mock 2,5 second passing
      await act(async () => {
        jest.advanceTimersByTime(COPIED_PASSPHRASE_TIMEOUT);
      });

      // after timeout, button content should be back to default
      const revertedContent = copyButton.innerHTML;
      expect(revertedContent).toEqual(initialContent);

      // restore writeText from mock to default
      writeTextSpy.mockRestore();

      // restore normal timers
      jest.useRealTimers();
    });

    test("logs error to console when clipboard copy fails", async () => {
      renderBookPassphraseComponent(testBook, true);

      // mock clipboard writeText function to always throw error
      const mockWriteText = jest.fn(() => {
        throw new Error("Error");
      });

      // replace writetext with mock implementation
      jest
        .spyOn(navigator.clipboard, "writeText")
        .mockImplementation(mockWriteText);

      // mock console's error function
      // so we can check if error occured
      const consoleErrorMock = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const component = screen.getByTestId("book-passphrase-component");
      const toggleButton = within(component).getByTestId(
        "book-passphrase-toggle-button"
      );

      fireEvent.click(toggleButton);

      const copyButton = within(component).getByTestId(
        "book-passphrase-copy-button"
      );

      await act(async () => {
        fireEvent.click(copyButton);
      });

      // test that if copying passphrase to clipboard fails
      // then error info text and a error is logged to console
      expect(consoleErrorMock).toHaveBeenCalledWith(
        "Error copying to clipboard:",
        expect.any(Error)
      );

      // restore normal console.error function
      consoleErrorMock.mockRestore();
      // restore to default mocks
      jest.restoreAllMocks();
    });
  });
});
