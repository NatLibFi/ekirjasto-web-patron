import * as React from "react";
import { render, fixtures } from "test-utils";
import merge from "deepmerge";
import Footer from "components/Footer";
import { LibraryData, OPDS1 } from "interfaces";
import mockConfig from "test-utils/mockConfig";

const link: OPDS1.Link = {
  href: "/wherever",
  rel: "navigation"
};
const libraryWithLinks: LibraryData = merge(fixtures.libraryData, {
  libraryLinks: {
    helpEmail: link,
    helpWebsite: link,
    privacyPolicy: link,
    tos: link,
    about: link,
    registration: link,
    libraryWebsite: link
  }
});

test("shows external links when present in state w/ apropriate attributes", () => {
  const utils = render(<Footer />, {
    library: libraryWithLinks
  });
  const expectExternalLink = (name: string) => {
    const lnk = utils.getByRole("link", { name });
    expect(lnk).toBeInTheDocument();
    expect(lnk).toHaveAttribute("href", "/wherever");
    expect(lnk).toHaveAttribute("rel", "noopener noreferrer");
    expect(lnk).toHaveAttribute("target", "__blank");
  };
  expectExternalLink("Library Homepage (Opens in a new tab)");
  expectExternalLink("Need a library card? (Opens in a new tab)");
  expectExternalLink("Email Support (Opens in a new tab)");
  expectExternalLink("Help Website (Opens in a new tab)");
  expectExternalLink("Privacy (Opens in a new tab)");
  expectExternalLink("Terms of Use (Opens in a new tab)");
  expectExternalLink("About (Opens in a new tab)");

  // my books nav link
  const myBooks = utils.getByRole("link", { name: /my books/i });
  expect(myBooks).toBeInTheDocument();
  expect(myBooks).toHaveAttribute("href", "/testlib/loans");
});

describe("toggling SimplyE Branding", () => {
  test("does not show simplyE callout when NEXT_PUBLIC_COMPANION_APP is 'openebooks'", () => {
    mockConfig({ companionApp: "openebooks" });

    const utils = render(<Footer />);

    expect(utils.queryByText(/download E-kirjasto/i)).not.toBeInTheDocument();

    expect(
      utils.queryByText(
        "Our mobile app lets you browse, borrow and read from our whole collection of ebooks, audiobooks and magazines right on your phone!"
      )
    ).not.toBeInTheDocument();

    // badges
    const iosbadge = utils.queryByText(
      /download E-kirjasto on the apple app store/i
    );

    expect(iosbadge).not.toBeInTheDocument();

    const googleBadge = utils.queryByText(
      /get E-kirjasto on the google play store/
    );
    expect(googleBadge).not.toBeInTheDocument();

    // my books nav link
    const myBooks = utils.queryByText(/my books/i);
    expect(myBooks).toBeInTheDocument();
    expect(myBooks).toHaveAttribute("href", "/testlib/loans");
  });

  test("shows simplyE callout when NEXT_PUBLIC_COMPANION_APP is 'simplye'", () => {
    mockConfig({ companionApp: "simplye" });

    const utils = render(<Footer />);

    expect(
      utils.getByRole("heading", {
        name: /download E-kirjasto/i
      })
    ).toBeInTheDocument();

    expect(
      utils.getByText(
        "Our mobile app lets you browse, borrow and read from our whole collection of ebooks, audiobooks and magazines right on your phone!"
      )
    ).toBeInTheDocument();

    // badges
    const iosbadge = utils.getByRole("link", {
      name: /download E-kirjasto on the apple app store/i
    });
    expect(iosbadge).toBeInTheDocument();
    expect(iosbadge).toHaveAttribute(
      "href",
      "https://apps.apple.com/fi/app/e-kirjasto/id6471490203"
    );

    const googleBadge = utils.getByRole("link", {
      name: /get E-kirjasto on the google play store/i
    });
    expect(googleBadge).toBeInTheDocument();
    expect(googleBadge).toHaveAttribute(
      "href",
      "https://play.google.com/store/apps/details?id=fi.kansalliskirjasto.ekirjasto"
    );

    // my books nav link
    const myBooks = utils.getByRole("link", {
      name: /my books/i
    });
    expect(myBooks).toBeInTheDocument();
    expect(myBooks).toHaveAttribute("href", "/testlib/loans");
  });
});
