/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "theme-ui";
import * as React from "react";
import { useRouter } from "next/router";
import DOMPurify from "dompurify";
import { isAppLocale } from "../../appLocales";
import useLibraryContext from "./context/LibraryContext";
import AlertBar from "./AlertBar";

const ALLOWED_URI_REGEXP = /^(?:(?:https?:|mailto:)|[^a-z]|[a-z+.-]+(?:[^a-z+.-:]|$))/i;

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
        <SanitizedAnnouncement key={id} id={id} message={message} />
      ))}
    </>
  );
};

const SanitizedAnnouncement: React.FC<{ id: string; message: string }> = ({
  id,
  message
}) => {
  const [sanitized, setSanitized] = React.useState<{
    message: string;
    html: string;
  } | null>(null);

  React.useEffect(() => {
    setSanitized({
      message,
      html: DOMPurify.sanitize(message, {
        ALLOWED_TAGS: [
          "p",
          "br",
          "strong",
          "em",
          "h1",
          "h2",
          "h3",
          "h4",
          "ul",
          "ol",
          "li",
          "a"
        ],
        ALLOWED_ATTR: ["href", "title"],
        ALLOWED_URI_REGEXP
      })
    });
  }, [message]);

  if (sanitized?.message !== message) return null;

  return (
    <AlertBar key={id} backgroundColor="#FFDCDD">
      <div
        sx={{
          "& p": { m: 0 },
          "& p + p": { mt: 2 },
          "& a": { color: "inherit", textDecoration: "underline" },
          "& strong, & b": { fontWeight: "bold" }
        }}
        dangerouslySetInnerHTML={{ __html: sanitized.html }}
      />
    </AlertBar>
  );
};

export default ServiceAlert;
