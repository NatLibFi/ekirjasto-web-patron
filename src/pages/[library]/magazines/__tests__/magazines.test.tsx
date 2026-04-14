import * as React from "react";
import { render, fixtures } from "test-utils";
import MagazinesFixedPage from "../index";

test("unauthenticated user sees unauthorized message", () => {
  const utils = render(<MagazinesFixedPage library={fixtures.libraryData} />);
  // Check that the unauthorized message is shown
  expect(
    utils.queryByText("You need to be signed in to view this page.")
  ).toBeInTheDocument();
});
