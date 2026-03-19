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
import { useTranslation } from "next-i18next";

const Footer: React.FC<{ className?: string }> = ({ className }) => {
  const library = useLibraryContext();
  const { privacyPolicy, tos, about } = library.libraryLinks;
  const title = library.catalogName;
  const { t } = useTranslation();

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
                {t("footer.privacyPolicy")}
              </FooterExternalLink>
            </ListItem>
          )}
          {tos && (
            <ListItem>
              <FooterExternalLink href={tos.href}>
                {t("footer.termsOfUse")}
              </FooterExternalLink>
            </ListItem>
          )}
          {about && (
            <ListItem>
              <FooterExternalLink href={about.href}>
                {t("footer.about")}{" "}
              </FooterExternalLink>
            </ListItem>
          )}
          <ListItem>
            <FooterExternalLink
              href={
                "https://www.kansalliskirjasto.fi/en/e-library/e-library-accessibility-statement"
              }
            >
              {t("footer.accessibilityStatement")}
            </FooterExternalLink>
          </ListItem>
        </FooterList>
      </div>
      <div sx={{ flex: "0 0 auto", mt: 5, mr: [3, 5] }}>
        <H3 sx={{ mt: 0 }}>{t("footer.patronSupport")}</H3>
        <FooterList>
          <ListItem>
            <FooterExternalLink
              href={
                "https://www.kansalliskirjasto.fi/en/e-library/e-library-instructions"
              }
            >
              {t("footer.helpWebsite")}
            </FooterExternalLink>
          </ListItem>
          <ListItem>
            <FooterExternalLink
              href={
                "https://www.kansalliskirjasto.fi/en/e-library/e-library-faq"
              }
            >
              {t("footer.faq")}
            </FooterExternalLink>
          </ListItem>
          <ListItem>
            <FooterExternalLink
              href={
                "https://www.kansalliskirjasto.fi/en/e-library/magazines-available-e-library"
              }
            >
              {t("footer.magazinesInELibrary")}
            </FooterExternalLink>
          </ListItem>
        </FooterList>
      </div>
      <div sx={{ flex: "0 0 auto", mt: 5, mr: [3, 5] }}>
        <H3 sx={{ mt: 0 }}>{t("footer.forLibrarians")}</H3>
        <FooterList>
          <ListItem>
            <FooterExternalLink
              href={
                "https://www.kansalliskirjasto.fi/en/e-library/municipalities-participating-e-library"
              }
            >
              {t("footer.municipalitiesParticipating")}
            </FooterExternalLink>
          </ListItem>
          <ListItem>
            <FooterExternalLink
              href={
                "https://www.kansalliskirjasto.fi/en/e-library/e-library-collection-policy"
              }
            >
              {t("footer.collectionPolicy")}
            </FooterExternalLink>
          </ListItem>
          <ListItem>
            <FooterExternalLink
              href={"https://www.kiwi.fi/spaces/ekirjasto/overview"}
            >
              {t("footer.moreForLibrarians")}
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
  const { t } = useTranslation();
  return (
    <div sx={{ maxWidth: 300, flex: "0 1 auto", mt: 5 }}>
      <H3 sx={{ mt: 0, display: "flex", alignItems: "center" }}>
        <SvgPhone sx={{ mr: 1 }} />
        {t("footer.downloadEkirjasto")}
      </H3>
      <Text>{t("footer.appDescription")}</Text>
      <div sx={{ width: "75%", overflow: "hidden", ml: -3 }}>
        <IosBadge sx={{ p: 3, pb: 0 }} />
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
