import * as React from "react";
import Collection from "components/Collection";
import { NextPage, GetStaticProps, GetStaticPaths } from "next";
import LayoutPage from "components/LayoutPage";
import withAppProps, { AppProps } from "dataflow/withAppProps";

type PageProps = AppProps & {
  bannerInitiallyVisible: boolean;
};

const LibraryHome: NextPage<PageProps> = ({
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
      <Collection title={library?.catalogName} />
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

export default LibraryHome;
