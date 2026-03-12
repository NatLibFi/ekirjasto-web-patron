import React, { useRef } from "react";
import useBreadcrumbContext from "components/context/BreadcrumbContext";
import BreadcrumbBar from "./BreadcrumbBar";

const Feedback: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const { storedBreadcrumbs } = useBreadcrumbContext();

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
      <BreadcrumbBar
        breadcrumbs={storedBreadcrumbs}
        currentLocation="Feedback"
      />
      <iframe
        ref={iframeRef}
        src="https://lib.e-kirjasto.fi/palaute/"
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
