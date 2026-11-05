/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "theme-ui";
import * as React from "react";
import { useTranslation } from "next-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faClose
} from "@fortawesome/free-solid-svg-icons";

interface AlertBarProps {
  children: React.ReactNode;
  backgroundColor: string;
}

const AlertBar: React.FC<AlertBarProps> = ({ children, backgroundColor }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(true);
  const { t } = useTranslation();

  if (!isVisible) return null;

  return (
    <div
      sx={{
        backgroundColor,
        color: "ui.black",
        m: 0,
        p: 2,
        px: [3, 5],
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 2,
        fontSize: "-1"
      }}
    >
      <div
        role="status"
        sx={{
          flex: 1,
          minWidth: 0,
          ...(!isExpanded && {
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 1,
            overflow: "hidden"
          })
        }}
      >
        {children}
      </div>
      <div
        sx={{ display: "flex", alignItems: "center", gap: 3, flexShrink: 0 }}
      >
        <button
          type="button"
          aria-expanded={isExpanded}
          aria-label={t(isExpanded ? "alertBar.collapse" : "alertBar.expand")}
          onClick={() => setIsExpanded(expanded => !expanded)}
          sx={buttonStyle}
        >
          {isExpanded ? t("alertBar.collapse") : t("alertBar.expand")}
          <FontAwesomeIcon icon={isExpanded ? faChevronUp : faChevronDown} />
        </button>
        <button
          type="button"
          aria-label={t("alertBar.close")}
          onClick={() => setIsVisible(false)}
          sx={buttonStyle}
        >
          <FontAwesomeIcon icon={faClose} />
        </button>
      </div>
    </div>
  );
};

const buttonStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  width: "auto",
  minHeight: "1.5em",
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
};

export default AlertBar;
