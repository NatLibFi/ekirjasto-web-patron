/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "theme-ui";
import * as React from "react";
import { ClientEkirjastoMethod } from "interfaces";
import LoadingIndicator from "components/LoadingIndicator";
import Stack from "components/Stack";
import useUser from "components/context/UserContext";
import useLoginRedirectUrl from "auth/useLoginRedirect";
import { clientOnly } from "components/ClientOnly";

/**
 * The Ekirjasto Auth handler sends you off to an external website to complete
 * auth.
 */
const EkirjastoAuthHandler: React.FC<{ method: ClientEkirjastoMethod }> = ({
  method
}) => {
  const { token, signOut } = useUser();
  const { authSuccessUrl } = useLoginRedirectUrl();

  // Get link for strong authentication
  const authenticationStartHref = method.links?.find(
    link => link.rel === "tunnistus_start"
  )?.href;

  //Create link with redirect
    const urlWithRedirect = `${authenticationStartHref}&redirect_uri=${encodeURIComponent(
        authSuccessUrl
      )}`;

      // Start login
      React.useEffect(() => {
        if (!token && urlWithRedirect) {
          window.location.href = urlWithRedirect;
          console.log(urlWithRedirect)
        }
      }, [token, signOut, urlWithRedirect]);

  return (
    <Stack direction="column" sx={{ alignItems: "center" }}>
      <LoadingIndicator />
      Logging in with EkirjastoAuthentication...
    </Stack>
  );
};

export default clientOnly(EkirjastoAuthHandler);