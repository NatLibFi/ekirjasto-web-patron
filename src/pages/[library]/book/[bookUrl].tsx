import * as React from "react";
import BookDetails from "../../../components/bookDetails";
import withAppProps, { AppProps } from "dataflow/withAppProps";
import LayoutPage from "components/LayoutPage";
import { NextPage, GetStaticProps, GetStaticPaths } from "next";

type PageProps = AppProps & {
  bannerInitiallyVisible: boolean;
};

const BookPage: NextPage<PageProps> = ({ library, error, bannerInitiallyVisible }) => {
  return (
    <LayoutPage library={library} error={error} bannerInitiallyVisible={bannerInitiallyVisible}>
      <BookDetails />
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

export default BookPage;
