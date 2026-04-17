/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from "react";
import { APP_CONFIG } from "utils/env";
import { jsx, ThemeUIProvider } from "theme-ui";
import { NextRouter, useRouter } from "next/router";
import { PageLoader } from "components/LoadingIndicator";
import { useTranslation } from "next-i18next";
import { Themed } from "@theme-ui/mdx";
import Link from "next/link";
import theme from "theme/theme";

/**
 * Handles the app library routing logic
 * based on the number of available libraries.
 *
 * - if there is only one library => user is redirected to that library's frontpage
 * - if there are no libraries => "No libraries available" is rendered
 * - if multiple libraries are available =>  a selection list of libraries is rendered
 */
const MultiLibraryHome: React.FC = () => {
  const { libraries, instanceName } = APP_CONFIG;
  const slugs = Object.keys(libraries ?? {});
  const { t } = useTranslation();
  const router = useRouter();

  // define state to handle showing loading indicator
  // set initial state to loading=true
  const [loading, setLoading] = React.useState(true);

  // effect that calls handleLibraryRouting function
  // to handle loading state and the app's routing logic
  // based on the number of libraries (slugs) available
  React.useEffect(() => {
    handleLibraryRouting(slugs, router, setLoading);
  }, [slugs, router]);

  // show loading indicator while fetching data
  if (loading) return <PageLoader />;

  // just in case check if we have no libraries
  // and show user the "No libraries available" page
  // (this should not happen for E-kirjasto)
  if (slugs.length === 0) {
    return renderNoLibraries(instanceName, t);
  }

  // show user the library selection list
  // (this should not happen for E-kirjasto because
  // the user should already be redirected to the E-kirjasto frontpage)
  return renderLibrarySelection(instanceName, t, slugs, libraries);
};

// helper function that updates the loading state
// and also handles redirection in the case
// that there is only one library
const handleLibraryRouting = (
  slugs: string[],
  router: NextRouter,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  // check the special case:
  // if only one library is found
  if (slugs.length === 1) {
    // one library found!
    // note: this should be the E-kirjasto case

    // first get the slug
    // note: this should be "ekirjasto"
    const singleLibrarySlug = slugs[0];

    // then redirect the user to the frontpage
    // of this single library
    // note: this is the "/ekirjasto" route
    router.replace(`/${singleLibrarySlug}`);

    // and return early after redirection
    return;
  }

  // all other cases (we have no libraries found
  // or we have multiple libraries):
  // just stop the loading state
  setLoading(false);
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
