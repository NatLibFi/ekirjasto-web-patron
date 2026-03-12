import React from "react";
import SelectBookCard from "../SelectBookCard"; // Adjust the import path as necessary
import * as UserContext from "components/context/UserContext"; // Import the UserContext module
import useSelectBook from "hooks/useSelectBook";
import { FulfillableBook } from "interfaces";
import { fixtures, screen, render, fireEvent } from "test-utils";

// Mock the hooks
jest.mock("hooks/useSelectBook");
jest.mock("components/context/UserContext");

const mockToggleSelection = jest.fn();

const testBook = fixtures.mergeBook<FulfillableBook>({
  ...fixtures.book,
  status: "fulfillable",
  fulfillmentLinks: [],
  revokeUrl: "/revoke"
});

// Create a type for the mocked return value of useSelectBook
type UseSelectBookResult = {
  isLoading: boolean;
  toggleSelection: (
    book: FulfillableBook,
    isSelected: boolean
  ) => Promise<void>;
};

describe("SelectBookCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockUseUser = UserContext.default as jest.Mock;

  it("displays 'Remove from Favorites' when the book is selected", () => {
    // Setup the mock for useUser: one book selected
    mockUseUser.mockReturnValue({
      selected: [{ id: testBook.id, title: testBook.title }]
    });

    (useSelectBook as jest.Mock).mockReturnValue({
      isLoading: false,
      toggleSelection: mockToggleSelection
    } as UseSelectBookResult);

    render(<SelectBookCard book={testBook} />);

    expect(
      screen.getByRole("button", {
        name: `Remove ${testBook.title} from Favorites`
      })
    ).toBeInTheDocument();
  });

  it("displays 'Add to Favorites' when the book is not selected", () => {
    // Setup the mock for useUser: no books selected
    mockUseUser.mockReturnValue({
      selected: []
    });

    (useSelectBook as jest.Mock).mockReturnValue({
      isLoading: false,
      toggleSelection: mockToggleSelection
    } as UseSelectBookResult);

    render(<SelectBookCard book={testBook} />);

    expect(
      screen.getByRole("button", { name: `Add ${testBook.title} to Favorites` })
    ).toBeInTheDocument();
  });

  it("initially checks the useUser hook's selected to check for any selected books", () => {
    // Setup the mock for useUser: one book selected
    mockUseUser.mockReturnValue({
      selected: [{ id: testBook.id, title: testBook.title }]
    });

    (useSelectBook as jest.Mock).mockReturnValue({
      isLoading: false,
      toggleSelection: mockToggleSelection
    } as UseSelectBookResult);

    const { rerender } = render(<SelectBookCard book={testBook} />);

    // Verify initial render
    expect(
      screen.getByRole("button", {
        name: `Remove ${testBook.title} from Favorites`
      })
    ).toBeInTheDocument();

    // Change selected state and rerender
    mockUseUser.mockReturnValue({
      selected: [] // No books selected
    });

    rerender(<SelectBookCard book={testBook} />);

    // Verify button label updates
    expect(
      screen.getByRole("button", { name: `Add ${testBook.title} to Favorites` })
    ).toBeInTheDocument();
  });

  it("calls toggleSelection when the button is clicked", async () => {
    mockUseUser.mockReturnValue({
      selected: [] // No books selected
    });

    (useSelectBook as jest.Mock).mockReturnValue({
      isLoading: false,
      toggleSelection: mockToggleSelection
    } as UseSelectBookResult);

    render(<SelectBookCard book={testBook} />);

    const button = screen.getByRole("button", {
      name: `Add ${testBook.title} to Favorites`
    });
    fireEvent.click(button);

    expect(mockToggleSelection).toHaveBeenCalledWith(testBook, false);
  });
});
