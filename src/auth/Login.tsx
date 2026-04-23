/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "theme-ui";
import * as React from "react";
import useLibraryContext from "components/context/LibraryContext";
import LoadingIndicator from "components/LoadingIndicator";
import useLogin from "auth/useLogin";
import { isSupportedAuthType } from "./AuthenticationHandler";
import { EKIRJASTO_AUTH_TYPE } from "utils/constants";
import { useTranslation } from "next-i18next";

export default function Login(): React.ReactElement {
  const { initLogin } = useLogin();

  // AppAuthMethod[] shouldn't be populated with unsupported auth methods from auth document,
  // but we filter out any unsupported methods just in case.
  const { authMethods } = useLibraryContext();
  const supportedAuthMethods = authMethods.filter(m =>
    isSupportedAuthType(m.type)
  );

  // Automatically redirect user to first supported auth method
  // Unless there is ekirjasto authentication, then redirect to that
  React.useEffect(() => {
    if (supportedAuthMethods.length > 0) {
      const ekirjastoAuth = supportedAuthMethods.find(
        method => method.type === EKIRJASTO_AUTH_TYPE
      );
      if (ekirjastoAuth) {
        initLogin(ekirjastoAuth.id);
      } else {
        initLogin(supportedAuthMethods[0].id);
      }
    }
  }, [supportedAuthMethods, initLogin]);

  if (supportedAuthMethods.length === 0) {
    return <NoAuth />;
  }

  // we are about to be redirected, show a temp loader
  return <LoadingIndicator />;
}

const NoAuth: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div sx={{ display: "flex", justifyContent: "center", maxWidth: 500 }}>
      <p>{t("logout.noAuthentication")}</p>
    </div>
  );
};
