/** @jsxRuntime classic */
/** @jsx jsx */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { jsx } from "theme-ui";
import * as React from "react";
import { AspectRatio } from "@theme-ui/components";
import { Text, H3 } from "./Text";
import LazyImage from "./LazyImage";
import { MagazineTitle } from "../types/magazines";
import { truncateString } from "../utils/string";

export const MAGAZINE_TITLE_WIDTH = 187;
export const MAGAZINE_TITLE_HEIGHT = 365;

type ImageLoadState = "loading" | "error" | "success";

const MagazineTitleCover: React.FC<{
  title: MagazineTitle;
  latestIssue?: any;
  className?: string;
}> = ({ title, latestIssue, className }) => {
  const [state, setState] = React.useState<ImageLoadState>("loading");

  const handleError = () => setState("error");
  const handleLoad = () => setState("success");

  // Use the latest issue's cover if available
  const coverUrl = latestIssue?.coverUrl;

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
      aria-label={`Cover of magazine: ${title.name}`}
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
          <Text sx={{ fontSize: 0, color: "ui.gray.dark" }}>{title.name}</Text>
        </div>
      </AspectRatio>
      {coverUrl && (
        <LazyImage
          alt={`Cover of magazine: ${title.name}`}
          src={coverUrl}
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

const MagazineTitleCard = React.forwardRef<
  HTMLLIElement,
  {
    title: MagazineTitle;
    latestIssue?: any;
    className?: string;
    onClick?: (title: MagazineTitle) => void;
  }
>(({ title, latestIssue, className, onClick }, ref) => {
  const twoLines = 42;

  const handleClick = () => {
    if (onClick) {
      onClick(title);
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
        flex: `0 0 ${MAGAZINE_TITLE_WIDTH}px`,
        height: MAGAZINE_TITLE_HEIGHT,
        mx: 2,
        cursor: onClick ? "pointer" : "default"
      }}
    >
      <button
        onClick={onClick ? handleClick : undefined}
        disabled={!onClick}
        aria-label={onClick ? `View ${title.name} issues` : undefined}
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
        <MagazineTitleCover title={title} latestIssue={latestIssue} />
        <div sx={{ flex: "1 1 auto" }} />
        <H3 sx={{ m: 0, mt: 1, fontSize: -1 }}>
          {truncateString(title.name, twoLines, false)}
        </H3>
        {title.publisher && (
          <Text sx={{ fontSize: -1, color: "ui.gray.dark" }}>
            {truncateString(title.publisher, twoLines, false)}
          </Text>
        )}
      </button>
    </li>
  );
});

MagazineTitleCard.displayName = "MagazineTitleCard";

export default MagazineTitleCard;
