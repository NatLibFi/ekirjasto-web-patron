/** @jsxRuntime classic */
/** @jsx jsx */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { jsx } from "theme-ui";
import * as React from "react";
import Link from "./Link";
import List, { ListItem } from "./List";
import { LinkData } from "interfaces";
import useLibraryContext from "components/context/LibraryContext";
import { useTranslation } from "next-i18next";

const BreadcrumbBar: React.FC<{
  className?: string;
  currentLocation?: string;
  breadcrumbs?: Readonly<LinkData[]>;
  children?: React.ReactNode;
}> = ({ children, className, currentLocation, breadcrumbs: crumbsIn }) => {
  // make a local copy, so we can mutate this array without
  // affecting the referenced value

  const breadcrumbs = crumbsIn ? [...crumbsIn] : [];

  const { catalogUrl, catalogName } = useLibraryContext();

  // Keep the current page separate from navigable breadcrumb links and fall back to the catalog root.
  const lastItem = currentLocation ?? breadcrumbs.pop()?.text;
  const breadcrumbsWithAtLeastOne =
    crumbsIn && crumbsIn.length > 0
      ? breadcrumbs
      : [{ text: catalogName, url: catalogUrl }];

  const { t } = useTranslation();

  return (
    <div
      className={className}
      sx={{
        backgroundColor: "brand.primary",
        color: "ui.white",
        m: 0,
        p: 2,
        px: [3, 5],
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}
    >
      <List
        sx={{
          display: "flex",
          alignItems: "center",
          variant: "lists.unstyled",
          fontSize: "-1",
          flexWrap: "wrap",
          whiteSpace: "nowrap"
        }}
      >
        {breadcrumbsWithAtLeastOne.map(
          breadcrumb =>
            breadcrumb.text &&
            breadcrumb.url && (
              <ListItem key={breadcrumb.url}>
                {breadcrumb.url.startsWith("/") ? (
                  <Link href={{ pathname: breadcrumb.url }}>
                    {breadcrumb.text}
                  </Link>
                ) : (
                  <Link collectionUrl={breadcrumb.url}>{breadcrumb.text}</Link>
                )}
                &nbsp;/&nbsp;
              </ListItem>
            )
        )}
        <ListItem
          aria-label={t("breadcrumbBar.currentLocation") + `${lastItem}`}
        >
          {lastItem ? lastItem : ""}
        </ListItem>
      </List>
      {children}
    </div>
  );
};

export default BreadcrumbBar;
