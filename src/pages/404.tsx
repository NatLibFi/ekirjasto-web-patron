import * as React from "react";
import ErrorComponent from "../components/Error";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function NotFoundPage() {
  return (
    <ErrorComponent
      info={{
        status: 404,
        title: "error404.titleForPageNotFound",
        detail: "error404.urlNotAvailable"
      }}
    />
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const currentLocale = locale ?? "fi";
  const translationNamespaces = ["translations"];

  const translations = await serverSideTranslations(
    currentLocale,
    translationNamespaces
  );

  return {
    props: {
      _locale: currentLocale,
      ...translations
    }
  };
};
