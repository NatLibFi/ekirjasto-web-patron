/** @jsxRuntime classic */
/** @jsx jsx */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { jsx } from "theme-ui";
import * as React from "react";
import { VisuallyHidden } from "@ariakit/react";
import { AnchorButton } from "./Button";
import { useTranslation } from "next-i18next";

const ExternalLink: React.FC<React.ComponentPropsWithoutRef<"a">> = ({
  children,
  ...props
}) => {
  const { t } = useTranslation();

  return (
    <AnchorButton
      variant="link"
      target="__blank"
      rel="noopener noreferrer"
      {...props}
    >
      {children}
      <VisuallyHidden>({t("externalLink.opensInNewTab")})</VisuallyHidden>
    </AnchorButton>
  );
};

export default ExternalLink;
