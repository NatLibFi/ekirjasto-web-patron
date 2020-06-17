/** @jsx jsx */
import { jsx } from "theme-ui";
import * as React from "react";
import { getFulfillmentState, dedupeLinks } from "utils/book";
import {
  BookData,
  MediaType,
  MediaLink,
  FulfillmentLink
} from "opds-web-client/lib/interfaces";
import { typeMap } from "opds-web-client/lib/utils/file";
import { bookIsOpenAccess } from "opds-web-client/lib/utils/book";
import Button, { AnchorButton } from "../Button";
import useDownloadButton from "opds-web-client/lib/hooks/useDownloadButton";
import { withErrorBoundary } from "../ErrorBoundary";
import useBorrow from "../../hooks/useBorrow";
import Stack from "components/Stack";
import { Text } from "components/Text";
import { MediumIcon } from "components/MediumIndicator";
import SvgDownload from "icons/Download";
import SvgPhone from "icons/Phone";

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

function availabilityString(book: BookData) {
  const availableCopies = book.copies?.available;
  const totalCopies = book.copies?.total;
  return typeof availableCopies === "number" && typeof totalCopies === "number"
    ? `${availableCopies} out of ${totalCopies} copies available.`
    : "Number of books available is unknown.";
}

function queueString(book: BookData) {
  const holds = book.holds?.total;
  return typeof holds === "number" ? `${holds} patrons in the queue.` : "";
}

const FulfillmentContent: React.FC<{ book: BookData }> = ({ book }) => {
  const fulfillmentState = getFulfillmentState(book);

  console.log(fulfillmentState);

  switch (fulfillmentState) {
    case "OPEN_ACCESS":
      if (!book.openAccessLinks)
        throw new Error("This open-access book is missing open access links");
      return <DownloadCard links={book.openAccessLinks} book={book} />;

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
          : "You must borrow the book before your loan expires.";
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

    case "AVAILABLE_TO_ACCESS":
      if (!book.fulfillmentLinks)
        throw new Error(
          "This available-to-access book is missing fulfillment links."
        );
      return <DownloadCard links={book.fulfillmentLinks} book={book} />;

    case "FULFILLMENT_STATE_ERROR":
      return <ErrorCard />;
  }
};

// const OpenAccess: React.FC<{ book: BookData }> = ({ book }) => {
//   const links = dedupeLinks(book.openAccessLinks ?? []);
//   return (
//     <>
//       <Stack sx={{ alignItems: "center" }}>
//         <SvgPhone sx={{ fontSize: 64 }} />
//         <Stack direction="column">
//           <Text variant="text.callouts.bold">
//             You&apos;re ready to read this book in SimplyE!
//           </Text>
//           <Text>This open-access book is available to keep forever.</Text>
//         </Stack>
//       </Stack>
//       <Stack direction="column" sx={{ mt: 3 }}>
//         <Text variant="text.body.italic">
//           If you would rather read on your computer, you can:
//         </Text>
//         <Stack sx={{ justifyContent: "center" }}>
//           {links.map(link => (
//             <AnchorButton
//               key={link.url}
//               variant="link"
//               color="ui.black"
//               newTab
//               href={link.url}
//             >
//               <SvgDownload sx={{ mr: 1 }} /> Download {typeMap[link.type].name}
//             </AnchorButton>
//           ))}
//         </Stack>
//       </Stack>
//     </>
//   );
// };

const BorrowOrReserve: React.FC<{
  book: BookData;
  title: string;
  subtitle: React.ReactNode;
  buttonLabel: string;
  buttonLoadingText: string;
}> = ({ book, title, subtitle, buttonLabel, buttonLoadingText }) => {
  const { isLoading, borrowOrReserve, errorMsg } = useBorrow(book);

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
      <Button
        size="lg"
        onClick={borrowOrReserve}
        loading={isLoading}
        loadingText={buttonLoadingText}
      >
        <Text variant="text.body.bold">{buttonLabel}</Text>
      </Button>
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
      <Button size="lg" disabled>
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
const DownloadCard: React.FC<{
  book: BookData;
  links: MediaLink[] | FulfillmentLink[];
}> = ({ book, links }) => {
  const { title } = book;
  const dedupedLinks = dedupeLinks(links ?? []);

  return (
    <>
      <Stack sx={{ alignItems: "center" }}>
        <SvgPhone sx={{ fontSize: 64 }} />
        <Stack direction="column">
          <Text variant="text.callouts.bold">
            You&apos;re ready to read this book in SimplyE!
          </Text>
          <Text>This open-access book is available to keep forever.</Text>
        </Stack>
      </Stack>
      <Stack direction="column" sx={{ mt: 3 }}>
        <Text variant="text.body.italic">
          If you would rather read on your computer, you can:
        </Text>
        <Stack sx={{ justifyContent: "center" }}>
          {dedupedLinks.map(link => (
            <DownloadButton key={link.url} link={link} title={title} />
          ))}
        </Stack>
      </Stack>
    </>
  );
};

const DownloadButton: React.FC<{
  link: FulfillmentLink | MediaLink;
  title;
}> = ({ link, title }) => {
  const { fulfill, downloadLabel, isIndirect } = useDownloadButton(link, title);

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
};

export default withErrorBoundary(FulfillmentCard, ErrorCard);
