/** @jsxRuntime classic */
/** @jsx jsx */
import { Button, jsx } from "theme-ui";
import * as React from "react";
import { ClientEkirjastoMethod } from "interfaces";
import LoadingIndicator from "components/LoadingIndicator";
import Stack from "components/Stack";
import useUser from "components/context/UserContext";
import useLoginRedirectUrl from "auth/useLoginRedirect";
import { clientOnly } from "components/ClientOnly";
import { PasskeyLogin } from "./PasskeyLogin";

/**
 * The Ekirjasto Auth handler sends you off to an external website to complete
 * auth.
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
    <Stack direction="column" sx={{ alignItems: "center" }}>
      {token ? (
        <LoadingIndicator />
      ) : (
        <>
          <Button onClick={() => handleLogin('strong')}>Login using Suomi.fi</Button>
          <PasskeyLogin redirectURI = {authSuccessUrl}/>
        </>
      )}
      {!token && <p>Logging in with Ekirjasto Authentication...</p>}
    </Stack>
  );
};

export default clientOnly(EkirjastoAuthHandler);
