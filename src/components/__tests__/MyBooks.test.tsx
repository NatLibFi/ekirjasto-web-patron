import * as React from "react";
import { render, fixtures, fireEvent } from "../../test-utils";
import { MyBooks } from "../MyBooks";
import { AuthCredentials } from "opds-web-client/lib/interfaces";
import merge from "deepmerge";
import { State } from "opds-web-client/lib/state";
import { mockPush } from "../../test-utils/mockNextRouter";

const mockSetCollectionAndBook = jest.fn().mockReturnValue(Promise.resolve({}));

test("shows message and button when not authenticated", () => {
  const utils = render(
    <MyBooks setCollectionAndBook={mockSetCollectionAndBook} />
  );

  expect(
    utils.getByText("You need to be signed in to view this page.")
  ).toBeInTheDocument();
});

const authCredentials: AuthCredentials = {
  provider: "auth-provider",
  credentials: "auth-credentials"
};

const emptyWithAuth: State = merge(fixtures.initialState, {
  auth: {
    credentials: authCredentials
  }
});

test("displays empty state when empty and signed in", () => {
  const utils = render(
    <MyBooks setCollectionAndBook={mockSetCollectionAndBook} />,
    { initialState: emptyWithAuth }
  );

  expect(
    utils.queryByText("You need to be signed in to view this page.")
  ).toBeFalsy();

  expect(
    utils.getByText(
      "Your books will show up here when you have any loaned or on hold."
    )
  ).toBeInTheDocument();

  expect(utils.getByText("Sign Out")).toBeInTheDocument();
});

test("sign out clears state and goes home", () => {
  const utils = render(
    <MyBooks setCollectionAndBook={mockSetCollectionAndBook} />,
    { initialState: emptyWithAuth }
  );

  const signOut = utils.getByText("Sign Out");
  fireEvent.click(signOut);

  expect(mockPush).toHaveBeenCalledTimes(1);
  expect(mockPush).toHaveBeenCalledWith("/", undefined);

  expect(utils.store.getState().auth.credentials).toBeFalsy();
  /**
   * even though the location shows home, we should still be able to assert on the MyBooks
   * because we are rendering it no matter what route we are on
   */
  expect(
    utils.getByText("You need to be signed in to view this page.")
  ).toBeInTheDocument();
});

const withAuthAndBooks: State = merge(fixtures.initialState, {
  auth: {
    credentials: authCredentials
  },
  collection: {
    data: {
      books: fixtures.makeBooks(10)
    }
  }
});

test("displays books when signed in with data", () => {
  const utils = render(
    <MyBooks setCollectionAndBook={mockSetCollectionAndBook} />,
    { initialState: withAuthAndBooks }
  );

  expect(
    utils.queryByText("You need to be signed in to view this page.")
  ).toBeFalsy();

  expect(
    utils.queryByText(
      "Your books will show up here when you have any loaned or on hold."
    )
  ).toBeFalsy();

  expect(utils.getByText(fixtures.makeBook(0).title)).toBeInTheDocument();
  expect(utils.getByText(fixtures.makeBook(9).title)).toBeInTheDocument();

  expect(
    utils.getByText(fixtures.makeBook(0).authors.join(", "))
  ).toBeInTheDocument();
});

test("sets collection and book", () => {
  render(<MyBooks setCollectionAndBook={mockSetCollectionAndBook} />, {
    initialState: withAuthAndBooks
  });

  expect(mockSetCollectionAndBook).toHaveBeenCalledTimes(1);
  expect(mockSetCollectionAndBook).toHaveBeenCalledWith(
    "http://test-cm.com/catalogUrl/loans",
    undefined
  );
});

/**
 * - toggles between list and gallery view
 * - shows the reserved button
 */

const loading: State = merge(fixtures.initialState, {
  auth: {
    credentials: authCredentials
  },
  collection: {
    isFetching: true
  }
});

test("shows loading state", () => {
  const utils = render(
    <MyBooks setCollectionAndBook={mockSetCollectionAndBook} />,
    {
      initialState: loading
    }
  );

  expect(
    utils.getByRole("heading", { name: "Loading..." })
  ).toBeInTheDocument();
});
