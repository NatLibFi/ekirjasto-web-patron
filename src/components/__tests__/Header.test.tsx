import * as React from "react";
import Header from "../Header";
import { render } from "test-utils";

test("shows news and FAQ navigation for the current library", () => {
  const utils = render(<Header />);

  expect(utils.getByRole("link", { name: "News" })).toHaveAttribute(
    "href",
    "/testlib/news"
  );
  expect(utils.getByRole("link", { name: "FAQs" })).toHaveAttribute(
    "href",
    "/testlib/faq"
  );
});
