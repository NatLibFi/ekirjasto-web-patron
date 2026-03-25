/** @jsxRuntime classic */
/** @jsx jsx */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { jsx } from "theme-ui";
import * as React from "react";
import useLibraryContext from "../components/context/LibraryContext";
import { H2 } from "../components/Text";
import Stack from "../components/Stack";
import useUser from "components/context/UserContext";
import LoadingIndicator from "components/LoadingIndicator";
import { useRouter } from "next/router";
import Head from "next/head";
import BreadcrumbBar from "components/BreadcrumbBar";
import useLoginRedirectUrl from "auth/useLoginRedirect";

/**
 * Redirects on successful logout
 * Shows loader if the state is still loading
 * Adds wrapping components for styling
 */
interface LogoutWrapperProps {
  children?: React.ReactNode;
}

const LogoutWrapper = ({ children }: LogoutWrapperProps) => {
  const { isAuthenticated, isLoading } = useUser();
  const { catalogName } = useLibraryContext();
  const { push } = useRouter();
  const { successPath } = useLoginRedirectUrl();

  /**
   * If the user is unauthenticated, we can redirect
   * to the successUrl
   */
  React.useEffect(() => {
    if (!isAuthenticated) {
      push(successPath, undefined, { shallow: true });
    }
  }, [isAuthenticated, push, successPath]);

  return (
    <div
      sx={{
        flex: 1
      }}
    >
      <Head>
        <title>Logout</title>
      </Head>
      <BreadcrumbBar currentLocation="Logout" />
      <div
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Stack
          direction="column"
          sx={{ p: 4, m: 4, border: "solid", borderRadius: "card" }}
        >
          <div sx={{ textAlign: "center", p: 0 }}>
            <H2>{catalogName}</H2>
            <h4>Logout</h4>
          </div>
          {/* when we just become unauthenticated, we display the
              loading indicator until the page redirects away
           */}

          {isLoading || !isAuthenticated ? (
            <Stack direction="column" sx={{ alignItems: "center" }}>
              <LoadingIndicator />
              Logging out...
            </Stack>
          ) : (
            children
          )}
        </Stack>
      </div>
    </div>
  );
};

export default LogoutWrapper;
