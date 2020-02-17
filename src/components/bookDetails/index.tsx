/** @jsx jsx */
import { jsx, Styled } from "theme-ui";
import * as React from "react";
import { fetchComplaintTypes, postComplaint } from "../../actions";
import DefaultBookDetails, {
  BookDetailsProps as DefaultBooKDetailsProps
} from "opds-web-client/lib/components/BookDetails";
import ReportProblemLink from "../ReportProblemLink";
import RevokeButton from "../RevokeButton";
import { ComplaintData, SetCollectionAndBook } from "../../interfaces";
import BookCover from "../BookCover";
import Recommendations from "./recommendations";
import {
  mapDispatchToProps,
  mapStateToProps,
  mergeRootProps
} from "opds-web-client/lib/components/mergeRootProps";
import { BookData } from "opds-web-client/lib/interfaces";
import { connect } from "react-redux";
import ExternalLink from "../ExternalLink";
import useSetCollectionAndBook from "../../hooks/useSetCollectionAndBook";
import { PageLoader } from "../LoadingIndicator";
import FulfillmentCard from "./FulfillmentCard";
import BreadcrumbBar from "../BreadcrumbBar";
import truncateString from "../../utils/truncate";
import useNormalizedBook from "../../hooks/useNormalizedBook";
import { Helmet } from "react-helmet-async";
import DetailField from "../BookMetaDetail";

export interface BookDetailsPropsNew extends DefaultBooKDetailsProps {
  setCollectionAndBook: SetCollectionAndBook;
}

export const sidebarWidth = 200;

const BookDetails: React.FC<BookDetailsPropsNew> = ({
  setCollectionAndBook
}) => {
  // set the collection and book
  useSetCollectionAndBook(setCollectionAndBook);

  const book = useNormalizedBook();

  if (!book) return <PageLoader />;
  return (
    <div>
      <Helmet>
        <title>{book.title}</title>
      </Helmet>
      <BreadcrumbBar currentLocation={truncateString(book.title, 20, false)} />
      <div
        sx={{
          variant: "cards.bookDetails",
          border: "1px solid",
          borderColor: "blues.dark",
          borderRadius: "card",
          p: [2, 4]
        }}
      >
        <div id="top" sx={{ display: "flex" }}>
          {/* side bar */}
          <div
            sx={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              maxWidth: sidebarWidth
            }}
          >
            <BookCover book={book} sx={{ m: 2 }} />
            {/* download requirements & download links */}
            <FulfillmentCard
              sx={{ m: 2, display: ["none", "none", "block"] }}
              book={book}
            />
            <DownloadRequirements
              sx={{ m: 2, display: ["none", "none", "block"] }}
            />
          </div>

          {/* title, details, summary */}
          <div sx={{ flex: 2, m: 2 }}>
            <Styled.h1
              sx={{
                variant: "text.bookTitle",
                lineHeight: [0.7],
                letterSpacing: [1.4],
                my: [3],
                fontSize: [5, 5, 6]
              }}
            >
              {book.title}
              {book.subtitle && `: ${book.subtitle}`}
            </Styled.h1>
            <Styled.h3 sx={{ color: "primary", fontSize: [2, 2, 3] }}>
              By {book.authors?.join(", ") ?? "Unknown"}
            </Styled.h3>
            <DetailField heading="Publisher" details={book.publisher} />
            <DetailField heading="Published" details={book.published} />
            <DetailField
              heading="Categories"
              details={book.categories?.join(", ")}
            />
            <Summary sx={{ display: ["none", "none", "block"] }} book={book} />
          </div>
        </div>
        {/* the summary is displayed below when on small screens */}
        <Summary book={book} sx={{ display: ["block", "block", "none"] }} />
        {/* the download requirements are displayed below on small screens */}
        <div
          sx={{
            display: ["flex", "flex", "none"],
            flexWrap: "wrap",
            justifyContent: "center"
          }}
        >
          <DownloadRequirements sx={{ m: 2 }} />
          <FulfillmentCard book={book} />
        </div>
      </div>
      <Recommendations book={book} />
    </div>
  );
};

const Summary: React.FC<{ book: BookData; className?: string }> = ({
  book,
  className
}) => (
  <div sx={{ m: 2 }} className={className}>
    <Styled.h2>Summary</Styled.h2>
    <div
      dangerouslySetInnerHTML={{
        __html: book.summary ?? "Summary not provided."
      }}
      sx={{
        maxHeight: "50vh",
        overflowY: "scroll"
      }}
    />
  </div>
);

const DownloadRequirements: React.FC<{ className?: string }> = ({
  className
}) => {
  return (
    <div
      sx={{
        border: "1px solid",
        borderColor: "blues.primary",
        backgroundColor: "lightGrey",
        borderRadius: "card",
        display: "flex",
        flexDirection: "column",
        // alignItems: "center",
        py: 2,
        px: 3,
        maxWidth: sidebarWidth
      }}
      className={className}
    >
      <Styled.h5 sx={{ m: 0, mb: 2 }}>Download Requirements:</Styled.h5>
      <ol sx={{ m: 0, p: 0, pl: 3, fontSize: 1 }}>
        <li>
          <ExternalLink href="https://accounts.adobe.com/">
            Create Adobe ID
          </ExternalLink>
        </li>
        <li>
          Install an eBook Reader:
          <br />
          <ExternalLink href="https://www.adobe.com/solutions/ebook/digital-editions/download.html">
            Adobe Digital Editions
          </ExternalLink>
          <br />
          <ExternalLink href="">Bluefire Reader</ExternalLink>
          <br />
          <span>* Or another Adobe-compatible application</span>
        </li>
      </ol>
    </div>
  );
};

const Connected = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeRootProps
)(BookDetails);

// am doing this because typescript throws an error when trying to use
// redux ConnectedComponent inside of Route
const Wrapper = props => <Connected {...props} />;
export default Wrapper;
