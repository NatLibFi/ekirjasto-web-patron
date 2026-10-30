import fetchMock from "jest-fetch-mock";
import {
  fetchEditorialContent,
  localizedEditorialUrl
} from "../editorialContent";

describe("localizedEditorialUrl", () => {
  test("adds or replaces the language query parameter", () => {
    expect(
      localizedEditorialUrl("https://content.test/news?type=published", "fi")
    ).toBe("https://content.test/news?type=published&language=fi");

    expect(
      localizedEditorialUrl("https://content.test/news?language=en", "sv")
    ).toBe("https://content.test/news?language=sv");
  });

  test("returns null when no content URL is available", () => {
    expect(localizedEditorialUrl(undefined, "fi")).toBeNull();
  });
});

describe("fetchEditorialContent", () => {
  test("fetches and returns editorial items", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({ content: [{ id: "1", title: "News" }] })
    );

    await expect(
      fetchEditorialContent("https://content.test/news", "fi")
    ).resolves.toEqual([{ id: "1", title: "News" }]);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://content.test/news?language=fi"
    );
  });

  test("returns an empty list when no URL is available", async () => {
    await expect(fetchEditorialContent("", "fi")).resolves.toEqual([]);
  });

  test("throws when the content endpoint fails", async () => {
    fetchMock.mockResponseOnce("", { status: 500 });

    await expect(
      fetchEditorialContent("https://content.test/news", "fi")
    ).rejects.toThrow("Could not load editorial content");
  });
});
