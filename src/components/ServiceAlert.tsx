/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "theme-ui";
import * as React from "react";
import { useRouter } from "next/router";
import DOMPurify from "dompurify";
import { isAppLocale } from "../../appLocales";
import useLibraryContext from "./context/LibraryContext";
import AlertBar from "./AlertBar";

const ServiceAlert: React.FC = () => {
  const { serviceAlert } = useLibraryContext();
  const { locale } = useRouter();

  // Temporarily show the alert regardless of the admin setting for testing.

  const configuredMessage =
    typeof serviceAlert?.message === "string"
      ? serviceAlert.message
      : locale && isAppLocale(locale)
      ? serviceAlert?.message?.[locale]
      : undefined;
  const message = configuredMessage?.trim();

  if (!message) return null;

  return (
    <AlertBar key={message} backgroundColor="#FFDCDD">
      <div
        sx={{
          "& p": { m: 0 },
          "& p + p": { mt: 2 },
          "& a": { color: "inherit", textDecoration: "underline" },
          "& strong, & b": { fontWeight: "bold" }
        }}
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(message, {
            ALLOWED_TAGS: ["a", "p", "strong", "b", "br"],
            ALLOWED_ATTR: ["href", "title", "target", "rel"]
          })
        }}
      />
    </AlertBar>
  );
};

export default ServiceAlert;
