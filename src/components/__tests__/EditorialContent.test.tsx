/* eslint-disable camelcase */
import * as React from "react";
import useSWR from "swr";
import { EditorialDetail, EditorialList } from "../EditorialContent";
import { fixtures, render } from "test-utils";
import { makeSwrResponse } from "test-utils/mockSwr";

jest.mock("swr");
jest.mock("components/LayoutPage", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  )
}));

const mockedSWR = useSWR as jest.MockedFunction<typeof useSWR>;

const news = {
  id: "news-1",
  group_id: "news-group-1",
  type: "news" as const,
  title: "Library news",
  intro_html: "<p>Intro</p>",
  body_html: "<p>Body <script>alert('xss')</script></p>",
  language: "en",
  published_at: "2026-01-02T03:04:05Z",
  updated_at: "2026-01-03T03:04:05Z",
  slug: "library-news"
};

const library = {
  editorialContentLinks: {
    news: { rel: "news" as const, href: "https://content.test/news" },
    faq: { rel: "faq" as const, href: "https://content.test/faq" }
  }
};

const editorialLibrary = { ...fixtures.libraryData, ...library };

beforeEach(() => {
  mockedSWR.mockReset();
});

test("renders a news list and sanitizes introductory HTML", () => {
  mockedSWR.mockReturnValue(
    makeSwrResponse({ data: { content: [news] } }) as ReturnType<typeof useSWR>
  );

  const utils = render(
    <EditorialList library={editorialLibrary} type="news" />,
    {
      library
    }
  );

  expect(utils.getByRole("heading", { name: "News" })).toBeInTheDocument();
  expect(utils.getByRole("link", { name: "Library news" })).toHaveAttribute(
    "href",
    "/testlib/news/news-group-1"
  );
  expect(utils.queryByText("alert('xss')")).not.toBeInTheDocument();
});

test("renders FAQ answers as expandable sections", () => {
  mockedSWR.mockReturnValue(
    makeSwrResponse({
      data: {
        content: [{ ...news, type: "faq" as const, title: "Question" }]
      }
    }) as ReturnType<typeof useSWR>
  );

  const utils = render(
    <EditorialList library={editorialLibrary} type="faq" />,
    {
      library
    }
  );

  expect(utils.getByText("Question").closest("details")).toBeInTheDocument();
});

test("renders unavailable detail content for a not-found response", () => {
  mockedSWR.mockReturnValue(
    makeSwrResponse({
      error: Object.assign(new Error("Not found"), { status: 404 })
    }) as ReturnType<typeof useSWR>
  );

  const utils = render(
    <EditorialDetail library={editorialLibrary} identifier="missing" />,
    { library }
  );

  expect(
    utils.getByText("The content is not available in the selected language.")
  ).toBeInTheDocument();
});
