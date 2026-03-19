/** @jsxRuntime classic */
/** @jsx jsx */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { jsx } from "theme-ui";
import * as React from "react";
import { useTranslation } from "next-i18next";

const GooglePlayBadge = (props: React.ComponentProps<"a">) => {
  const { t } = useTranslation();

  return (
    <a
      rel="noopener noreferrer"
      target="__blank"
      aria-label={t("storeBadges.ariaLabelForPlayStoreLink")}
      href="https://play.google.com/store/apps/details?id=fi.kansalliskirjasto.ekirjasto"
      sx={{ display: "block" }}
      {...props}
    >
      <img
        alt={t("storeBadges.altForPlayStoreImage")}
        sx={{ width: "100%" }}
        src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
      />
    </a>
  );
};
export default GooglePlayBadge;
