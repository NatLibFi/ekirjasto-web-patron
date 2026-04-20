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
  LOGOUT_COOKIE_PARAM
} from "utils/constants";
import useUser from "components/context/UserContext";
import useLoginRedirectUrl from "./useLoginRedirect";

export default function Logout(): React.ReactElement {
  const { token, signOut, getEkirjastoToken } = useUser();
  const { logoutRedirectUrl } = useLoginRedirectUrl();
  const { authMethods } = useLibraryContext();

  const [ekirjastoToken, setEkirjastoToken] = React.useState<string>("");

  // AppAuthMethod[] shouldn't be populated with unsupported auth methods from auth document,
  // but we filter out any unsupported methods just in case.
  const supportedAuthMethods = authMethods.filter(m =>
    isSupportedAuthType(m.type)
  );

  // Get the ekirjasto auth method
  const method = supportedAuthMethods.find(
    method => method.type === EKIRJASTO_AUTH_TYPE
  );

  // Get link for logout
  const authenticationLogoutHref = method
    ? method.links?.find(link => link.rel === "logout")?.href
    : undefined;

  // Add the redirect link
  const urlWithRedirect =
    authenticationLogoutHref && logoutRedirectUrl
      ? `${authenticationLogoutHref}&redirect_uri=${encodeURIComponent(
          logoutRedirectUrl
        )}`
      : undefined;

  // Get the url for the token
  const ekirjastoTokenUrl = method
    ? method.links?.find(link => link.rel === "ekirjasto_token")?.href
    : undefined;

  // Get the url for circulation token refresh
  const circulationTokenRefreshUrl = method
    ? method.links?.find(link => link.rel === "authenticate")?.href
    : undefined;

  const fetchEkirjastoToken = async () => {
    try {
      //If we have both token and the ekirjastoToken url, fetch the ekirjasto token
      if (token && ekirjastoTokenUrl) {
        // Fetch the ekirjasto token
        const fetchedToken = await getEkirjastoToken(
          token,
          ekirjastoTokenUrl,
          circulationTokenRefreshUrl
        );

        // Set the fetched token
        setEkirjastoToken(fetchedToken);
      }
    } catch (error) {
      // If the token fetch fails, it is most likely due to 401,
      // In which case, refresh happens elsewhere
    }
  };

  React.useEffect(() => {
    if (token && method) {
      fetchEkirjastoToken();
    }
  }, [token, method, fetchEkirjastoToken]);

  React.useEffect(() => {
    if (ekirjastoToken && urlWithRedirect) {
      // Set the session cookie
      Cookie.set(LOGOUT_COOKIE_PARAM, ekirjastoToken, {
        path: "/",
        domain: EKIRJASTO_DOMAIN,
        sameSite: "None",
        secure: true
      });

      signOut();
      window.location.href = urlWithRedirect;
    }
  }, [
    token,
    signOut,
    authenticationLogoutHref,
    urlWithRedirect,
    ekirjastoToken
  ]);

  // If there is no supported methods
  if (supportedAuthMethods.length === 0) {
    return <NoAuth />;
  }

  // If there is no ekirjasto method
  if (!method) {
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
