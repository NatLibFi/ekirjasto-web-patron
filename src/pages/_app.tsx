import * as React from "react";
import ReactDOM from "react-dom";
import App, { AppContext, AppProps, NextWebVitalsMetric } from "next/app";
import { parse } from "cookie";
import { IS_SERVER, REACT_AXE } from "../utils/env";
import { ErrorBoundary } from "components/ErrorBoundary";
import "@nypl/design-system-react-components/dist/styles.css";
import "css-overrides.css";
import track from "analytics/track";
import { BreadcrumbProvider } from "components/context/BreadcrumbContext";
import { appWithTranslation } from "next-i18next";

/**
 * We can mock our backend api with MSW (mock service worker).
 */
if (
  process.env.NODE_ENV === "development" &&
  process.env.NEXT_PUBLIC_API_MOCKING === "true"
) {
  console.warn("Using MSW to intercept network requests");
  require("../../msw");
}

type MyAppProps = AppProps & {
  bannerInitiallyVisible: boolean;
};

const MyApp = ({
  Component,
  pageProps,
  bannerInitiallyVisible
}: MyAppProps) => {
  return (
    <ErrorBoundary>
      <BreadcrumbProvider>
        <Component
          {...pageProps}
          bannerInitiallyVisible={bannerInitiallyVisible}
        />
      </BreadcrumbProvider>
    </ErrorBoundary>
  );
};

if (process.env.NODE_ENV === "development" && !IS_SERVER && REACT_AXE) {
  const axe = require("@axe-core/react");
  axe(React, ReactDOM, 1000, {});
}

export function reportWebVitals(metric: NextWebVitalsMetric) {
  track.webVitals(metric);
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);

  //Get the request to check if the banner has been hidden
  const { req } = appContext.ctx;

  // If there is no cookie, or some info is missing, the banner should be visible (bannerInitiallyVIsible = true) ,
  // but it should be hidden if there is a cookie and its value is true (bannerInitiallyVIsible = false)
  const bannerInitiallyVisible = req
    ? parse(req.headers.cookie ?? "").bannerClosed !== "true"
    : true;

  return {
    ...appProps,
    bannerInitiallyVisible
  };
};

// Wrap MyApp component with appWithTranslation to provide i18n context,
// so we can use translation functions (t) in child components
// and switch translations based on locales
export default appWithTranslation(MyApp);
