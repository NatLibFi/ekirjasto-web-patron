/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "theme-ui";
import * as React from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { isAppLocale } from "../../appLocales";
import useLibraryContext from "./context/LibraryContext";
import AlertBar from "./AlertBar";

const ServiceAlert: React.FC = () => {
  const { serviceAlert } = useLibraryContext();
  const { locale } = useRouter();
  const { t } = useTranslation();

  // Temporarily show the alert regardless of the admin setting for testing.

  const configuredMessage =
    typeof serviceAlert?.message === "string"
      ? serviceAlert.message
      : locale && isAppLocale(locale)
      ? serviceAlert?.message?.[locale]
      : undefined;
  const message = configuredMessage?.trim() || t("alertBar.message");

  return (
    <AlertBar key={message} backgroundColor="ui.error">
      {message}
    </AlertBar>
  );
};

export default ServiceAlert;
