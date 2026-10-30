import * as React from "react";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import withAppProps, { AppProps } from "dataflow/withAppProps";
import { EditorialList } from "components/EditorialContent";

const FaqPage: NextPage<AppProps> = ({ library, error }) => {
  if (!library || error)
    return <p>{error?.detail || "Could not load library"}</p>;
  return <EditorialList library={library} type="faq" />;
};
export const getStaticProps: GetStaticProps = withAppProps();
export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: true
});
export default FaqPage;
