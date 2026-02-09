import * as React from "react";
import Cookie from "js-cookie";
import { AppAuthMethod, AuthCredentials, OPDS1 } from "interfaces";
import { IS_SERVER } from "utils/env";
import { NextRouter, useRouter } from "next/router";
import { generateCredentials } from "utils/auth";
import {
  EKIRJASTO_AUTH_TYPE,
  EKIRJASTO_TOKEN_PARAM,
  SAML_LOGIN_QUERY_PARAM
} from "utils/constants";

/**
 * This hook:
 *  - Searches for credentials in cookies
 *  - Syncs those cookies with an internal react state so that
 *    changes to the credentials causes a re-render. Just
 *    changing the cookie wouldn't do this.
 *  - Searches for credentials embedded in the browser url. If
 *    if finds a token, it extracts it and sets it as the current
 *    credentials.
 */
export default function useCredentials(
  slug: string | null,
  authMethods: AppAuthMethod[] | null
) {
  const router = useRouter();

  // Since we don't actually call the login function anywhere, we need to put the authentication url
  // in somehow, so we fetch it here and take it to getCredentialsState function
  const ekirjastoMethod = authMethods?.find(
    method => method.type === EKIRJASTO_AUTH_TYPE
  );
  let authenticationUrl;
  if (ekirjastoMethod) {
    authenticationUrl = ekirjastoMethod.links?.find(
      link => link.rel === "authenticate"
    )?.href;
  }
  const [credentialsState, setCredentialsState] = React.useState<
    AuthCredentials | undefined
  >(getCredentialsCookie(slug, authenticationUrl));
  // sync up cookie state with react state
  React.useEffect(() => {
    const cookie = getCredentialsCookie(slug, authenticationUrl);
    if (cookie) setCredentialsState(cookie);
  }, [authenticationUrl, slug]);

  // set both cookie and state credentials
  const setCredentials = React.useCallback(
    (creds: AuthCredentials) => {
      setCredentialsState(creds);
      setCredentialsCookie(slug, creds);
    },
    [slug]
  );

  // clear both cookie and state credentials
  const clear = React.useCallback(() => {
    setCredentialsState(undefined);
    clearCredentialsCookie(slug);
  }, [slug]);

  // use credentials from browser url if they exist
  const { token: urlToken, methodType: urlMethodType } =
    getUrlCredentials(router) ?? {};

  React.useEffect(() => {
    if (urlToken && urlMethodType) {
      setCredentials({ token: urlToken, methodType: urlMethodType });
    }
  }, [urlToken, urlMethodType, setCredentials]);

  return {
    credentials: credentialsState,
    setCredentials,
    clearCredentials: clear
  };
}

/**
 * COOKIE CREDENTIALS
 */
/**
 * If you pass a librarySlug, the cookie will be scoped to the
 * library you are viewing. This is useful in a multi library setup
 */
function cookieName(librarySlug: string | null): string {
  const AUTH_COOKIE_NAME = "CPW_AUTH_COOKIE";
  return `${AUTH_COOKIE_NAME}/${librarySlug}`;
}
/**
 * When using ekirjasto authentication, we don't use scoping to a particular library
 * @returns ekirjasto cookie name
 */
function cookieNameEkirjasto(): string {
  const AUTH_COOKIE_NAME = EKIRJASTO_TOKEN_PARAM;
  return AUTH_COOKIE_NAME;
}
/**
 * Get credentials from cookies.
 * We assume the token is in access_token cookie, and that it is
 * of the Ekirjasto Authentication type
 *
 * @param librarySlug Library slug, that is useful if we have multiple libraries
 * @param authenticationUrl AuthenticationUrl where we make refresh requests
 * @returns Ekirjasto credentials if access_token is available, otherwise undefined
 */
function getCredentialsCookie(
  librarySlug: string | null,
  authenticationUrl: string | null
): AuthCredentials | undefined {
  if (librarySlug === "ekirjasto") {
    // Get access token, for ekirjasto login credentials
    const accessToken = Cookie.get(cookieNameEkirjasto());
    // Create ekirjasto authentication credentials
    const authCredentials: AuthCredentials = {
      token: `Bearer ${accessToken}`,
      methodType: OPDS1.EkirjastoAuthType,
      authenticationUrl: authenticationUrl ? authenticationUrl : undefined
    };
    // Return the credentials
    return authCredentials ? authCredentials : undefined;
  } else {
    const credentials = Cookie.get(cookieName(librarySlug));
    return credentials ? JSON.parse(credentials) : undefined;
  }
}

function setCredentialsCookie(
  librarySlug: string | null,
  credentials: AuthCredentials
) {
  if (librarySlug === "ekirjasto") {
    Cookie.set(cookieNameEkirjasto(), JSON.stringify(credentials));
  } else {
    Cookie.set(cookieName(librarySlug), JSON.stringify(credentials));
  }
}

function clearCredentialsCookie(librarySlug: string | null) {
  if (librarySlug === "ekirjasto") {
    Cookie.remove(cookieNameEkirjasto());
  } else {
    Cookie.remove(cookieName(librarySlug));
  }
}

export function generateToken(username: string, password?: string) {
  return generateCredentials(username, password);
}

/**
 * URL CREDENTIALS, NOT USED WITH EKIRJASTO
 */
function getUrlCredentials(router: NextRouter) {
  /* TODO: throw error if samlAccessToken and cleverAccessToken exist at the same time as this is an invalid state that shouldn't be reached */
  return IS_SERVER
    ? undefined
    : lookForCleverCredentials() ?? lookForSamlCredentials(router);
}

// check for clever credentials
function lookForCleverCredentials(): AuthCredentials | undefined {
  if (!IS_SERVER) {
    const accessTokenKey = "access_token=";
    if (window?.location?.hash) {
      if (window.location.hash.indexOf(accessTokenKey) !== -1) {
        const hash = window.location.hash;
        const accessTokenStart = hash.indexOf(accessTokenKey);
        const accessToken = hash
          .slice(accessTokenStart + accessTokenKey.length)
          .split("&")[0];
        const token = `Bearer ${accessToken}`;

        // clear the url hash with replaceState
        const url = new URL(window.location.href);
        url.hash = "";
        window.history.replaceState(null, document.title, url.toString());

        return { token, methodType: OPDS1.CleverAuthType };
      }
    }
  }
}

// check for saml credentials
function lookForSamlCredentials(
  router: NextRouter
): AuthCredentials | undefined {
  const { [SAML_LOGIN_QUERY_PARAM]: samlAccessToken } = router.query;
  if (samlAccessToken) {
    if (!IS_SERVER && typeof window !== "undefined") {
      // clear the browser query using replaceState
      const url = new URL(window.location.href);
      if (url.searchParams.has(SAML_LOGIN_QUERY_PARAM)) {
        url.searchParams.delete(SAML_LOGIN_QUERY_PARAM);
        window.history.replaceState(null, document.title, url.toString());
      }
    }

    return {
      token: `Bearer ${samlAccessToken}`,
      methodType: OPDS1.SamlAuthType
    };
  }
}
