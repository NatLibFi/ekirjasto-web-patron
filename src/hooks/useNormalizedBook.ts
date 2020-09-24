import useUser from "components/context/UserContext";
import { BookData } from "interfaces";
import useTypedSelector from "./useTypedSelector";

/**
 * A hook to give you the book state that has been updated with
 * loan data if any exists
 */

export default function useNormalizedBook(): BookData | null {
  const book = useTypedSelector(state => state.book.data);
  const { loans } = useUser();

  if (!book) return book;

  const loan = loans?.find(loanedBook => book.id === loanedBook.id);

  return loan ?? book;
}
