/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "theme-ui";
import * as React from "react";
import { LibraryData } from "../interfaces";
import Search from "./Search";
import Button, { NavButton, AnchorButton } from "../components/Button";
import BrowseIcon from "../icons/Browse";
import MagazinesIcon from "../icons/Magazines";
import MyBooksIcon from "../icons/MyBooks";
import useLibraryContext from "./context/LibraryContext";
import { SignOut } from "./SignOut";
import useUser from "components/context/UserContext";
import useLogin from "auth/useLogin";
import { PasskeyCreate } from "auth/PasskeyCreate";
import { useTranslation } from "next-i18next";
import LanguageSelector from "components/LanguageSelector";
import EkirjastoHeaderLogo from "components/logosAndBadges/EkirjastoHeaderLogo";

const HeaderFC: React.FC<{ className?: string }> = ({ className }) => {
  const library = useLibraryContext();
  const { isAuthenticated, isLoading } = useUser();
  const { baseLoginUrl } = useLogin();
  const { t } = useTranslation();

  return (
    <header
      sx={{
        display: "grid",
        gridTemplateColumns: [
          "minmax(0, 1fr) minmax(0, 1.5fr) minmax(0, 1fr)",
          "auto minmax(0, 1fr) auto"
        ],
        alignItems: "start",
        gap: [2, 3],
        px: [3, 4, 5],
        py: 3
      }}
      className={className}
    >
      <div
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          alignSelf: "stretch",
          gridColumn: 1,
          gridRow: "1 / 3",
          minWidth: 0,
          maxWidth: "100%",
          "& a": { display: "flex", maxWidth: "100%" },
          "& svg": {
            display: "block",
            height: [42, 56, 70],
            maxWidth: "100%"
          }
        }}
      >
        <EkirjastoHeaderLogo />
      </div>
      <div
        sx={{
          display: "contents"
        }}
      >
        <HeaderLinks library={library} />
      </div>
      <div
        sx={{
          gridColumn: 3,
          gridRow: 1,
          justifySelf: "end",
          minWidth: 0,
          maxWidth: "100%",
          "& > a, & > button": {
            maxWidth: "100%",
            whiteSpace: "normal",
            height: "auto",
            minHeight: "32px",
            py: 1
          }
        }}
      >
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
    </header>
  );
};

const HeaderLinks: React.FC<{ library: LibraryData }> = ({ library }) => {
  const { isAuthenticated } = useUser();
  const { t } = useTranslation();

  return (
    <>
      <nav
        sx={{
          gridColumn: 2,
          gridRow: 1,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: 2,
          flex: "1 1 auto",
          width: "max-content",
          maxWidth: "100%",
          minWidth: 0,
          "& > *": {
            flexShrink: 0,
            maxWidth: "100%"
          }
        }}
      >
        <div
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 2,
            width: "max-content",
            minWidth: 0,
            maxWidth: "100%",
            "& > *": { flexShrink: 0, maxWidth: "100%" },
            "& > a, & > button": {
              whiteSpace: "normal",
              textAlign: "center",
              height: "auto",
              minHeight: "32px",
              py: 1
            }
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

          <NavButton
            variant="ghost"
            color="ui.black"
            href="/"
            iconLeft={BrowseIcon}
          >
            {t("header.labelForHome")}
          </NavButton>

          {isAuthenticated ? (
            <NavButton
              variant="ghost"
              color="ui.black"
              href="/magazines"
              iconLeft={MagazinesIcon}
            >
              {t("header.labelForMagazinesButton")}
            </NavButton>
          ) : (
            <NavButton
              variant="ghost"
              color="ui.black"
              href="/magazines-preview"
              iconLeft={MagazinesIcon}
            >
              {t("header.labelForMagazinesPreviewButton")}
            </NavButton>
          )}

          <AnchorButton
            variant="ghost"
            color="ui.black"
            href={t("footer.hrefElibraryInstructions")}
          >
            {t("header.labelForInstructionsButton")}
          </AnchorButton>

          <AnchorButton
            variant="ghost"
            color="ui.black"
            href={t("footer.hrefElibraryAlwaysWithYou")}
          >
            {t("header.labelForAboutButton")}
          </AnchorButton>

          {isAuthenticated && (
            <NavButton
              variant="ghost"
              color="ui.black"
              href="/loans"
              iconLeft={MyBooksIcon}
            >
              {t("header.labelForMyBooksButton")}
            </NavButton>
          )}
        </div>
      </nav>

      <div
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "flex-end",
          gridColumn: "2 / 4",
          gridRow: 2,
          justifySelf: "end",
          gap: 2,
          flex: "0 1 auto",
          width: "max-content",
          maxWidth: "100%",
          minWidth: 0,
          ml: "auto",
          "& > *": { flexShrink: 0, maxWidth: "100%" }
        }}
      >
        <Search
          sx={{
            width: 370,
            flex: ["1 1 160px", "0 1 370px"],
            maxWidth: "100%",
            minWidth: 0,
            "& input": {
              minWidth: 0,
              height: "40px",
              padding: "8px 12px"
            },
            "& button": { height: "40px", py: 0 }
          }}
        />

        {isAuthenticated && <PasskeyCreate />}
      </div>
    </>
  );
};

export default HeaderFC;
