import * as React from "react";
import type { SVGProps } from "react";
import SvgEkirjastoLogoGreenENoBackground from "images/ekirjastoLogoGreenENoBackground";
import { useTranslation } from "next-i18next";

function EkirjastoBookDetailsLogo(props: SVGProps<SVGSVGElement>) {
  const { t } = useTranslation();

  return (
    <div role="img" aria-label={t("bookDetails.ariaLabelForEkirjastoLogo")}>
      <SvgEkirjastoLogoGreenENoBackground {...props} />
    </div>
  );
}

export default EkirjastoBookDetailsLogo;
