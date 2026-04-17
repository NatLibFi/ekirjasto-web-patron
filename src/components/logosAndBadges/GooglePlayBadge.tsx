/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "theme-ui";
import * as React from "react";
import { AppLocale, normaliseLocale } from "../../../appLocales";
import SvgGetItOnGooglePlayBadgeEN from "icons/GetItOnGooglePlayBadgeEN";
import SvgGetItOnGooglePlayBadgeFI from "icons/GetItOnGooglePlayBadgeFI";
import SvgGetItOnGooglePlayBadgeSV from "icons/GetItOnGooglePlayBadgeSV";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

// define the URL that leads to E-kirjasto page on Google Play
const EKIRJASTO_GOOGLE_PLAY_URL =
  "https://play.google.com/store/apps/details?id=fi.kansalliskirjasto.ekirjasto";

// define map for all language versions of Google Play badge
const localisedBadges: Record<string, React.FC> = {
  fi: SvgGetItOnGooglePlayBadgeFI,
  sv: SvgGetItOnGooglePlayBadgeSV,
  en: SvgGetItOnGooglePlayBadgeEN
};

// define props for the GooglePlayBadge component
interface GooglePlayBadgeProps {
  props: React.ComponentProps<"a">;
}

const GooglePlayBadge: React.FC<GooglePlayBadgeProps> = props => {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const normalisedLocale: AppLocale = normaliseLocale(locale);

  // match the badge language version with current locale
  const BadgeComponent = localisedBadges[normalisedLocale];

  return (
    <a
      rel="noopener noreferrer"
      target="_blank"
      href={EKIRJASTO_GOOGLE_PLAY_URL}
      aria-label={t("badges.ariaLabelForGooglePlayLink")}
      sx={{
        display: "block",
        width: 160,
        height: 40,
        margin: 10,
        transform: "scale(0.95)"
      }}
      {...props}
    >
      <BadgeComponent />
    </a>
  );
};
export default GooglePlayBadge;
