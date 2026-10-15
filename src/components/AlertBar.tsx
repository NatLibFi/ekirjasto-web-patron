/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "theme-ui";
import * as React from "react";
import { useTranslation } from "next-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

interface AlertBarProps {
  children: React.ReactNode;
  backgroundColor: string;
}

const AlertBar: React.FC<AlertBarProps> = ({ children, backgroundColor }) => {
  const [isVisible, setIsVisible] = React.useState(true);
  const { t } = useTranslation();

  if (!isVisible) return null;

  return (
    <div
      sx={{
        backgroundColor,
        color: "ui.white",
        m: 0,
        p: 2,
        px: [3, 5],
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        fontSize: "-1"
      }}
    >
      <div role="status">{children}</div>
      <button
        type="button"
        aria-label={t("alertBar.close")}
        onClick={() => setIsVisible(false)}
        sx={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          width: "1.5em",
          height: "1.5em",
          p: 0,
          border: 0,
          backgroundColor: "transparent",
          color: "inherit",
          fontSize: "inherit",
          cursor: "pointer",
          "&:focus-visible": {
            outline: "2px solid currentColor",
            outlineOffset: "2px"
          }
        }}
      >
        <FontAwesomeIcon icon={faClose} />
      </button>
    </div>
  );
};

export default AlertBar;
