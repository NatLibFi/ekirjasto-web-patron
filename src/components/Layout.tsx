/** @jsxRuntime classic */
/** @jsx jsx */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { jsx } from "theme-ui";
import { Themed } from "@theme-ui/mdx";
import * as React from "react";
import GlobalStyles from "./GlobalStyles";
import Header from "./Header";
import Footer from "./Footer";
import SkipNavigation from "./SkipNavigation";
import { ErrorBoundary } from "components/ErrorBoundary";

export const CONTENT_ID = "cpw-content";

interface Props {
  children: React.ReactNode;
  hideFooter?: boolean;
}

const Layout = ({ children, hideFooter = false }: Props) => {
  return (
    <Themed.root
      sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <SkipNavigation />
      <GlobalStyles />
      <Header sx={{ width: "100%" }} />
      <main
        id={CONTENT_ID}
        sx={{
          flex: "1 1 auto",
          width: "100%",
          display: "flex",
          flexDirection: "column"
        }}
      >
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>
      {!hideFooter && <Footer sx={{ width: "100%" }} />}
    </Themed.root>
  );
};

export default Layout;
