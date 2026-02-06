import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { GetStaticPaths, GetStaticProps } from "next";
import React from "react";

export default function TestPage({ _locale }: { _locale: string }) {
  const { t } = useTranslation("common");

  return (
    <main style={{ padding: 40 }}>
      <p>Locale: {_locale}</p>
      <h1>{t("title")}</h1>
      <p>{t("description")}</p>
    </main>
  );
}

export const getStaticPaths: GetStaticPaths = async ({ locales }) => {
  const libraries = ["ekirjasto"];

  const paths =
    locales?.flatMap(locale =>
      libraries.map(library => ({
        params: { library },
        locale
      }))
    ) ?? [];

  return {
    paths,
    fallback: false
  };
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const currentLocale = locale ?? "en";
  return {
    props: {
      ...(await serverSideTranslations(currentLocale, ["common"])),
      _locale: currentLocale
    }
  };
};
