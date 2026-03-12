/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "theme-ui";
import * as React from "react";
import useLibraryContext from "components/context/LibraryContext";
import ExternalLink from "components/ExternalLink";
import { Text } from "components/Text";
import LoadingIndicator from "components/LoadingIndicator";
import { isSupportedAuthType } from "./AuthenticationHandler";
import { EKIRJASTO_AUTH_TYPE } from "utils/constants";
import useUser from "components/context/UserContext";
import Cookie from "js-cookie";
import { useEffect, useState } from "react";

export default function Logout(): React.ReactElement {
  // AppAuthMethod[] shouldn't be populated with unsupported auth methods from auth document,
  // but we filter out any unsupported methods just in case.
  const { authMethods } = useLibraryContext();
  const supportedAuthMethods = authMethods.filter(m =>
    isSupportedAuthType(m.type)
  );

  const { token, signOut, getEkirjastoToken } = useUser();

  const method = supportedAuthMethods.find(
    method => method.type === EKIRJASTO_AUTH_TYPE
  )!;

  const ekirjastoTokenHref = method.links?.find(
    link => link.rel === "ekirjasto_token"
  )?.href;

  // Get link for logout
  const authenticationLogoutHref = method.links?.find(
    link => link.rel === "api"
  )?.href;

  //Create link with redirect
  const logoutUrl = `${authenticationLogoutHref}/v1/auth/logout/start?locale=en`;

  const [ekirjastoToken, setEkirjastoToken] = useState("");

  useEffect(() => {
    async function getToken() {
      const ekirToken = await getEkirjastoToken(token!, ekirjastoTokenHref);
      setEkirjastoToken(ekirToken);
    }
    getToken();
  });

  React.useEffect(() => {
    if (ekirjastoToken && logoutUrl) {
      Cookie.set("SESSION", ekirjastoToken, {
        path: "/",
        domain: ".e-kirjasto.fi",
        sameSite: "None",
        secure: true
      });
      //document.cookie = `SESSION=${ekirjastoToken}; path=/;  domain: ".e-kirjasto.fi", SameSite=None; Secure`;
      signOut();
      window.location.href = logoutUrl;
    }
  }, [token, signOut, logoutUrl, ekirjastoTokenHref, ekirjastoToken]);

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
