import * as React from "react";
import LayoutPage from "components/LayoutPage";
import Feedback from "components/Feedback";
import withAppProps, { AppProps } from "dataflow/withAppProps";
import { GetStaticProps, GetStaticPaths, NextPage } from "next";
import BreadcrumbBar from "components/BreadcrumbBar";
import { useTranslation } from "next-i18next";

const FeedbackPage: NextPage<AppProps> = ({ library, error }) => {
  const { t } = useTranslation();
  // The footer is hidden.
  return (
    <LayoutPage library={library} error={error} hideFooter={true}>
      <BreadcrumbBar currentLocation={t("feedback.title")} />
      <Feedback />
    </LayoutPage>
  );
};

export const getStaticProps: GetStaticProps = withAppProps();

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true
  };
};

export default FeedbackPage;
