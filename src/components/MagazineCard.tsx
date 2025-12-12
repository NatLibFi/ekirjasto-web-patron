/** @jsxRuntime classic */
/** @jsx jsx */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { jsx } from "theme-ui";
import * as React from "react";
import { AspectRatio } from "@theme-ui/components";
import { Text, H3 } from "./Text";
import LazyImage from "./LazyImage";
import { MagazineIssue } from "../types/magazines";
import { truncateString } from "../utils/string";

export const MAGAZINE_WIDTH = 187;
export const MAGAZINE_HEIGHT = 365;

type ImageLoadState = "loading" | "error" | "success";

const MagazineCover: React.FC<{
  issue: MagazineIssue;
  className?: string;
}> = ({ issue, className }) => {
  const [state, setState] = React.useState<ImageLoadState>("loading");

  const handleError = () => setState("error");
  const handleLoad = () => setState("success");

  return (
    <div
      className={className}
      sx={{
        overflow: "hidden",
        position: "relative",
        "&>div": {
          height: "100%"
        }
      }}
      aria-label={`Cover of magazine: ${issue.title?.name || issue.name}`}
      role="img"
    >
      <AspectRatio
        ratio={2 / 3}
        sx={{
          width: "100%",
          height: "100%",
          p: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "ui.gray.lightWarm"
        }}
      >
        {/* Fallback content when no image */}
        <div sx={{ textAlign: "center", p: 2 }}>
          <Text sx={{ fontSize: 0, color: "ui.gray.dark" }}>
            {issue.title?.name || issue.name}
          </Text>
        </div>
      </AspectRatio>
      {issue.coverUrl && (
        <LazyImage
          alt={`Cover of magazine: ${issue.title?.name || issue.name}`}
          src={issue.coverUrl}
          onError={handleError}
          onLoad={handleLoad}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: state === "success" ? 1 : 0,
            transition: "all 0.1s ease-in"
          }}
        />
      )}
    </div>
  );
};

const MagazineCard = React.forwardRef<
  HTMLLIElement,
  {
    issue: MagazineIssue;
    className?: string;
    onClick?: (issue: MagazineIssue) => void;
  }
>(({ issue, className, onClick }, ref) => {
  const twoLines = 42;

  const handleClick = () => {
    if (onClick) {
      onClick(issue);
    }
  };

  return (
    <li
      className={className}
      ref={ref}
      sx={{
        listStyle: "none",
        display: "flex",
        flexDirection: "column",
        flex: `0 0 ${MAGAZINE_WIDTH}px`,
        height: MAGAZINE_HEIGHT,
        mx: 2,
        cursor: onClick ? "pointer" : "default"
      }}
    >
      <button
        onClick={onClick ? handleClick : undefined}
        disabled={!onClick}
        aria-label={
          onClick ? `Open ${issue.title?.name || issue.name}` : undefined
        }
        sx={{
          border: "none",
          background: "transparent",
          padding: 0,
          cursor: onClick ? "pointer" : "default",
          width: "100%",
          textAlign: "left",
          "&:hover": onClick
            ? {
                transform: "scale(1.02)",
                transition: "transform 0.2s ease-in-out"
              }
            : {},
          "&:focus": onClick
            ? {
                outline: "2px solid",
                outlineColor: "ui.blue.focus",
                outlineOffset: "2px"
              }
            : {},
          "&:disabled": {
            cursor: "default"
          }
        }}
      >
        <MagazineCover issue={issue} />
        <div sx={{ flex: "1 1 auto" }} />
        <H3 sx={{ m: 0, mt: 1, fontSize: -1 }}>
          {truncateString(issue.title?.name || issue.name, twoLines, false)}
        </H3>
        {issue.name !== issue.title?.name && (
          <Text sx={{ fontSize: -1, color: "ui.gray.dark" }}>
            {truncateString(issue.name, twoLines, false)}
          </Text>
        )}
        {issue.publicationDate && (
          <Text sx={{ fontSize: -2, color: "ui.gray.medium" }}>
            {new Date(issue.publicationDate).toLocaleDateString()}
          </Text>
        )}
      </button>
    </li>
  );
});

MagazineCard.displayName = "MagazineCard";

export default MagazineCard;
