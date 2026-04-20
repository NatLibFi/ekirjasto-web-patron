/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "theme-ui";
import * as React from "react";
import { AnyBook } from "interfaces";
import useSelectBook from "hooks/useSelectBook";
import Button from "components/Button";
import { Text } from "components/Text";
import useUser from "components/context/UserContext";
import { useTranslation } from "next-i18next";

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
  const { t } = useTranslation();

  const loadingText = isSelected
    ? t("selectBookCard.removingFromFavorites")
    : t("selectBookCard.addingToFavorites");
  const buttonLabel = isSelected
    ? t("selectBookCard.removeFromFavorites")
    : t("selectBookCard.addToFavorites");

  return (
    <div sx={{ mt: 1, mb: 1 }}>
      <Button
        onClick={onClick}
        loading={isLoading}
        loadingText={loadingText}
        aria-label={
          isSelected
            ? t("selectBookCard.removeFromFavoritesAriaLabel", {
                bookTitle: book.title
              })
            : t("selectBookCard.addToFavoritesAriaLabel", {
                bookTitle: book.title
              })
        }
      >
        {buttonLabel}
      </Button>
      {/* render the possible error message below the button */}
      {error && (
        <p sx={{ mt: 1, mb: 1 }}>
          <Text sx={{ color: "ui.error" }}>{error}</Text>
        </p>
      )}
    </div>
  );
};

const SelectBookCard: React.FC<SelectBookProps> = ({ book }) => {
  const { t } = useTranslation();
  const { isLoading, error, toggleSelection } = useSelectBook();
  const { selected } = useUser();
  // Initial selection state is checked against the user's selected books
  const isSelected =
    selected?.some(selectedBook => book?.id === selectedBook.id) ?? false;

  const handleClick = async () => {
    await toggleSelection(book, isSelected);
  };

  return (
    <div aria-label={t("selectBookCard.ariaLabel")}>
      <SelectBookButton
        book={book}
        isSelected={isSelected}
        isLoading={isLoading}
        onClick={handleClick}
        error={error ?? undefined}
      />
    </div>
  );
};

export default SelectBookCard;
