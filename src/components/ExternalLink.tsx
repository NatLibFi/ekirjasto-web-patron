/** @jsxRuntime classic */
/** @jsx jsx */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { jsx } from "theme-ui";
import * as React from "react";
import { AnchorButton } from "./Button";
import { useTranslation } from "next-i18next";
import { VisuallyHidden } from "@ariakit/react";
import ExternalLinkIcon from "icons/ExternalLink";

const ExternalLink: React.FC<React.ComponentPropsWithoutRef<"a">> = ({
  children,
  ...props
}) => {
  const { t } = useTranslation();

  return (
    <AnchorButton
      variant="link"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      {children}
      <ExternalLinkIcon sx={{ ml: 1, mb: 1, fill: "black", height: "13px" }} />
      <VisuallyHidden>{t("externalLink.opensInNewTab")}</VisuallyHidden>
    </AnchorButton>
  );
};

export default ExternalLink;
