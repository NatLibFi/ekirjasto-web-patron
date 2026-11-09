import * as React from "react";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import withAppProps, { AppProps } from "dataflow/withAppProps";
import { EditorialDetail } from "components/EditorialContent";

type Props = AppProps & { identifier?: string };
const NewsDetailPage: NextPage<Props> = ({ library, error, identifier }) => {
  if (!library || error || !identifier)
    return <p>{error?.detail || "Loading..."}</p>;
  return (
    <EditorialDetail library={library} type="news" identifier={identifier} />
  );
};
export const getStaticProps: GetStaticProps = async ctx => {
  const result = await withAppProps()(ctx);
  const props = "props" in result ? result.props : {};
  return {
    ...result,
    props: { ...props, identifier: ctx.params?.identifier }
  };
};
export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: true
});
export default NewsDetailPage;
