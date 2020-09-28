import * as React from "react";
import ContextProvider from "../components/context/ContextProvider";
import getPathFor from "../utils/getPathFor";
import getOrCreateStore from "../dataflow/getOrCreateStore";
import Auth from "../components/Auth";
import Head from "next/head";
import Error from "components/Error";
import { AppProps } from "dataflow/withAppProps";

/* Page without Header and Footer should wrap pages that should not have sitewide navigation */

const Page: React.FC<AppProps> = props => {
  /**
   * If there was no library or initialState provided, render the error page
   */

  if (props.error || !props.library) {
    return (
      <Error
        statusCode={props.error?.statusCode}
        detail={props.error?.message}
        configFile={props.configFile}
      />
    );
  }

  const { library, children } = props;
  const pathFor = getPathFor(library.slug);
  const store = getOrCreateStore(pathFor);

  return (
    <>
      <Head>
        {/* define the default title */}
        <title>{library.catalogName}</title>
      </Head>
      <ContextProvider library={library} store={store}>
        <Auth>{children}</Auth>
      </ContextProvider>
    </>
  );
};

export default Page;
