import React from "react";
import { render, screen, fixtures } from "test-utils";
import Feedback from "../Feedback";
import merge from "deepmerge";
import { LibraryData } from "interfaces";

const library: LibraryData = merge(fixtures.libraryData, {
  feedbackUrl: "https://test.fi/palaute/"
});

test("renders the iframe feedback page with correct src", () => {
  render(<Feedback />, {
    library: library
  });

  const iframe = screen.getByTitle("Feedback");
  expect(iframe).toBeInTheDocument();
  expect(iframe).toHaveAttribute("src", "https://test.fi/palaute/");
});
