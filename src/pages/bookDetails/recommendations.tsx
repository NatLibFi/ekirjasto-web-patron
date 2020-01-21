/** @jsx jsx */
import { jsx, Styled } from "theme-ui";
import * as React from "react";
import book from "opds-web-client/lib/reducers/book";
import { BookData, LaneData } from "opds-web-client/lib/interfaces";
import { useActions } from "../../components/context/ActionsContext";
import useRecommendationsState from "../../components/context/RecommendationsContext";
import BookCover from "../../components/BookCover";
import LoadingIndicator from "../../components/LoadingIndicator";
import { useGetCatalogLink } from "../../hooks/useCatalogLink";
import Link from "../../components/Link";

const Recommendations: React.FC<{ book: BookData }> = ({ book }) => {
  /**
   * TODO
   * - test multiple lanes
   */
  const relatedUrl = getRelatedUrl(book);
  const {
    recommendationsState,
    recommendationsDispatch,
    recommendationsActions
  } = useRecommendationsState();

  // fetch the collection
  React.useEffect(() => {
    if (relatedUrl) {
      recommendationsDispatch(
        recommendationsActions.fetchCollection(relatedUrl)
      );
    }

    /**
     * This will be run on unmount, and before running the effect anytime
     * it is going to run.
     */
    return () => {
      recommendationsDispatch(recommendationsActions.clearCollection());
    };
    // will run on mount and anytime the relatedUrl changes.
    // other dependencies should never change.
  }, [recommendationsDispatch, recommendationsActions, relatedUrl]);

  // get the lanes data from state
  const lanes = recommendationsState?.data?.lanes ?? [];
  const isFetching = recommendationsState?.isFetching ?? false;

  console.log(recommendationsState);

  if (isFetching) {
    return (
      <div
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column"
        }}
      >
        <LoadingIndicator /> Loading recommendations...
      </div>
    );
  }

  return (
    <React.Fragment>
      {lanes.map(lane => (
        <RecommendationsLane key={lane.title} lane={lane} selfId={book.id} />
      ))}
    </React.Fragment>
  );
};

const RecommendationsLane: React.FC<{ lane: LaneData; selfId: string }> = ({
  selfId,
  lane: { title, books }
}) => {
  const getCatalogLink = useGetCatalogLink();

  // if there are less than two books, show nothing
  if (books.length < 2) return null;

  return (
    <div sx={{ variant: "cards.bookDetails", border: "none" }}>
      <Styled.h4>{title}</Styled.h4>
      <div
        sx={{
          border: "1px solid",
          borderColor: "blues.dark",
          borderRadius: "card",
          p: 2,
          display: "flex"
        }}
      >
        {books.map(
          book =>
            book.id !== selfId && (
              <Link
                to={getCatalogLink(book.url)}
                key={book.id}
                sx={{ flex: "1 0 auto", maxWidth: 110, m: 2 }}
              >
                <BookCover book={book} sx={{ m: 2 }} />
                <Styled.h3
                  sx={{
                    variant: "text.bookTitle",
                    textAlign: "center",
                    fontSize: 4,
                    mt: 2,
                    mb: 0
                  }}
                >
                  {book.title}
                </Styled.h3>
              </Link>
            )
        )}
      </div>
    </div>
  );
};

const getRelatedUrl = (book: BookData): null | string => {
  if (!book) return null;

  const links = book.raw.link;
  if (!links) return null;

  const relatedLink = links.find(link => link.$.rel.value === "related");
  if (!relatedLink) return null;

  return relatedLink.$.href.value;
};

export default Recommendations;
