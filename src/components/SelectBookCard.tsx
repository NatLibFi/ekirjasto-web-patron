/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "theme-ui";
import * as React from "react";
import { AnyBook } from "interfaces";
import useSelectBook from "hooks/useSelectBook";
import Button from "components/Button";
import { Text } from "components/Text";
import useUser from "components/context/UserContext";

interface SelectBookProps {
  book: AnyBook;
}

const SelectBookButton: React.FC<{
  book: AnyBook;
  isSelected: boolean;
  isLoading: boolean;
  onClick: () => Promise<void>;
  error?: string;
}> = ({ book, isSelected, isLoading, onClick, error }) => {
  const loadingText = isSelected
    ? "Removing from Favorites..."
    : "Adding to Favorites...";
  const buttonLabel = isSelected ? "Remove from Favorites" : "Add to Favorites";

  return (
    <div>
      <Button
        onClick={onClick}
        loading={isLoading}
        loadingText={loadingText}
        aria-label={
          isSelected
            ? `Remove ${book.title} from Favorites`
            : `Add ${book.title} to Favorites`
        }
      >
        {buttonLabel}
      </Button>
      {error && <Text sx={{ color: "ui.error", fontSize: "-1" }}>{error}</Text>}
    </div>
  );
};

const SelectBookCard: React.FC<SelectBookProps> = ({ book }) => {
  const { isLoading, toggleSelection } = useSelectBook();
  const { selected } = useUser();
  // Initial selection state is checked against the user's selected books
  const isSelected =
    selected?.some(selectedBook => book?.id === selectedBook.id) ?? false;

  const handleClick = async () => {
    await toggleSelection(book, isSelected);
  };

  return (
    <div aria-label="Favorite book selection">
      <SelectBookButton
        book={book}
        isSelected={isSelected}
        isLoading={isLoading}
        onClick={handleClick}
      />
    </div>
  );
};

export default SelectBookCard;
