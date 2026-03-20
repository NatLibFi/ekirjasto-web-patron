import React, { useEffect, useRef } from "react";
import useLibraryContext from "./context/LibraryContext";

const Feedback: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const library = useLibraryContext();

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

  return (
    <div
      aria-label="Feedback Form"
      style={{
        width: "100%",
        height: "100%",
        border: "none",
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: 0
      }}
    >
      <iframe
        ref={iframeRef}
        src="https://lib.e-kirjasto.fi/palaute/"
        src={library.feedbackUrl || undefined}
        title="Feedback"
        width="90%"
        height="100%"
        style={{
          flex: 1,
          minHeight: 0,
          display: "block",
          margin: "0 auto",
          borderWidth: 0
        }}
        allowFullScreen
      />
    </div>
  );
};

export default Feedback;
