/** @jsxRuntime classic */
/** @jsx jsx */

import { jsx } from "theme-ui";
import * as React from "react";
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

  // define info texts for beta banner
  const welcomeText = t("betaBanner.infoWelcome");
  const materialsText =
    t("betaBanner.infoEbooksAndMagazines") +
    " " +
    t("betaBanner.infoAudiobooks");
  const ekirjastoText = t("betaBanner.infoEkirjasto");
  const ariaLabelForInfoEkirjasto =
    t("betaBanner.infoEkirjasto") + " " + t("externalLink.opensInNewTab");

  // define external link url for E-kirjasto info
  const hrefForInfoEkirjasto = t("betaBanner.hrefInfoEkirjasto");

  return (
    <Stack direction="column" sx={stackStyle}>
      <H3>{welcomeText}</H3>
      <Text>{materialsText}</Text>
      <a
        href={hrefForInfoEkirjasto}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabelForInfoEkirjasto}
      >
        <Text>{ekirjastoText}</Text>
        <ExternalLinkIcon sx={{ ml: 1, fill: "#0576d3" }} />
      </a>
    </Stack>
  );
};

export default BetaBanner;
