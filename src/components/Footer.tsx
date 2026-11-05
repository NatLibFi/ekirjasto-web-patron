/** @jsxRuntime classic */
/** @jsx jsx */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { jsx } from "theme-ui";
import * as React from "react";
import ExternalLink from "./ExternalLink";
import useLibraryContext from "./context/LibraryContext";
import List, { ListItem } from "./List";
import AppStoreBadge from "./logosAndBadges/AppStoreBadge";
import GooglePlayBadge from "./logosAndBadges/GooglePlayBadge";
import { APP_CONFIG } from "utils/env";
import { useTranslation } from "next-i18next";

const Footer: React.FC<{ className?: string }> = ({ className }) => {
  const library = useLibraryContext();
  const { t } = useTranslation();

  return (
    <footer
      sx={{
        bg: "ui.gray.extraLight",
        px: [3, 5],
        pb: 5,
        display: "flex",
        flexWrap: "wrap"
      }}
      className={className}
    >
      <div sx={{ flex: "0 0 auto", mt: 5, mr: 5 }}>
        <FooterList>
          <ListItem>
            <FooterExternalLink href={t("footer.hrefPrivacyPolicy")}>
              {t("footer.privacyPolicy")}
            </FooterExternalLink>
          </ListItem>

          <ListItem>
            <FooterExternalLink href={t("footer.hrefElibraryTermsOfUse")}>
              {t("footer.termsOfUse")}
            </FooterExternalLink>
          </ListItem>

          <ListItem>
            <FooterExternalLink
              href={t("footer.hrefElibraryAccessibilityStatement")}
            >
              {t("footer.accessibilityStatement")}
            </FooterExternalLink>
          </ListItem>

          <ListItem>
            <FooterExternalLink href={t("footer.hrefElibraryAlwaysWithYou")}>
              {t("footer.about")}
            </FooterExternalLink>
          </ListItem>

          <ListItem>
            <FooterExternalLink href={t("footer.hrefElibraryCollectionPolicy")}>
              {t("footer.collectionPolicy")}
            </FooterExternalLink>
          </ListItem>
        </FooterList>
      </div>

      <div sx={{ flex: "0 0 auto", mt: 5, mr: [3, 5] }}>
        <FooterList>
          <ListItem>
            <FooterExternalLink
              href={t("footer.hrefFeedback", {
                librarySlug: library.slug
              })}
            >
              {t("footer.feedback")}
            </FooterExternalLink>
          </ListItem>

          <ListItem>
            <FooterExternalLink href={t("footer.hrefElibraryInstructions")}>
              {t("footer.helpWebsite")}
            </FooterExternalLink>
          </ListItem>

          <ListItem>
            <FooterExternalLink href={t("footer.hrefElibraryFAQ")}>
              {t("footer.faq")}
            </FooterExternalLink>
          </ListItem>
        </FooterList>
      </div>

      <div sx={{ flex: "1 1 0" }} />

      {APP_CONFIG.companionApp === "E-kirjasto" && <DownloadSimplyECallout />}
    </footer>
  );
};

const DownloadSimplyECallout = () => {
  return (
    <div sx={{ maxWidth: 310, flex: "0 1 auto", mt: 5 }}>
      <div
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
          margin: 10,
          alignItems: "center",
          justifyContent: "left"
        }}
      >
        <AppStoreBadge />
        <GooglePlayBadge />
      </div>
    </div>
  );
};

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
