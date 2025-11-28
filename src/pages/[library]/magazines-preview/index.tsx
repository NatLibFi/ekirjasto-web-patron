/** @jsxRuntime classic */
/** @jsx jsx */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { jsx } from "theme-ui";
import * as React from "react";
import { NextPage, GetStaticProps, GetStaticPaths } from "next";
import LayoutPage from "components/LayoutPage";
import withAppProps, { AppProps } from "dataflow/withAppProps";
import BreadcrumbBar from "components/BreadcrumbBar";
import Head from "next/head";
import { H1 } from "components/Text";
import MagazineFilters from "components/MagazineFilters";
import MagazineTitleGrid from "components/MagazineTitleGrid";
import MagazineIssuesByYear from "components/MagazineIssuesByYear";
import LoadingIndicator from "components/LoadingIndicator";
import useMagazines from "hooks/useMagazines";
import { MagazineIssue, MagazineTitle } from "types/magazines";
import { getMagazineReaderUrl } from "config/magazines";

const MagazinesPreviewContent: React.FC = () => {
  const {
    titles,
    categories,
    issues,
    filters,
    setFilters,
    isLoading,
    error
  } = useMagazines();

  const [
    selectedTitle,
    setSelectedTitle
  ] = React.useState<MagazineTitle | null>(null);

  const handleTitleClick = (title: MagazineTitle) => {
    setSelectedTitle(title);
  };

  const handleBackToTitles = () => {
    setSelectedTitle(null);
  };

  const handleIssueClick = (issue: MagazineIssue) => {
    const path = issue.path.startsWith("/") ? issue.path : `/${issue.path}`;
    const baseUrl = getMagazineReaderUrl();
    const readerUrl = `${baseUrl}${path}`;

    // @TODO: should be a login redirect, with the ability route the user back
    // to the correct magazine after login...
    console.log("Opening magazine:", { issue, readerUrl });
  };

  // Filter titles based on current filters
  const filteredTitles = React.useMemo(() => {
    let filtered = titles;

    if (filters.selectedTitle) {
      filtered = filtered.filter(title => title.id === filters.selectedTitle);
    }

    if (filters.selectedCategory) {
      filtered = filtered.filter(title =>
        title.categoryIds?.includes(filters.selectedCategory!)
      );
    }

    return filtered;
  }, [titles, filters]);

  const selectedTitleIssues = React.useMemo(() => {
    if (!selectedTitle) return [];
    return issues.filter(issue => issue.title?.id === selectedTitle.id);
  }, [issues, selectedTitle]);

  const latestIssues = React.useMemo(() => {
    const latest: { [titleId: string]: any } = {};
    issues.forEach(issue => {
      if (issue.title?.id) {
        const titleId = issue.title.id;
        if (
          !latest[titleId] ||
          new Date(issue.publicationDate || 0) >
            new Date(latest[titleId].publicationDate || 0)
        ) {
          latest[titleId] = issue;
        }
      }
    });
    return latest;
  }, [issues]);

  if (error) {
    return (
      <div sx={{ textAlign: "center", py: 4 }}>
        <p sx={{ color: "ui.error" }}>
          Virhe ladattaessa lehtiä: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        minHeight: "60vh"
      }}
    >
      {/* Header with navigation */}
      <div sx={{ px: [3, 5], mt: 4, mb: 3 }}>
        {selectedTitle ? (
          <div sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <button
              onClick={handleBackToTitles}
              sx={{
                background: "transparent",
                border: "1px solid",
                borderColor: "ui.gray.medium",
                borderRadius: 1,
                px: 3,
                py: 2,
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "ui.gray.extraLight"
                }
              }}
            >
              ← Takaisin lehtiin
            </button>
          </div>
        ) : (
          <H1>Lehdet</H1>
        )}
      </div>

      {/* Show filters only on title list view */}
      {!selectedTitle && (
        <MagazineFilters
          titles={titles}
          categories={categories}
          filters={filters}
          onFiltersChange={setFilters}
        />
      )}

      {isLoading ? (
        <div sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <LoadingIndicator />
        </div>
      ) : selectedTitle ? (
        /* Show issues for selected title */
        <MagazineIssuesByYear
          title={selectedTitle}
          issues={selectedTitleIssues}
          onIssueClick={handleIssueClick}
        />
      ) : (
        /* Show title grid */
        <MagazineTitleGrid
          titles={filteredTitles}
          latestIssues={latestIssues}
          onTitleClick={handleTitleClick}
        />
      )}
    </div>
  );
};

const MagazinesPreviewPage: NextPage<AppProps> = ({ library, error }) => {
  return (
    <LayoutPage library={library} error={error}>
      <div
        sx={{
          flex: 1
        }}
      >
        <Head>
          <title>Lehdet - E-kirjasto</title>
        </Head>
        <BreadcrumbBar currentLocation="Lehdet" />
        <MagazinesPreviewContent />
      </div>
    </LayoutPage>
  );
};

export const getStaticProps: GetStaticProps = withAppProps();

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true
  };
};

export default MagazinesPreviewPage;
