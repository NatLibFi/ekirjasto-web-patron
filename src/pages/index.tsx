import * as React from "react";
import { IS_OPEN_EBOOKS } from "utils/env";
import OpenEbooksLandingPage, {
  landingPageStaticProps
} from "components/OpenEbooksLanding";
import MultiLibraryHome from "components/MultiLibraryHome";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const HomePage = IS_OPEN_EBOOKS ? OpenEbooksLandingPage : MultiLibraryHome;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  if (IS_OPEN_EBOOKS) {
    return landingPageStaticProps({ locale });
  }

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

export default HomePage;
