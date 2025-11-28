import * as React from "react";
import Page from "./Page";
import Layout from "./Layout";
import { AppProps } from "dataflow/withAppProps";

/* LayoutPage is a Page with Header and Footer from Layout, this should be used to wrap pages within the app with sitewide navigation. */

type AppPropsWithChildren = AppProps & {
  children?: React.ReactNode;
  hideFooter?: boolean;
};

const LayoutPage = ({
  children,
  library,
  error,
  hideFooter
}: AppPropsWithChildren) => {
  return (
    <Page library={library} error={error}>
      <Layout hideFooter={hideFooter}>{children}</Layout>
    </Page>
  );
};

export default LayoutPage;
