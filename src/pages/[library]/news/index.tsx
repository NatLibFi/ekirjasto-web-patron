import * as React from "react";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import withAppProps, { AppProps } from "dataflow/withAppProps";
import { EditorialList } from "components/EditorialContent";
import { PageLoader } from "components/LoadingIndicator";

const NewsPage: NextPage<AppProps> = ({ library, error }) => {
  const { isFallback } = useRouter();

  if (isFallback) return <PageLoader />;

  if (!library || error)
    return <p>{error?.detail || "Could not load library"}</p>;
  return <EditorialList library={library} type="news" />;
};
export const getStaticProps: GetStaticProps = withAppProps();
export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: true
});
export default NewsPage;
