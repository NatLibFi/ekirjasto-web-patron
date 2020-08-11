import { AXIS_NOW_DECRYPT } from "../../utils/env";

/** @jsx jsx */
import { jsx } from "theme-ui";
import * as React from "react";
import {
  getFulfillmentState,
  dedupeLinks,
  availabilityString,
  queueString,
  bookIsAudiobook
} from "utils/book";
import {
  BookData,
  MediaLink,
  FulfillmentLink
} from "opds-web-client/lib/interfaces";
import Button, { NavButton } from "../Button";
import useDownloadButton from "opds-web-client/lib/hooks/useDownloadButton";
import { withErrorBoundary } from "../ErrorBoundary";
import useBorrow from "../../hooks/useBorrow";
import Stack from "components/Stack";
import { Text } from "components/Text";
import { MediumIcon } from "components/MediumIndicator";
import SvgExternalLink from "icons/ExternalOpen";
import SvgDownload from "icons/Download";
import SvgPhone from "icons/Phone";
import useIsBorrowed from "hooks/useIsBorrowed";
import { NEXT_PUBLIC_COMPANION_APP } from "../../utils/env";

const FulfillmentCard: React.FC<{ book: BookData }> = ({ book }) => {
  return (
    <Stack
      direction="column"
      aria-label="Borrow and download card"
      sx={{
        bg: "ui.gray.lightWarm",
        p: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        color: "ui.gray.extraDark",
        my: 3
      }}
    >
      <FulfillmentContent book={book} />
    </Stack>
  );
};

const FulfillmentContent: React.FC<{
  book: BookData;
}> = ({ book }) => {
  const isBorrowed = useIsBorrowed(book);
  const fulfillmentState = getFulfillmentState(book, isBorrowed);
  switch (fulfillmentState) {
    case "AVAILABLE_OPEN_ACCESS":
      if (!book.openAccessLinks)
        throw new Error("This open-access book is missing open access links");
      return (
        <AccessCard
          links={book.openAccessLinks}
          book={book}
          subtitle="This open-access book is available to keep forever."
        />
      );

    case "AVAILABLE_TO_BORROW": {
      return (
        <BorrowOrReserve
          title="This book is available to borrow!"
          subtitle={
            <>
              <MediumIcon book={book} sx={{ mr: 1 }} />{" "}
              {availabilityString(book)}
            </>
          }
          book={book}
          buttonLabel="Borrow"
          buttonLoadingText="Borrowing..."
        />
      );
    }

    case "AVAILABLE_TO_RESERVE": {
      return (
        <BorrowOrReserve
          book={book}
          title="This book is currently unavailable."
          subtitle={
            <>
              <MediumIcon book={book} sx={{ mr: 1 }} />{" "}
              {availabilityString(book)}
              {typeof book.holds?.total === "number" &&
                ` ${book.holds.total} patrons in the queue.`}
            </>
          }
          buttonLabel="Reserve"
          buttonLoadingText="Reserving..."
        />
      );
    }

    case "RESERVED":
      return <Reserved book={book} />;

    case "READY_TO_BORROW": {
      const availableUntil = book.availability?.until
        ? new Date(book.availability.until).toDateString()
        : "NaN";

      const title = "You can now borrow this book!";
      const subtitle =
        availableUntil !== "NaN"
          ? `Your hold will expire on ${availableUntil}. ${queueString(book)}`
          : "You must borrow this book before your loan expires.";
      return (
        <BorrowOrReserve
          book={book}
          title={title}
          subtitle={subtitle}
          buttonLabel="Borrow"
          buttonLoadingText="Borrowing..."
        />
      );
    }

    case "AVAILABLE_TO_ACCESS": {
      if (!book.fulfillmentLinks)
        throw new Error(
          "This available-to-access book is missing fulfillment links."
        );

      const availableUntil = book.availability?.until
        ? new Date(book.availability.until).toDateString()
        : "NaN";

      const subtitle =
        availableUntil !== "NaN"
          ? `You have this book on loan until ${availableUntil}.`
          : "You have this book on loan.";
      return (
        <AccessCard
          links={book.fulfillmentLinks}
          book={book}
          subtitle={subtitle}
        />
      );
    }

    case "FULFILLMENT_STATE_ERROR":
      return <ErrorCard />;
  }
};

const BorrowOrReserve: React.FC<{
  book: BookData;
  title: string;
  subtitle: React.ReactNode;
  buttonLabel: string;
  buttonLoadingText: string;
}> = ({ book, title, subtitle, buttonLabel, buttonLoadingText }) => {
  const { isLoading, borrowOrReserve, allBorrowLinks, errorMsg } = useBorrow(
    book
  );
  return (
    <>
      <Text variant="text.callouts.bold">{title}</Text>
      <Text
        variant="text.body.italic"
        sx={{
          display: "inline-flex",
          alignItems: "center",
          textAlign: "center"
        }}
      >
        {subtitle}
      </Text>
      {allBorrowLinks!.map(borrowLink => {
        let fullButtonLabel =
          borrowLink.indirectType ===
          "application/vnd.librarysimplified.axisnow+json"
            ? buttonLabel + " to read online"
            : buttonLabel + " to read on a mobile device";
        return (
          <Button
            key={borrowLink.url}
            size="lg"
            onClick={() => borrowOrReserve(borrowLink.url)}
            loading={isLoading}
            loadingText={buttonLoadingText}
          >
            <Text variant="text.body.bold">{fullButtonLabel}</Text>
          </Button>
        );
      })}
      {errorMsg && <Text sx={{ color: "ui.error" }}>Error: {errorMsg}</Text>}
    </>
  );
};

const Reserved: React.FC<{ book: BookData }> = ({ book }) => {
  const position = book.holds?.position;
  return (
    <>
      <Text variant="text.callouts.bold">You have this book on hold.</Text>
      {!!position && (
        <Text
          variant="text.body.italic"
          sx={{ display: "inline-flex", alignItems: "center" }}
        >
          <MediumIcon book={book} sx={{ mr: 1 }} />
          Your hold position is: {position}.
        </Text>
      )}
      <Button size="lg" disabled aria-label="Reserved" role="button">
        <Text variant="text.body.bold">Reserved</Text>
      </Button>
      {/* {errorMsg && <Text sx={{ color: "ui.error" }}>Error: {errorMsg}</Text>} */}
    </>
  );
};

const ErrorCard: React.FC = () => {
  return (
    <>
      <Text variant="text.callouts.bold">
        There was an error processing this book.
      </Text>
      <Text
        variant="text.body.italic"
        sx={{
          display: "inline-flex",
          alignItems: "center",
          textAlign: "center"
        }}
      >
        We are unable to show you the book&apos;s availability. Try refreshing
        your page. If the problem persists, please contact library support.
      </Text>
    </>
  );
};

/**
 * Handles the case where it is ready for download either via openAccessLink or
 * via fulfillmentLink.
 */
const AccessCard: React.FC<{
  book: BookData;
  links: MediaLink[];
  subtitle: string;
}> = ({ book, links, subtitle }) => {
  const { title } = book;
  const dedupedLinks = dedupeLinks(links);
  const isAudiobook = bookIsAudiobook(book);
  console.log("access card links", links);
  const hasMobile = dedupedLinks.filter(link => {
      return link.type !== "application/vnd.librarysimplified.axisnow+json";
  });
  const companionApp =
    NEXT_PUBLIC_COMPANION_APP === "openebooks" ? "Open eBooks" : "SimplyE";

  return (
    <>
      {hasMobile && (
        <Stack sx={{ alignItems: "center" }}>
          <SvgPhone sx={{ fontSize: 64 }} />
          <Stack direction="column">
            <Text variant="text.callouts.bold">
              You&apos;re ready to read this book in {companionApp}!
            </Text>
            <Text>{subtitle}</Text>
          </Stack>
        </Stack>
      )}
      {!isAudiobook && (
        <Stack direction="column" sx={{ mt: 3 }}>
          <Text variant="text.body.italic" sx={{ textAlign: "center" }}>
            If you would rather read on your computer, you can:
          </Text>
          <Stack sx={{ justifyContent: "center", flexWrap: "wrap" }}>
            {dedupedLinks.map(link => {
              return (
                <DownloadButton key={link.url} link={link} title={title} />
              );
            })}
          </Stack>
        </Stack>
      )}
    </>
  );
};

const DownloadButton: React.FC<{
  link: MediaLink;
  title: string;
}> = ({ link, title }) => {
  console.log("using download button link", link);
  const { fulfill, downloadLabel } = useDownloadButton(link, title);

  const hasReaderLink =
    (link as FulfillmentLink).indirectType === "application/vnd.librarysimplified.axisnow+json";

  if (hasReaderLink) {
    console.log("has readerlink");
    const readerLink = `/read/${encodeURIComponent(link.url)}`;
    return (
      <NavButton
        variant="ghost"
        color="ui.gray.extraDark"
        iconLeft={SvgExternalLink}
        href={readerLink}
      >
        {downloadLabel}
      </NavButton>
    );
  } else {
    return (
      <Button
        onClick={fulfill}
        variant="ghost"
        color="ui.gray.extraDark"
        iconLeft={SvgDownload}
      >
        {downloadLabel}
      </Button>
    );
  }
};

export default withErrorBoundary(FulfillmentCard, ErrorCard);
