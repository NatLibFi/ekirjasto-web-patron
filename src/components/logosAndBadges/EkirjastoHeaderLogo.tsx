/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "theme-ui";
import * as React from "react";
import SvgEKirjastoLogoGreenFISVEN from "icons/EkirjastoLogoGreenFISVEN";
import { useTranslation } from "next-i18next";
import Link from "components/Link";

// define props for the EkirjastoHeaderLogo component
interface EkirjastoHeaderLogoProps {
  //
}

const EkirjastoHeaderLogo: React.FC<EkirjastoHeaderLogoProps> = () => {
  const { t } = useTranslation();

  const LogoComponent = SvgEKirjastoLogoGreenFISVEN;

  return (
    <>
      <Link href="/" aria-label={t("header.ariaLabelForLibraryCatalogLink")}>
        <LogoComponent sx={{ height: 70 }} />
      </Link>
    </>
  );
};

export default EkirjastoHeaderLogo;
