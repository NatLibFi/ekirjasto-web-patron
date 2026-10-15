import * as React from "react";
import { render, fireEvent } from "test-utils";
import BreadcrumbBar from "../BreadcrumbBar";

// we make this a function because the breadcrumbs bar pops the last
// item, which is a mutation that would leak across tests
const breadcrumbs = () => [
  {
    text: "All Books",
    url: "url-allbooks"
  },
  {
    url: "url-lib",
    text: "lib"
  },
  {
    url: "last-url",
    text: "Last Item"
  }
];

test("shows clicklable breadcrumbs", () => {
  const utils = render(<BreadcrumbBar breadcrumbs={breadcrumbs()} />);

  const allBooks = utils.getByText("All Books");
  expect(allBooks.closest("a")).toHaveAttribute(
    "href",
    "/testlib/collection/url-allbooks"
  );

  const libraryCrumb = utils.getByText("lib");
  expect(libraryCrumb.closest("a")).toHaveAttribute(
    "href",
    "/testlib/collection/url-lib"
  );

  // the last item isn't a link
  const lastItem = utils.getByText("Last Item");
  expect(lastItem.closest("a")).toBeNull();
});

test("adds current location", () => {
  const utils = render(
    <BreadcrumbBar breadcrumbs={breadcrumbs()} currentLocation="We are here" />
  );

  const lastItem = utils.getByText("Last Item");
  expect(lastItem.closest("a")).toHaveAttribute(
    "href",
    "/testlib/collection/last-url"
  );

  const currentLoc = utils.getByText("We are here");
  expect(currentLoc.closest("a")).toBeNull();
});

test("renders children", () => {
  const utils = render(
    <BreadcrumbBar>
      <div>Hi Im here</div>
    </BreadcrumbBar>
  );
  expect(utils.getByText("Hi Im here")).toBeInTheDocument();
});

test("dismisses the notice without hiding the breadcrumbs", () => {
  const utils = render(<BreadcrumbBar currentLocation="Current page" />, {
    library: { serviceAlert: { enabled: true } }
  });

  expect(utils.getByRole("status")).toHaveTextContent(
    "Dismissible E-library service disruption notice"
  );
  fireEvent.click(utils.getByRole("button", { name: "Dismiss notice" }));

  expect(utils.queryByRole("status")).not.toBeInTheDocument();
  expect(utils.getByText("Current page")).toBeInTheDocument();
});

test.each([
  [undefined, "Dismissible E-library service disruption notice"],
  [{ enabled: false, message: "Test notice" }, "Test notice"]
])(
  "shows the service alert for testing regardless of the setting: %p",
  (serviceAlert, expected) => {
    const utils = render(<BreadcrumbBar />, { library: { serviceAlert } });
    expect(utils.getByRole("status")).toHaveTextContent(expected);
  }
);

test.each([
  ["Service unavailable", "Service unavailable"],
  [{ en: "English notice", fi: "Finnish notice" }, "English notice"],
  [{ fi: "Finnish notice" }, "Dismissible E-library service disruption notice"],
  ["   ", "Dismissible E-library service disruption notice"]
])("uses the configured message or fallback: %p", (message, expected) => {
  const utils = render(<BreadcrumbBar />, {
    router: { locale: "en" },
    library: { serviceAlert: { enabled: true, message } }
  });
  expect(utils.getByRole("status")).toHaveTextContent(expected);
});
