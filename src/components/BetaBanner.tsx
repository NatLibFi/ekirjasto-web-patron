/** @jsxRuntime classic */
/** @jsx jsx */

import { jsx } from "theme-ui";
import * as React from "react";
import { H3, Text } from "components/Text";
import Stack from "components/Stack";
import { useTranslation } from "next-i18next";
import ExternalLinkIcon from "icons/ExternalLink";
import { Icon, IconNames } from "@nypl/design-system-react-components";
import Button from "components/Button";
import { useEffect, useState } from "react";

// define style for the Stack component
const stackStyle = {
  backgroundColor: "#F0F1C2",
  alignItems: "center",
  justifyContent: "center",
  padding: 3
};

interface BetaBannerProps {
  // no props yet
}

const BetaBanner: React.FC<BetaBannerProps> = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(true);

  // Check local storage when the component mounts
  useEffect(() => {
    const closedBanner = localStorage.getItem("bannerClosed");
    if (closedBanner) {
      setIsVisible(false); // Set it to false if the banner was closed previously
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false); // Hide the banner
    localStorage.setItem("bannerClosed", "true"); // Store the info that the banner is closed
  };

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

  return (
    <>
      {isVisible && (
        <Stack direction="column" sx={stackStyle}>
          <H3>{welcomeText}</H3>
          <Button
            variant="ghost"
            color="ui.gray.dark"
            onClick={handleClose}
            sx={{ position: "absolute", top: 2, right: 2 }}
            aria-label={t("betaBanner.ariaLabelForCloseButton")}
          >
            <Icon
              decorative={false}
              name={IconNames.close}
              sx={{ fontSize: 18 }}
            />
          </Button>
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
      )}
    </>
  );
};

export default BetaBanner;
