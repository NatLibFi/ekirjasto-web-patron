/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "theme-ui";
import * as React from "react";
import useLibraryContext from "components/context/LibraryContext";
import ExternalLink from "components/ExternalLink";
import { Text } from "components/Text";
import LoadingIndicator from "components/LoadingIndicator";
import { isSupportedAuthType } from "./AuthenticationHandler";
import {
  EKIRJASTO_AUTH_TYPE,
  EKIRJASTO_DOMAIN,
  LOGOUT_COOKIE_PARAM
} from "utils/constants";
import useUser from "components/context/UserContext";
import { useEffect, useState } from "react";
import useLoginRedirectUrl from "./useLoginRedirect";

export default function Logout(): React.ReactElement {
  const { token, signOut, getEkirjastoToken } = useUser();
  const { logoutRedirectUrl } = useLoginRedirectUrl();
  const { authMethods } = useLibraryContext();

  const [ekirjastoToken, setEkirjastoToken] = useState("");

  // AppAuthMethod[] shouldn't be populated with unsupported auth methods from auth document,
  // but we filter out any unsupported methods just in case.
  const supportedAuthMethods = authMethods.filter(m =>
    isSupportedAuthType(m.type)
  );

  const method = supportedAuthMethods.find(
    method => method.type === EKIRJASTO_AUTH_TYPE
  )!;

  const ekirjastoTokenHref = method.links?.find(
    link => link.rel === "ekirjasto_token"
  )?.href;

  // Get link for logout
  const authenticationLogoutHref = method.links?.find(
    link => link.rel === "logout"
  )?.href;

  // Add the redirect link
  const urlWithRedirect = `${authenticationLogoutHref}&redirect_uri=${encodeURIComponent(
    logoutRedirectUrl
  )}`;

  useEffect(() => {
    async function getToken() {
      const ekirToken = await getEkirjastoToken(token!, ekirjastoTokenHref);
      setEkirjastoToken(ekirToken);
    }
    getToken();
  });

  React.useEffect(() => {
    if (ekirjastoToken && authenticationLogoutHref) {
      document.cookie = `${LOGOUT_COOKIE_PARAM}=${ekirjastoToken}; path=/;  domain: ${EKIRJASTO_DOMAIN}, SameSite=None; Secure`;
      window.location.href = urlWithRedirect;
      signOut();
    }
  }, [
    token,
    signOut,
    authenticationLogoutHref,
    ekirjastoTokenHref,
    ekirjastoToken,
    urlWithRedirect
  ]);

  if (supportedAuthMethods.length === 0) {
    return <NoAuth />;
  }

  // we are about to be redirected, show a temp loader
  return <LoadingIndicator />;
}

const NoAuth: React.FC = () => {
  const {
    libraryLinks: { helpEmail }
  } = useLibraryContext();
  return (
    <div sx={{ display: "flex", justifyContent: "center", maxWidth: 500 }}>
      <Text>
        This Library does not have any authentication configured.{" "}
        {helpEmail && (
          <Text>
            If this is an error, please contact your site administrator via
            email at:{" "}
            <ExternalLink
              role="link"
              href={helpEmail.href}
              aria-label="Send email to help desk"
            >
              {helpEmail.href.replace("mailto:", "")}
            </ExternalLink>
            .
          </Text>
        )}
      </Text>
    </div>
  );
};
