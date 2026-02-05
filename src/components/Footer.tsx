/** @jsxRuntime classic */
/** @jsx jsx */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { jsx } from "theme-ui";
import * as React from "react";
import ExternalLink from "./ExternalLink";
import useLibraryContext from "./context/LibraryContext";
import List, { ListItem } from "./List";
import { H3, Text } from "./Text";
import SvgPhone from "icons/Phone";
import IosBadge from "./storeBadges/IosBadge";
import GooglePlayBadge from "./storeBadges/GooglePlayBadge";
import { APP_CONFIG } from "utils/env";

const Footer: React.FC<{ className?: string }> = ({ className }) => {
  const library = useLibraryContext();
  const { privacyPolicy, tos, about } = library.libraryLinks;
  const title = library.catalogName;

  return (
    <footer
      sx={{
        bg: "ui.gray.extraLight",
        px: [3, 5],
        pb: 7,
        display: "flex",
        flexWrap: "wrap"
      }}
      className={className}
    >
      <div sx={{ flex: "0 0 auto", mt: 5, mr: 5 }}>
        <H3 sx={{ mt: 0, maxWidth: "100%" }}>{title}</H3>
        <FooterList>
          {privacyPolicy && (
            <ListItem>
              <FooterExternalLink href={privacyPolicy.href}>
                Privacy Policy
              </FooterExternalLink>
            </ListItem>
          )}
          {tos && (
            <ListItem>
              <FooterExternalLink href={tos.href}>
                Terms of Use
              </FooterExternalLink>
            </ListItem>
          )}
          {about && (
            <ListItem>
              <FooterExternalLink href={about.href}>About</FooterExternalLink>
            </ListItem>
          )}
          <ListItem>
            <FooterExternalLink
              href={
                "https://www.kansalliskirjasto.fi/en/e-library/e-library-accessibility-statement"
              }
            >
              Accessibility Statement
            </FooterExternalLink>
          </ListItem>
        </FooterList>
      </div>
      <div sx={{ flex: "0 0 auto", mt: 5, mr: [3, 5] }}>
        <H3 sx={{ mt: 0 }}>Patron Support</H3>
        <FooterList>
          <ListItem>
            <FooterExternalLink
              href={
                "https://www.kansalliskirjasto.fi/en/e-library/e-library-instructions"
              }
            >
              Help Website
            </FooterExternalLink>
          </ListItem>
          <ListItem>
            <FooterExternalLink
              href={
                "https://www.kansalliskirjasto.fi/en/e-library/e-library-faq"
              }
            >
              Frequently Asked Questions
            </FooterExternalLink>
          </ListItem>
          <ListItem>
            <FooterExternalLink
              href={
                "https://www.kansalliskirjasto.fi/en/e-library/magazines-available-e-library"
              }
            >
              Magazines in E-library
            </FooterExternalLink>
          </ListItem>
        </FooterList>
      </div>
      <div sx={{ flex: "0 0 auto", mt: 5, mr: [3, 5] }}>
        <H3 sx={{ mt: 0 }}>For Librarians</H3>
        <FooterList>
          <ListItem>
            <FooterExternalLink
              href={
                "https://www.kansalliskirjasto.fi/en/e-library/municipalities-participating-e-library"
              }
            >
              Municipalities participating E-library
            </FooterExternalLink>
          </ListItem>
          <ListItem>
            <FooterExternalLink
              href={
                "https://www.kansalliskirjasto.fi/en/e-library/e-library-collection-policy"
              }
            >
              Collection Policy
            </FooterExternalLink>
          </ListItem>
          <ListItem>
            <FooterExternalLink
              href={"https://www.kiwi.fi/spaces/ekirjasto/overview"}
            >
              More For Librarians
            </FooterExternalLink>
          </ListItem>
        </FooterList>
      </div>
      <div sx={{ flex: "1 1 0" }} />
      {APP_CONFIG.companionApp === "E-kirjasto" && <DownloadSimplyECallout />}
    </footer>
  );
};

const DownloadSimplyECallout = () => (
  <div sx={{ maxWidth: 300, flex: "0 1 auto", mt: 5 }}>
    <H3 sx={{ mt: 0, display: "flex", alignItems: "center" }}>
      <SvgPhone sx={{ mr: 1 }} />
      Download E-kirjasto
    </H3>
    <Text>
      Our mobile app lets you browse, borrow and read from our whole collection
      of ebooks, audiobooks and magazines right on your phone!
    </Text>
    <div sx={{ width: "75%", overflow: "hidden", ml: -3 }}>
      <IosBadge sx={{ p: 3, pb: 0 }} />
      <GooglePlayBadge />
    </div>
  </div>
);

const FooterList = (props: React.ComponentProps<typeof List>) => (
  <List
    sx={{
      "&>li": {
        my: 2
      }
    }}
    {...props}
  />
);

const FooterExternalLink: React.FC<React.HTMLProps<HTMLAnchorElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <ExternalLink sx={{ color: "ui.black" }} className={className} {...props}>
      {children}
    </ExternalLink>
  );
};

export default Footer;
