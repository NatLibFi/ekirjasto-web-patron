/** @jsxRuntime classic */
/** @jsx jsx */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { jsx } from "theme-ui";
import * as React from "react";
import { H2 } from "./Text";
import MagazineCard from "./MagazineCard";
import { MagazineIssue, MagazineTitle } from "../types/magazines";

interface MagazineIssuesByYearProps {
  title: MagazineTitle;
  issues: MagazineIssue[];
  onIssueClick?: (issue: MagazineIssue) => void;
  className?: string;
}

const MagazineIssuesByYear: React.FC<MagazineIssuesByYearProps> = ({
  title,
  issues,
  onIssueClick,
  className
}) => {
  // Group issues by year
  const issuesByYear = React.useMemo(() => {
    const grouped: { [year: string]: MagazineIssue[] } = {};

    issues.forEach(issue => {
      if (issue.publicationDate) {
        const year = new Date(issue.publicationDate).getFullYear().toString();
        if (!grouped[year]) {
          grouped[year] = [];
        }
        grouped[year].push(issue);
      }
    });

    // Sort issues within each year by publication date (newest first)
    Object.keys(grouped).forEach(year => {
      grouped[year].sort((a, b) => {
        const dateA = new Date(a.publicationDate || 0);
        const dateB = new Date(b.publicationDate || 0);
        return dateB.getTime() - dateA.getTime();
      });
    });

    return grouped;
  }, [issues]);

  // Get years sorted in descending order (newest first)
  const years = Object.keys(issuesByYear).sort(
    (a, b) => parseInt(b) - parseInt(a)
  );

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
        <p>Ei numeroita saatavilla tälle lehdelle.</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Magazine title and info */}
      <div sx={{ px: [3, 5], mt: 4, mb: 3 }}>
        <H2>{title.name}</H2>
        {title.publisher && (
          <p sx={{ color: "ui.gray.dark", mt: 1 }}>
            Kustantaja: {title.publisher}
          </p>
        )}
        {title.language && (
          <div
            sx={{
              display: "inline-block",
              backgroundColor: "ui.gray.extraLight",
              px: 2,
              py: 1,
              borderRadius: 1,
              fontSize: -1,
              mt: 2
            }}
          >
            {title.language === "fi"
              ? "suomi"
              : title.language === "sv"
              ? "svenska"
              : title.language === "en"
              ? "english"
              : title.language}
          </div>
        )}
      </div>

      {/* Issues grouped by year */}
      {years.map(year => (
        <div key={year} sx={{ mb: 4 }}>
          {/* Year header */}
          <div
            sx={{
              px: [3, 5],
              py: 2,
              backgroundColor: "ui.gray.extraLight",
              borderLeft: "4px solid",
              borderColor: "brand.primary"
            }}
          >
            <H2 sx={{ m: 0, fontSize: 2 }}>{year}</H2>
          </div>

          {/* Issues grid for this year */}
          <div
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
            {issuesByYear[year].map(issue => (
              <div
                key={issue.id}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <MagazineCard issue={issue} onClick={onIssueClick} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MagazineIssuesByYear;
