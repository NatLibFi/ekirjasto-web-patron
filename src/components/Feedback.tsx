import React, { useEffect, useRef } from "react";
import useLibraryContext from "./context/LibraryContext";
import { useTranslation } from "next-i18next";

const Feedback: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const library = useLibraryContext();
  const { t } = useTranslation();

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      console.debug(
        "[Feedback] Received postMessage:",
        event.data,
        "from",
        event.origin
      );
      // Only messages from trusted source are accespted
      if (
        event.data &&
        event.data.type === "feedback-csrf-token" &&
        typeof event.data.csrfToken === "string" &&
        event.origin === library.feedbackUrl
      ) {
        console.debug("[Feedback] CSRF token received:", event.data.csrfToken);
      }
    }
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [library.feedbackUrl]);

  // Fixed-height layout where the iframe scrolls.
  return (
    <div
      aria-label={t("feedback.ariaLabel")}
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        flex: "1 1 auto",
        minHeight: 0,
        overflow: "hidden",
        position: "relative"
      }}
    >
      <iframe
        ref={iframeRef}
        // "http://127.0.0.1:5000/palaute/" locally
        src={library.feedbackUrl || undefined}
        title={t("feedback.title")}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          border: 0,
          flex: 1
        }}
        allowFullScreen
      />
    </div>
  );
};

export default Feedback;
