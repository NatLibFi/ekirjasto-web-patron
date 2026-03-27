/** @jsxRuntime classic */
/** @jsx jsx */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { jsx } from "theme-ui";
import * as React from "react";
import SvgIosBadge from "icons/IosBadge";
import { useTranslation } from "next-i18next";

const IosBadge = (props: React.ComponentProps<"a">) => {
  const { t } = useTranslation();

  return (
    <a
      rel="noopener noreferrer"
      target="__blank"
      href="https://apps.apple.com/fi/app/e-kirjasto/id6471490203"
      aria-label={t("storeBadges.ariaLabelForAppStoreLink")}
      sx={{ display: "block" }}
      {...props}
    >
      <SvgIosBadge />
    </a>
  );
};
export default IosBadge;
