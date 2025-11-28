import * as React from "react";
import type { SVGProps } from "react";
import SvgEkirjastoLogoGreenENoBackground from "images/ekirjastoLogoGreenENoBackground";

function EkirjastoBookDetailsLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <div role="img" aria-label="Image of the E-library logo">
      <SvgEkirjastoLogoGreenENoBackground {...props} />
    </div>
  );
}

export default EkirjastoBookDetailsLogo;
