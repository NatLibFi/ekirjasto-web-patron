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

test("renders only the supported announcement HTML and attributes", () => {
  const markup = [
    "<p>Paragraph<br>line break <strong>bold</strong> <em>italic</em></p>",
    "<h1>Heading 1</h1><h2>Heading 2</h2><h3>Heading 3</h3><h4>Heading 4</h4>",
    "<ul><li>Unordered item</li></ul><ol><li>Ordered item</li></ol>",
    '<p><a href="https://example.test" title="Web link">Web</a> ',
    '<a href="mailto:help@example.test">Email</a> ',
    '<a href="javascript:alert(1)" target="_blank">Unsafe</a></p>',
    "<script>window.alert('unsafe')</script><div>Unwrapped text</div>"
  ].join("");
  const utils = render(<ServiceAlert />, {
    router: { locale: "en" },
    library: {
      announcements: [{ id: "announcement-html", content: { en: markup } }]
    }
  });

  const status = utils.getByRole("status");
  const supportedTags = [
    "p",
    "br",
    "strong",
    "em",
    "h1",
    "h2",
    "h3",
    "h4",
    "ul",
    "ol",
    "li",
    "a"
  ];
  supportedTags.forEach(tag => {
    expect(status.querySelector(tag)).not.toBeNull();
  });
  expect(status.querySelector("a[title='Web link']")).toHaveAttribute(
    "href",
    "https://example.test"
  );
  expect(status.querySelector("a[href^='mailto:']")).toHaveAttribute(
    "href",
    "mailto:help@example.test"
  );
  expect(status.querySelector("a[target]")).toBeNull();
  expect(status.querySelector("a[href^='javascript:']")).toBeNull();
  expect(status.querySelector("script")).toBeNull();
  expect(status.firstElementChild?.querySelector("div")).toBeNull();
  expect(status).toHaveTextContent("Unwrapped text");
});
