/** @jsxRuntime classic */
/** @jsx jsx */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { jsx } from "theme-ui";
import * as React from "react";

const GooglePlayBadge = (props: React.ComponentProps<"a">) => {
  return (
    <a
      rel="noopener noreferrer"
      target="__blank"
      aria-label="Get E-kirjasto on the Google Play Store"
      href="https://play.google.com/store/apps/details?id=fi.kansalliskirjasto.ekirjasto"
      sx={{ display: "block" }}
      {...props}
    >
      <img
        alt="Get it on Google Play"
        sx={{ width: "100%" }}
        src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
      />
    </a>
  );
};
export default GooglePlayBadge;
