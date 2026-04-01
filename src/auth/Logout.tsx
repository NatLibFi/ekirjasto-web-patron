/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "theme-ui";
import * as React from "react";
import useLibraryContext from "components/context/LibraryContext";
import ExternalLink from "components/ExternalLink";
import { Text } from "components/Text";
import LoadingIndicator from "components/LoadingIndicator";
import { isSupportedAuthType } from "./AuthenticationHandler";
import Cookie from "js-cookie";
import {
  EKIRJASTO_AUTH_TYPE,
  EKIRJASTO_DOMAIN,
  EKIRJASTO_SESSION_PARAM
} from "utils/constants";
import useUser from "components/context/UserContext";
import useLoginRedirectUrl from "./useLoginRedirect";

export default function Logout(): React.ReactElement {
  const { token, session, signOut } = useUser();
  const { logoutRedirectUrl } = useLoginRedirectUrl();
  const { authMethods } = useLibraryContext();

  // AppAuthMethod[] shouldn't be populated with unsupported auth methods from auth document,
  // but we filter out any unsupported methods just in case.
  const supportedAuthMethods = authMethods.filter(m =>
    isSupportedAuthType(m.type)
  );

  // Get the ekirjasto auth method
  const method = authMethods.find(
    method => method.type === EKIRJASTO_AUTH_TYPE
  )!;

  // Get link for logout
  const authenticationLogoutHref = method.links?.find(
    link => link.rel === "logout"
  )?.href;

  // Add the redirect link
  const urlWithRedirect = `${authenticationLogoutHref}&redirect_uri=${encodeURIComponent(
    logoutRedirectUrl
  )}`;

  React.useEffect(() => {
    if (session && authenticationLogoutHref) {
      // Set the session cookie
      Cookie.set(EKIRJASTO_SESSION_PARAM, session, {
        path: "/",
        domain: EKIRJASTO_DOMAIN,
        sameSite: "None",
        secure: true
      });
    }
    window.location.href = urlWithRedirect;
    signOut();
  }, [token, session, signOut, authenticationLogoutHref, urlWithRedirect]);

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
