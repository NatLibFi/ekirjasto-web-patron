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
  const { announcements } = useLibraryContext();
  const { locale } = useRouter();

  const messages = announcements?.flatMap(announcement => {
    const message =
      locale && isAppLocale(locale)
        ? announcement.content?.[locale]?.trim()
        : undefined;
    return message ? [{ id: announcement.id, message }] : [];
  });

  if (!messages?.length) return null;

  return (
    <>
      {messages.map(({ id, message }) => (
        <AlertBar key={id} backgroundColor="#FFDCDD">
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
      ))}
    </>
  );
};

export default ServiceAlert;
