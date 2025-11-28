/** @jsxRuntime classic */
/** @jsx jsx */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { jsx } from "theme-ui";
import * as React from "react";
import MagazineTitleCard from "./MagazineTitleCard";
import { MagazineTitle } from "../types/magazines";

interface MagazineTitleGridProps {
  titles: MagazineTitle[];
  latestIssues: { [titleId: string]: any };
  onTitleClick?: (title: MagazineTitle) => void;
  className?: string;
}

const MagazineTitleGrid: React.FC<MagazineTitleGridProps> = ({
  titles,
  latestIssues,
  onTitleClick,
  className
}) => {
  if (titles.length === 0) {
    return (
      <div
        className={className}
        sx={{
          textAlign: "center",
          py: 4,
          color: "ui.gray.dark"
        }}
      >
        <p>Ei lehtiä saatavilla valituilla suodattimilla.</p>
      </div>
    );
  }

  return (
    <div
      className={className}
      sx={{
        display: "grid",
        gridTemplateColumns: [
          "repeat(auto-fill, minmax(150px, 1fr))",
          "repeat(auto-fill, minmax(180px, 1fr))",
          "repeat(auto-fill, minmax(187px, 1fr))"
        ],
        gap: [2, 3, 4],
        px: [2, 3, 4],
        py: 3
      }}
    >
      {titles.map(title => (
        <div key={title.id} sx={{ display: "flex", justifyContent: "center" }}>
          <MagazineTitleCard
            title={title}
            latestIssue={latestIssues[title.id]}
            onClick={onTitleClick}
          />
        </div>
      ))}
    </div>
  );
};

export default MagazineTitleGrid;
