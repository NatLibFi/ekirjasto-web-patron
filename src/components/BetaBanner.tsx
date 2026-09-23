/** @jsxRuntime classic */
/** @jsx jsx */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { jsx } from "theme-ui";
import React, { useCallback, useEffect, useState } from "react";
import Button from "components/Button";
import { H3, Text } from "components/Text";
import Stack from "components/Stack";
import { useTranslation } from "next-i18next";
import ExternalLinkIcon from "icons/ExternalLink";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

// define style for the Stack component
const stackStyle: React.CSSProperties = {
  backgroundColor: "#F0F1C2",
  alignItems: "center",
  justifyContent: "center",
  padding: 3
};

// define style for the Button component
const buttonStyle: React.CSSProperties = {
  position: "absolute",
  top: 2,
  right: 2,
  fontSize: 3,
  padding: 2
};

// define key name for browser session storage
const STORAGE_KEY = "beta-banner-closed";

const BetaBanner: React.FC = () => {
  const { t } = useTranslation();

  // define state for banner visibility, set default state as false
  const [isVisible, setIsVisible] = useState<boolean>(false);

  // define state for client mounting, set default state as false
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // define info texts for beta banner
  const welcomeText = t("betaBanner.infoWelcome");
  const infoEbooksAndMagazinesText = t("betaBanner.infoEbooksAndMagazines");
  const infoAudiobooksText = t("betaBanner.infoAudiobooks");

  const ekirjastoText = t("betaBanner.infoEkirjasto");
  const ariaLabelForInfoEkirjasto =
    t("betaBanner.infoEkirjasto") + " " + t("externalLink.opensInNewTab");

  const webText = t("betaBanner.infoWeb");
  const ariaLabelForInfoWeb =
    t("betaBanner.infoWeb") + " " + t("externalLink.opensInNewTab");

  const androidText = t("betaBanner.infoAndroid");
  const ariaLabelForInfoAndroid =
    t("betaBanner.infoAndroid") + " " + t("externalLink.opensInNewTab");

  const iosText = t("betaBanner.infoIos");
  const ariaLabelForInfoIos =
    t("betaBanner.infoIos") + " " + t("externalLink.opensInNewTab");

  // define external link url for E-kirjasto info
  const hrefForInfoEkirjasto = t("betaBanner.hrefInfoEkirjasto");
  const hrefForInfoWeb = t("betaBanner.hrefInfoWeb");
  const hrefForInfoAndroid = t("betaBanner.hrefInfoAndroid");
  const hrefForInfoIos = t("betaBanner.hrefInfoIos");

  // function that is used when component mounts
  useEffect(() => {
    // set as mounted to allow rendering
    setIsMounted(true);

    // try to read sessionStorage safely to decide if banner should be shown
    try {
      if (typeof window !== "undefined" && window.sessionStorage) {
        // read the value from browser session storage,
        // user has closed the banner if key value is true
        const closed = window.sessionStorage.getItem(STORAGE_KEY) === "true";

        if (!closed) {
          // because user has not closed the banner we should show it
          setIsVisible(true);
        }
      } else {
        // if sessionStorage is unavailable, just hide the banner
        setIsVisible(false);
      }
    } catch (e) {
      // if there is an error, just hide the banner
      setIsVisible(false);
    }
  }, []);

  // function that handles user closing the banner
  const handleClose = useCallback(() => {
    // try to read sessionStorage safely
    try {
      if (typeof window !== "undefined" && window.sessionStorage) {
        // save the state to browser's session storage with key
        window.sessionStorage.setItem(STORAGE_KEY, "true");
      }
    } catch (e) {
      // do nothing
    }
    // banner is now hidden
    setIsVisible(false);
  }, []);

  // do not render the banner if not needed
  if (!isMounted) return null;
  if (!isVisible) return null;

  return (
    <Stack direction="column" sx={stackStyle}>
      {/* close button is positioned at the top right of banner */}
      <Button
        variant="ghost"
        color="ui.black"
        sx={buttonStyle}
        aria-label={t("betaBanner.ariaLabelForCloseButton")}
        onClick={handleClose}
      >
        <FontAwesomeIcon icon={faClose} />
      </Button>

      <H3>{welcomeText}</H3>

      <Text>{infoEbooksAndMagazinesText}</Text>

      <Text>{infoAudiobooksText}</Text>

      <Stack direction="row">
        <a
          href={hrefForInfoEkirjasto}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={ariaLabelForInfoEkirjasto}
        >
          <Text>{ekirjastoText}</Text>
          <ExternalLinkIcon sx={{ ml: 1, fill: "#0576d3" }} />
        </a>
        <a
          href={hrefForInfoWeb}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={ariaLabelForInfoWeb}
        >
          <Text>{webText}</Text>
          <ExternalLinkIcon sx={{ ml: 1, fill: "#0576d3" }} />
        </a>
      </Stack>

      <Stack direction="row">
        <a
          href={hrefForInfoAndroid}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={ariaLabelForInfoAndroid}
        >
          <Text>{androidText}</Text>
          <ExternalLinkIcon sx={{ ml: 1, fill: "#0576d3" }} />
        </a>
        <a
          href={hrefForInfoIos}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={ariaLabelForInfoIos}
        >
          <Text>{iosText}</Text>
          <ExternalLinkIcon sx={{ ml: 1, fill: "#0576d3" }} />
        </a>
      </Stack>
    </Stack>
  );
};

export default BetaBanner;
