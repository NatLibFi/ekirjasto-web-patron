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

export function PasskeyCreate() {
  const { authMethods } = useLibraryContext();
  const { token } = useUser();

  // Get supported methods
  const supportedAuthMethods = authMethods.filter(m =>
    isSupportedAuthType(m.type)
  );

  // Get ekirjasto auth methog
  const method = supportedAuthMethods.find(
    method => method.type === EKIRJASTO_AUTH_TYPE
  )!;

  const passkeyRegisterStartHref = method.links?.find(
    link => link.rel === "passkey_register_start"
  )?.href;

  const passkeyRegisterFinishHref = method.links?.find(
    link => link.rel === "passkey_register_finish"
  )?.href;

  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsSupported(browserSupportsWebAuthn());
  }, []);

  const handleCreate = async () => {
    setError("");
    setIsLoading(true);

    try {
      // Step 1: Request a challenge from the server
      const startResponse = await fetch(passkeyRegisterStartHref!, {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          authorization: token!
        },
        body: JSON.stringify({ username: "" })
      });

      if (!startResponse.ok) {
        throw new Error("Failed to start passkey registeration");
      }

      const { publicKey } = await startResponse.json();

      // Step 2: Start the passkey registration using the options we received from the start
      const data = await startRegistration({ optionsJSON: publicKey });

      // Step 3: Submit the registration response via a POST form

      const finishResponse = await fetch(passkeyRegisterFinishHref!, {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          authorization: token!
        },
        body: JSON.stringify(data)
      });

      if (!finishResponse.ok) {
        throw new Error("Failed to finish passkey registeration");
      }

      const response = await finishResponse.json();
      //TODO: do something with the response, or just inform that successful
    } catch (err) {
      setError((err as Error).message || "Passkey creation failed");
      setIsLoading(false);
    }
  };

  if (!isSupported) {
    return;
  }

  return (
    <div>
      <Button
        variant="ghost"
        color="ui.black"
        onClick={handleCreate}
        disabled={isLoading}
      >
        {isLoading ? "Authenticating…" : "Register a passkey"}
      </Button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
