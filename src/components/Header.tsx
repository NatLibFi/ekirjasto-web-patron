/** @jsxRuntime classic */
/** @jsx jsx */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { jsx } from "theme-ui";
import * as React from "react";
import { LibraryData } from "../interfaces";
import Search from "./Search";
import Button, { NavButton, AnchorButton } from "./Button";
import Link from "./Link";
import BookIcon from "../icons/Book";
import useLibraryContext from "./context/LibraryContext";
import { Text } from "./Text";
import Stack from "./Stack";
import { SignOut } from "./SignOut";
import useUser from "components/context/UserContext";
import useLogin from "auth/useLogin";
import { useTranslation } from "next-i18next";
import LanguageSelector from "components/LanguageSelector";

const HeaderFC: React.FC<{ className?: string }> = ({ className }) => {
  const library = useLibraryContext();
  const { t } = useTranslation();

  return (
    <header
      sx={{
        display: "flex",
        flexDirection: ["column", "column", "row"],
        alignItems: "stretch",
        px: [3, 5],
        py: 3
      }}
      className={className}
    >
      <Link
        href="/"
        aria-label={t("header.ariaLabelForLibraryCatalogLink")}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: ["center", "flex-start"],
          textAlign: "center",
          p: 3,
          mb: [1, 0]
        }}
      >
        {library.logoUrl ? (
          <img src={library.logoUrl} alt={`${library.catalogName} Logo`} />
        ) : (
          <Text variant="text.headers.primary">{library.catalogName}</Text>
        )}
      </Link>
      <Stack
        direction="column"
        spacing={4}
        sx={{
          // flexDirection: "column",
          // flexWrap: "wrap",
          alignItems: ["stretch", "flex-end"],
          // justifyContent: "space-between",
          flex: 1
        }}
      >
        <HeaderLinks library={library} />
        <Search sx={{ minWidth: ["initial", 370], mr: [3, 0] }} />
      </Stack>
    </header>
  );
};

const HeaderLinks: React.FC<{ library: LibraryData }> = ({ library }) => {
  const { helpWebsite, libraryWebsite } = library.libraryLinks;
  const { isAuthenticated, isLoading } = useUser();
  const { baseLoginUrl } = useLogin();
  const { t } = useTranslation();

  return (
    <div
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: ["center", "flex-end"]
      }}
    >
      <LanguageSelector />
      {library?.headerLinks?.map(link => (
        <AnchorButton
          variant="ghost"
          color="ui.black"
          href={link.href}
          title={link.title}
          key={link.href}
        >
          {link.title}
        </AnchorButton>
      ))}
      {helpWebsite && (
        <AnchorButton variant="ghost" color="ui.black" href={helpWebsite.href}>
          {t("header.labelForHelpButton")}
        </AnchorButton>
      )}
      {libraryWebsite && (
        <AnchorButton
          variant="ghost"
          color="ui.black"
          href={libraryWebsite.href}
          sx={{ whiteSpace: "initial" }}
        >
          {libraryWebsite.title ?? t("header.labelForHome")}
        </AnchorButton>
      )}
      {isAuthenticated ? (
        <NavButton
          variant="ghost"
          color="ui.black"
          href="/magazines"
          sx={{ mr: 1 }}
        >
          {t("header.labelForMagazinesButton")}
        </NavButton>
      ) : (
        <NavButton
          variant="ghost"
          color="ui.black"
          href="/magazines-preview"
          sx={{ mr: 1 }}
        >
          {t("header.labelForMagazinesPreviewButton")}
        </NavButton>
      )}
      <NavButton
        variant="ghost"
        color="ui.black"
        href="/loans"
        iconLeft={BookIcon}
        sx={{ mr: 1 }}
      >
        {t("header.labelForMyBooksButton")}
      </NavButton>
      {isAuthenticated ? (
        <SignOut />
      ) : isLoading ? (
        <Button loading />
      ) : (
        <NavButton
          style={{ borderRadius: "30px" }}
          color="ui.ekirjastogreen"
          href={baseLoginUrl}
        >
          {t("header.labelForSignInButton")}
        </NavButton>
      )}
    </div>
  );
};

export default HeaderFC;
