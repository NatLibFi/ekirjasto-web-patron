/** @jsxRuntime classic */
/** @jsx jsx */

import { APP_LOCALES, AppLocale, isAppLocale } from "../../appLocales";
import { jsx } from "theme-ui";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import React from "react";
import Select from "components/Select";

const LanguageSelector: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const currentLocale =
    router.locale && isAppLocale(router.locale) ? router.locale : undefined;

  const handleLanguageChange = (language: AppLocale) => {
    if (currentLocale === language) return;

    router
      .push(router.asPath, router.asPath, { locale: language })
      .catch(error => {
        console.error("Failed to change language", error);
      });
  };

  if (!router.isReady || !currentLocale) return null;

  return (
    <Select
      aria-label={t("languageSelector")}
      value={currentLocale}
      onChange={event => {
        const language = event.target.value;
        if (isAppLocale(language)) handleLanguageChange(language);
      }}
      sx={{
        backgroundColor: "ui.ekirjastogreen",
        color: "ui.white",
        border: "none",
        borderRadius: "30px",
        height: "32px",
        fontSize: "16px",
        pl: 3,
        "&:focus-visible": {
          outline: "2px solid #005a5d",
          outlineOffset: "2px"
        },
        "& + svg": { fill: "ui.white" }
      }}
    >
      {APP_LOCALES.map(language => (
        <option key={language} value={language}>
          {t(`languageName.${language.toUpperCase()}`)}
        </option>
      ))}
    </Select>
  );
};

export default LanguageSelector;
