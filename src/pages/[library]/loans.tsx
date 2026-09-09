import * as React from "react";
import { NextPage, GetStaticPaths, GetStaticProps } from "next";
import LayoutPage from "components/LayoutPage";
import withAppProps, { AppProps } from "dataflow/withAppProps";
import MyBooks from "components/MyBooks";

type PageProps = AppProps & {
  bannerInitiallyVisible: boolean;
};

const MyBooksPage: NextPage<PageProps> = ({ library, error, bannerInitiallyVisible }) => {
  return (
    <LayoutPage library={library} error={error} bannerInitiallyVisible={bannerInitiallyVisible}>
      <MyBooks />
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

export default MyBooksPage;
