/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "theme-ui";
import * as React from "react";
import { LibraryData } from "../interfaces";
import Search from "./Search";
import Button, { NavButton, AnchorButton } from "./Button";
import BrowseIcon from "../icons/Browse";
import MagazinesIcon from "../icons/Magazines";
import MyBooksIcon from "../icons/MyBooks";
import useLibraryContext from "./context/LibraryContext";
import Stack from "./Stack";
import { SignOut } from "./SignOut";
import useUser from "components/context/UserContext";
import useLogin from "auth/useLogin";
import { useTranslation } from "next-i18next";
import LanguageSelector from "components/LanguageSelector";
import EkirjastoHeaderLogo from "components/logosAndBadges/EkirjastoHeaderLogo";

const HeaderFC: React.FC<{ className?: string }> = ({ className }) => {
  const library = useLibraryContext();

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
      <Stack
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: ["center", "flex-start"],
          p: 3,
          mb: [1, 0]
        }}
      >
        <EkirjastoHeaderLogo />
      </Stack>

      <Stack
        direction="column"
        spacing={4}
        sx={{
          alignItems: ["stretch", "flex-end"],
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
  const { libraryWebsite } = library.libraryLinks;
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

      {libraryWebsite && (
        <AnchorButton
          variant="ghost"
          color="ui.black"
          href={libraryWebsite.href}
          iconLeft={BrowseIcon}
          sx={{ whiteSpace: "initial", ml: 3 }}
        >
          {libraryWebsite.title ?? t("header.labelForHome")}
        </AnchorButton>
      )}

      {isAuthenticated ? (
        <NavButton
          variant="ghost"
          color="ui.black"
          href="/magazines"
          iconLeft={MagazinesIcon}
          sx={{ mr: 1 }}
        >
          {t("header.labelForMagazinesButton")}
        </NavButton>
      ) : (
        <NavButton
          variant="ghost"
          color="ui.black"
          href="/magazines-preview"
          iconLeft={MagazinesIcon}
          sx={{ mr: 1 }}
        >
          {t("header.labelForMagazinesPreviewButton")}
        </NavButton>
      )}

      {isAuthenticated && (
        <NavButton
          variant="ghost"
          color="ui.black"
          href="/loans"
          iconLeft={MyBooksIcon}
          sx={{ mr: 3 }}
        >
          {t("header.labelForMyBooksButton")}
        </NavButton>
      )}

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
