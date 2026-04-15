/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "theme-ui";
import * as React from "react";
import { AppLocale, normaliseLocale } from "../../../appLocales";
import SvgDownloadOnTheAppStoreBadgeEN from "icons/DownloadOnTheAppStoreBadgeEN";
import SvgDownloadOnTheAppStoreBadgeFI from "icons/DownloadOnTheAppStoreBadgeFI";
import SvgDownloadOnTheAppStoreBadgeSV from "icons/DownloadOnTheAppStoreBadgeSV";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

// define the URL that leads to E-kirjasto page on App Store
const EKIRJASTO_APP_STORE_URL =
  "https://apps.apple.com/fi/app/e-kirjasto/id6471490203";

// define map for all language versions of App Store badge
const localisedBadges: Record<string, React.FC> = {
  fi: SvgDownloadOnTheAppStoreBadgeFI,
  sv: SvgDownloadOnTheAppStoreBadgeSV,
  en: SvgDownloadOnTheAppStoreBadgeEN
};

// define props for the AppStoreBadge component
interface AppStoreBadgeProps {
  props: React.ComponentProps<"a">;
}

const AppStoreBadge: React.FC<AppStoreBadgeProps> = props => {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const normalisedLocale: AppLocale = normaliseLocale(locale);

  // match the badge language version with current locale
  const BadgeComponent = localisedBadges[normalisedLocale];

  return (
    <a
      rel="noopener noreferrer"
      target="_blank"
      href={EKIRJASTO_APP_STORE_URL}
      aria-label={t("badges.ariaLabelForAppStoreLink")}
      sx={{
        display: "block",
        width: 160,
        height: 40,
        paddingLeft: 1,
        margin: 10
      }}
      {...props}
    >
      {/* render the App Store badge component */}
      <BadgeComponent />
    </a>
  );
};

export default AppStoreBadge;
