/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "theme-ui";
import Button from "components/Button";
import {
  browserSupportsWebAuthn,
  startRegistration
} from "@simplewebauthn/browser";
import useLibraryContext from "components/context/LibraryContext";
import { useEffect, useState } from "react";
import { isSupportedAuthType } from "./AuthenticationHandler";
import { EKIRJASTO_AUTH_TYPE } from "utils/constants";
import useUser from "components/context/UserContext";
import { useTranslation } from "next-i18next";
import { InfoPopup } from "components/InfoPopup";

export function PasskeyCreate() {
  const { authMethods } = useLibraryContext();
  const { token } = useUser();
  const { t } = useTranslation();

  // Get supported methods
  const supportedAuthMethods = authMethods.filter(m =>
    isSupportedAuthType(m.type)
  );

  // Get ekirjasto auth method
  const method = supportedAuthMethods.find(
    method => method.type === EKIRJASTO_AUTH_TYPE
  )!;

  const passkeyRegisterStartHref = method
    ? method.links?.find(link => link.rel === "passkey_register_start")?.href
    : undefined;

  const passkeyRegisterFinishHref = method
    ? method.links?.find(link => link.rel === "passkey_register_finish")?.href
    : undefined;

  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);

  useEffect(() => {
    setIsSupported(browserSupportsWebAuthn());
  }, []);

  const handleCreate = async () => {
    setError("");
    setIsLoading(true);

    if (passkeyRegisterStartHref && passkeyRegisterFinishHref) {
      try {
        // Step 1: Request a challenge from the server
        const startResponse = await fetch(passkeyRegisterStartHref, {
          method: "POST",
          headers: {
            accept: "application/json",
            "content-type": "application/json",
            authorization: token!
          },
          body: JSON.stringify({ username: "" })
        });

        if (!startResponse.ok) {
          throw new Error(t("passkeyCreate.passkeyRegistrationStartFail"));
        }

        const { publicKey } = await startResponse.json();

        // Step 2: Start the passkey registration using the options we received from the start
        const data = await startRegistration({ optionsJSON: publicKey });

        // Add expected username to the body
        const body = {
          username: "",
          data: data
        };

        // Step 3: Submit the registration response via a POST form

        const finishResponse = await fetch(passkeyRegisterFinishHref, {
          method: "POST",
          headers: {
            accept: "application/json",
            "content-type": "application/json",
            authorization: token!
          },
          body: JSON.stringify(body)
        });

        if (!finishResponse.ok) {
          throw new Error(t("passkeyCreate.passkeyRegistrationFinishFail"));
        }

        await finishResponse.json();
        //TODO: do something with the response, or just inform that successful
        setIsSuccessful(true);
        setIsLoading(false);
      } catch (err) {
        setError(
          (err as Error).message || t("passkeyCreate.passkeyRegistrationFail")
        );
        setIsLoading(false);
      }
    }
  };

  if (!isSupported || !method) {
    return <div></div>;
  }

  return (
    <div>
      <Button
        variant="ghost"
        color="ui.black"
        onClick={handleCreate}
        disabled={isLoading}
        sx={{ mr: 3 }}
      >
        {isLoading
          ? t("passkeyCreate.passkeyRegistrationLoad")
          : t("passkeyCreate.passkeyRegistrationButton")}
      </Button>
      {error && <InfoPopup info={error} />}
      {isSuccessful && (
        <InfoPopup
          info={t("passkeyCreate.passkeyRegistrationSuccessful")}
          isError={false}
        />
      )}
    </div>
  );
}
