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
    // check just the beginning of link url
    expect(lnk).toHaveAttribute(
      "href",
      expect.stringMatching(
        /^https:\/\/www\.kansalliskirjasto\.fi\/en\/e-library\//
      )
    );
    expect(lnk).toHaveAttribute("rel", "noopener noreferrer");
    expect(lnk).toHaveAttribute("target", "__blank");
  };

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
        name: /download the e-library app/i
      })
    ).toBeInTheDocument();

    expect(
      utils.getByText(
        "Read e-books and magazines, and listen to audiobooks on your phone or tablet! Download the E-library app from your mobile device’s app store."
      )
    ).toBeInTheDocument();

    // badges
    const appStoreBadge = utils.getByRole("link", {
      name: /Download E-library on the App Store/i
    });
    expect(appStoreBadge).toBeInTheDocument();
    expect(appStoreBadge).toHaveAttribute(
      "href",
      "https://apps.apple.com/fi/app/e-kirjasto/id6471490203"
    );

    const googlePlayBadge = utils.getByRole("link", {
      name: /Get E-library on Google Play/i
    });
    expect(googlePlayBadge).toBeInTheDocument();
    expect(googlePlayBadge).toHaveAttribute(
      "href",
      "https://play.google.com/store/apps/details?id=fi.kansalliskirjasto.ekirjasto"
    );
  });
});

test("shows NatLibFi logo in footer", () => {
  const utils = render(<Footer />);
  const natLibFiLink = utils.getByRole("link", {
    name: /national library of finland/i
  });

  expect(natLibFiLink).toBeInTheDocument();
});
