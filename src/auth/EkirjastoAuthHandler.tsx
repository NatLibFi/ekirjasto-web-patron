/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "theme-ui";
import * as React from "react";
import { ClientEkirjastoMethod } from "interfaces";
import Button from "components/Button";
import LoadingIndicator from "components/LoadingIndicator";
import Stack from "components/Stack";
import useUser from "components/context/UserContext";
import useLoginRedirectUrl from "auth/useLoginRedirect";
import { clientOnly } from "components/ClientOnly";
import { PasskeyLogin } from "./PasskeyLogin";

/**
 * The Ekirjasto Auth handler sends you off to an external website to complete
 * auth, or user can use passkey
 */
const EkirjastoAuthHandler: React.FC<{ method: ClientEkirjastoMethod }> = ({
  method
}) => {
  const { token } = useUser();
  const { authSuccessUrl } = useLoginRedirectUrl();

  // Get link for strong authentication
  const authenticationStartHref = method.links?.find(
    link => link.rel === "tunnistus_start"
  )?.href;

  //Create link with redirect
  const urlWithRedirect = `${authenticationStartHref}&redirect_uri=${encodeURIComponent(
    authSuccessUrl
  )}`;

  // Handle button click
  const handleLogin = async () => {
    if (!token && urlWithRedirect) {
      // Redirect to login page
      window.location.href = urlWithRedirect;
    }
  };

  return (
    <Stack direction="column" spacing={2} sx={{ alignItems: "center" }}>
      {token ? (
        <LoadingIndicator />
      ) : (
        <>
          <Button onClick={() => handleLogin()}>Sign in using Suomi.fi</Button>
          <PasskeyLogin redirectURI={authSuccessUrl} />
        </>
      )}
      <p>By signing in, you agree to the End User License Agreement</p>
    </Stack>
  );
};

export default clientOnly(EkirjastoAuthHandler);
