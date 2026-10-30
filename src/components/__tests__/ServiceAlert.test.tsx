import * as React from "react";
import { fireEvent, render } from "test-utils";
import ServiceAlert from "../ServiceAlert";

const message =
  '<p><strong>Service update</strong></p><p>Read <a href="https://example.com">more information</a>.</p>';

test("renders, expands, and closes the configured service alert", () => {
  const utils = render(<ServiceAlert />, {
    router: { locale: "en" },
    library: {
      announcements: [{ id: "announcement-1", content: { en: message } }]
    }
  });

  const status = utils.getByRole("status");
  expect(status).toBeInTheDocument();
  expect(status).toHaveTextContent("Service update");
  expect(status).toHaveTextContent("Read more information.");
  expect(utils.getByRole("link", { name: "more information" })).toHaveAttribute(
    "href",
    "https://example.com"
  );

  const expandButton = utils.getByRole("button", { name: "Expand" });
  expect(expandButton).toHaveAttribute("aria-expanded", "false");
  fireEvent.click(expandButton);

  expect(
    utils.getByRole("button", { name: "Hide service notice" })
  ).toHaveAttribute("aria-expanded", "true");
  expect(status).toHaveTextContent("Service update");
  expect(status).toHaveTextContent("Read more information.");

  fireEvent.click(utils.getByRole("button", { name: "Dismiss notice" }));
  expect(utils.queryByRole("status")).not.toBeInTheDocument();
  expect(
    utils.queryByRole("button", { name: "Expand" })
  ).not.toBeInTheDocument();
});
