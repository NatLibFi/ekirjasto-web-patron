/** @jsxRuntime classic */
/** @jsx jsx */

import { jsx } from "theme-ui";
import React, { useState } from "react";
import { H3, Text } from "components/Text";
import Stack from "components/Stack";
import { useTranslation } from "next-i18next";
import ExternalLinkIcon from "icons/ExternalLink";

// define style for the Stack component
const stackStyle = {
  backgroundColor: "#F0F1C2",
  alignItems: "center",
  justifyContent: "center",
  padding: 3
};

// define props for the BookPassphraseCopyButton component
interface BetaBannerProps {
  // no props yet
}

const BetaBanner: React.FC<BetaBannerProps> = () => {
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

  // do not render the banner if not needed
  if (!isMounted) return null;
  if (!isVisible) return null;

  return (
    <Stack direction="column" sx={stackStyle}>
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
