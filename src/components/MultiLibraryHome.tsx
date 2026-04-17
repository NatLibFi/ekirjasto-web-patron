/* eslint-disable jsx-a11y/anchor-is-valid */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, ThemeUIProvider } from "theme-ui";
import { Themed } from "@theme-ui/mdx";
import * as React from "react";
import Link from "next/link";
import { APP_CONFIG } from "utils/env";
import theme from "theme/theme";
import { useTranslation } from "next-i18next";

const MultiLibraryHome: React.FC = () => {
  const { libraries, instanceName } = APP_CONFIG;
  const slugs = Object.keys(libraries);
  const { t } = useTranslation();

  // just in case check if we have no libraries
  // and show user the "No libraries available" page
  // (this should not happen for E-kirjasto)
  if (!libraries || slugs.length === 0) {
    return renderNoLibraries(instanceName, t);
  }

  return renderLibrarySelection(instanceName, t, slugs, libraries);
};

// helper function that renders the "No libraries available"
const renderNoLibraries = (instanceName: string, t: any) => (
  <ThemeUIProvider theme={theme}>
    <Themed.root sx={{ m: 3 }}>
      {/* render app name and header only */}
      <h1>{instanceName}</h1>
      <h3>{t("multiLibraryHome.noLibraries")}</h3>
    </Themed.root>
  </ThemeUIProvider>
);

// helper function that renders the library selection list
const renderLibrarySelection = (
  instanceName: string,
  t: any,
  slugs: string[],
  libraries: Record<string, { title: string; authDocUrl: string } | undefined>
) => (
  <ThemeUIProvider theme={theme}>
    <Themed.root
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        m: 3
      }}
    >
      {/* render app name and header */}
      <h1>{instanceName}</h1>
      <h3>{t("multiLibraryHome.chooseLibrary")}</h3>

      {/* render list of libraries */}
      <ul>
        {slugs.map(slug => (
          <li key={slug}>
            {/* render library title as a link leading to library's frontpage */}
            <Link href={`/${slug}`}>{libraries[slug]?.title}</Link>
          </li>
        ))}
      </ul>
    </Themed.root>
  </ThemeUIProvider>
);

export default MultiLibraryHome;
