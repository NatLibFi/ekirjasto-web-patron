import { useState } from "react";
import { AnyBook } from "interfaces";
import useUser from "components/context/UserContext";
import useError from "hooks/useError";

/**
 * Return type for the useSelectBook hook.
 */
interface UseSelectBookResult {
  isLoading: boolean;
  error: string | null;
  /**
   * Toggles the selection state of a book on the server.
   * @param book - The book to toggle selection for
   * @param currentlySelected - Whether the book is currently selected
   * @returns Promise<boolean> - true if successful, false if failed
   */
  toggleSelection: (
    book: AnyBook,
    currentlySelected: boolean
  ) => Promise<boolean>;
}

/**
 * Hook for managing book selection (favorites) state and API interactions.
 *
 * Functionality:
 * - Handles POST requests to `/select_book` endpoint to add books to favorites
 * - Handles DELETE requests to `/unselect_book` endpoint to remove books from favorites
 * - Updates the user context's selected books list on successful API response
 *
 * @returns useSelectBookResult - Object containing loading state, error, and toggleSelection function
 */
export default function useSelectBook(): UseSelectBookResult {
  const { token, setSelected } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const { error, handleError, setErrorString, clearError } = useError();

  /**
   * Toggles the selection state of a book by making an API request.
   *
   * Flow:
   * 1. Check if user is authenticated; redirect to login if not
   * 2. Determine the correct endpoint and HTTP method based on current selection state
   *   - Selecting: POST to book.selectBookUrl with book ID in body
   *   - Unselecting: DELETE to book.unselectBookUrl (no body needed)
   * 3. Make the API request with authentication token
   * 4. Update the user context's selected books list on success
   * 5. Return success/failure status
   *
   * @param book - The book to toggle selection for
   * @param currentlySelected - true if book is currently selected, false otherwise
   * @returns true if the API call succeeded, false if it failed
   */
  const toggleSelection = async (
    book: AnyBook,
    currentlySelected: boolean
  ): Promise<boolean> => {
    clearError();

    if (!token) {
      setErrorString("You must be signed in to select this book.");
      return false;
    }

    setIsLoading(true);
    try {
      const url = currentlySelected ? book.unselectBookUrl : book.selectBookUrl;

      if (!url) {
        throw new Error("No select/unselect URL available for this book.");
      }

      const method = currentlySelected ? "DELETE" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        },
        body:
          method === "POST" ? JSON.stringify({ bookId: book.id }) : undefined
      });

      if (!res.ok) {
        throw new Error(`server returned ${res.status}`);
      }

      // Update the user context's selected books list
      setSelected(book, book.id);
      return true;
    } catch (e: any) {
      handleError(e);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, toggleSelection };
}
