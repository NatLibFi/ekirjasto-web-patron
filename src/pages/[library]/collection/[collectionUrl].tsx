import * as React from "react";
import Collection from "components/Collection";
import { NextPage, GetStaticPaths, GetStaticProps } from "next";
import LayoutPage from "components/LayoutPage";
import withAppProps, { AppProps } from "dataflow/withAppProps";

type PageProps = AppProps & {
  bannerInitiallyVisible: boolean;
};

const CollectionPage: NextPage<PageProps> = ({
  library,
  error,
  bannerInitiallyVisible
}) => {
  return (
    <LayoutPage
      library={library}
      error={error}
      bannerInitiallyVisible={bannerInitiallyVisible}
    >
      <Collection />
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

export default CollectionPage;
