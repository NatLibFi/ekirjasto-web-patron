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

  expectExternalLink("Email Support (Opens in a new tab)");
  expectExternalLink("Help Website (Opens in a new tab)");
  expectExternalLink("Privacy Policy (Opens in a new tab)");
  expectExternalLink("Terms of Use (Opens in a new tab)");
  expectExternalLink("About (Opens in a new tab)");
});

describe("toggling SimplyE Branding", () => {
  test("shows E-kirjasto callout when NEXT_PUBLIC_COMPANION_APP is 'E-kirjasto'", () => {
    mockConfig({ companionApp: "E-kirjasto" });

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
  });
});
