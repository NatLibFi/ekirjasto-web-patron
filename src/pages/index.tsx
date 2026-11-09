import * as React from "react";
import { APP_CONFIG, IS_OPEN_EBOOKS } from "utils/env";
import OpenEbooksLandingPage from "components/OpenEbooksLanding";
import MultiLibraryHome from "components/MultiLibraryHome";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { APP_DEFAULT_LOCALE } from "../../appLocales";
import withAppProps from "dataflow/withAppProps";

const HomePage = IS_OPEN_EBOOKS ? OpenEbooksLandingPage : MultiLibraryHome;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  if (IS_OPEN_EBOOKS) {
    const landingPageStaticProps = withAppProps(
      undefined,
      APP_CONFIG.openebooks?.defaultLibrary
    );
    return landingPageStaticProps({ locale });
  }

  const currentLocale = locale ?? APP_DEFAULT_LOCALE;
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

export default HomePage;
