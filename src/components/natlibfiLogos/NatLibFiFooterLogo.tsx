/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "theme-ui";
import * as React from "react";
import { AppLocale, normaliseLocale } from "../../../appLocales";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import SvgNatLibFiBlackEN from "icons/NatLibFiBlackEN";
import SvgNatLibFiBlackFISV from "icons/NatLibFiBlackFISV";

// define map for all language versions of NatLibFi logos
const localisedLogos: Record<string, React.FC> = {
  fi: SvgNatLibFiBlackFISV,
  sv: SvgNatLibFiBlackFISV,
  en: SvgNatLibFiBlackEN
};

// define props for the NatLibFiFooterLogo component
interface NatLibFiFooterLogoProps {
  props: React.ComponentProps<"a">;
}

const NatLibFiFooterLogo: React.FC<NatLibFiFooterLogoProps> = props => {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const normalisedLocale: AppLocale = normaliseLocale(locale);

  // select the logo for this locale
  const LogoComponent = localisedLogos[normalisedLocale];

  return (
    <a
      rel="noopener noreferrer"
      target="_blank"
      href={t("footer.hrefNatLibFi")}
      aria-label={t("natlibfiLogos.ariaLabelForNatLibFiLink")}
      sx={{
        display: "flex",
        width: 160,
        margin: 10
      }}
      {...props}
    >
      {/* render the NatLibFi logo component */}
      <LogoComponent />
    </a>
  );
};

export default NatLibFiFooterLogo;
