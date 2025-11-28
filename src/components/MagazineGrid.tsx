/** @jsxRuntime classic */
/** @jsx jsx */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { jsx } from "theme-ui";
import * as React from "react";
import MagazineCard from "./MagazineCard";
import { MagazineIssue } from "../types/magazines";

interface MagazineGridProps {
  issues: MagazineIssue[];
  onIssueClick?: (issue: MagazineIssue) => void;
  className?: string;
}

const MagazineGrid: React.FC<MagazineGridProps> = ({
  issues,
  onIssueClick,
  className
}) => {
  if (issues.length === 0) {
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
      {issues.map(issue => (
        <div key={issue.id} sx={{ display: "flex", justifyContent: "center" }}>
          <MagazineCard issue={issue} onClick={onIssueClick} />
        </div>
      ))}
    </div>
  );
};

export default MagazineGrid;
