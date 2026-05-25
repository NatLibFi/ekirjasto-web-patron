/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "theme-ui";
import * as React from "react";
import { useTranslation } from "next-i18next";
import { ClientEkirjastoMethod } from "interfaces";
import Button from "components/Button";
import LoadingIndicator from "components/LoadingIndicator";
import Stack from "components/Stack";
import useUser from "components/context/UserContext";
import useLoginRedirectUrl from "auth/useLoginRedirect";
import { clientOnly } from "components/ClientOnly";
import { PasskeyLogin } from "./PasskeyLogin";
import { useRouter } from "next/router";

/**
 * The Ekirjasto Auth handler sends you off to an external website to complete
 * auth, or user can use passkey
 */
const EkirjastoAuthHandler: React.FC<{ method: ClientEkirjastoMethod }> = ({
  method
}) => {
  const { token } = useUser();
  const { authSuccessUrl } = useLoginRedirectUrl();
  const { t } = useTranslation();
  const { locale } = useRouter();

  // Get link for strong authentication
  const authenticationStartHref = method.links?.find(
    link => link.rel === "tunnistus_start"
  )?.href;

  //Add the redirect and correct locale
  const urlWithRedirect = `${authenticationStartHref?.replace(
    "en",
    locale!
  )}&redirect_uri=${encodeURIComponent(authSuccessUrl)}`;

  // Handle button click
  const handleLogin = async () => {
    if (!token && urlWithRedirect) {
      // Redirect to login page
      window.location.href = urlWithRedirect;
    }
  };

  const ariaLabelForTOC =
    t("ekirjastoAuthHandler.endUserAgreementInfoTextWithLink") +
    t("externalLink.opensInNewTab");

  return (
    <Stack direction="column" spacing={2} sx={{ alignItems: "center" }}>
      {token ? (
        <LoadingIndicator />
      ) : (
        <>
          <Button onClick={() => handleLogin()}>
            {t("ekirjastoAuthHandler.suomiFiLoginButton")}
          </Button>
          <PasskeyLogin redirectURI={authSuccessUrl} />
        </>
      )}
      <Stack direction="row" spacing={1}>
        <p>{t("ekirjastoAuthHandler.endUserAgreementInfoText")}</p>
        <a
          href={t("footer.hrefElibraryTermsOfUse")}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={ariaLabelForTOC}
        >
          <p>{t("ekirjastoAuthHandler.endUserAgreementInfoTextWithLink")}</p>
        </a>
      </Stack>
    </Stack>
  );
};

export default clientOnly(EkirjastoAuthHandler);
