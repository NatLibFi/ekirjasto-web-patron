import * as React from "react";
import LayoutPage from "components/LayoutPage";
import Feedback from "components/Feedback";
import withAppProps, { AppProps } from "dataflow/withAppProps";
import { GetStaticProps, GetStaticPaths, NextPage } from "next";

const FeedbackPage: NextPage<AppProps> = ({ library, error }) => {
  return (
    <LayoutPage library={library} error={error} hideFooter={true}>
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
