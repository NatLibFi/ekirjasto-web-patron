/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "theme-ui";
import Button from "components/Button";
import {
  browserSupportsWebAuthn,
  startAuthentication
} from "@simplewebauthn/browser";
import useLibraryContext from "components/context/LibraryContext";
import { useEffect, useState } from "react";
import { isSupportedAuthType } from "./AuthenticationHandler";
import { EKIRJASTO_AUTH_TYPE } from "utils/constants";

export function PasskeyLogin({ redirectURI }: { redirectURI?: string }) {
  const { authMethods } = useLibraryContext();

  // Get supported methods
  const supportedAuthMethods = authMethods.filter(m =>
    isSupportedAuthType(m.type)
  );

  // Get ekirjasto auth method
  const method = supportedAuthMethods.find(
    method => method.type === EKIRJASTO_AUTH_TYPE
  )!;

  const passkeyLoginStartHref = method.links?.find(
    link => link.rel === "passkey_login_start"
  )?.href;

  const passkeyLoginFinishHref = method.links?.find(
    link => link.rel === "passkey_login_finish"
  )?.href;

  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsSupported(browserSupportsWebAuthn());
  }, []);

  const handleLogin = async () => {
    setError("");
    setIsLoading(true);

    try {
      // Step 1: Request a challenge from the server
      const startResponse = await fetch(passkeyLoginStartHref!, {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json"
        },
        body: JSON.stringify({})
      });

      if (!startResponse.ok) {
        throw new Error("Failed to start passkey authentication");
      }

      const { publicKey } = await startResponse.json();

      // Step 2: Prompt the user to authenticate with their passkey
      const data = await startAuthentication({ optionsJSON: publicKey });

      // Step 3: Submit the authentication response via a POST form
      const form = document.createElement("form");
      form.style.display = "none";
      form.method = "post";
      form.action = passkeyLoginFinishHref!;

      const input = document.createElement("input");
      input.type = "hidden";
      input.name = "json";
      // Ignore lint error for this one line, as the server needs the value to be redirect_uri
      // eslint-disable-next-line camelcase
      input.value = JSON.stringify({ data, redirect_uri: redirectURI });
      form.appendChild(input);
      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      setError((err as Error).message || "Authentication failed");
      setIsLoading(false);
    }
  };

  if (!isSupported) {
    return <p>Passkeys are not supported in this browser.</p>;
  }

  return (
    <div>
      <Button onClick={handleLogin} disabled={isLoading}>
        {isLoading ? "Authenticating…" : "Sign in with a passkey"}
      </Button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
