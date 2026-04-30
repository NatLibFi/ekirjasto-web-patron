/* eslint-disable jsx-a11y/anchor-is-valid */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "theme-ui";
import * as React from "react";
import { H1 } from "./Text";
import { OPDS1 } from "interfaces";
import { PageLoader } from "components/LoadingIndicator";
import { useTranslation } from "next-i18next";
import Link from "next/link";

interface ErrorComponentProps {
  info?: OPDS1.ProblemDocument;
}

const ErrorComponent: React.FC<ErrorComponentProps> = ({ info }) => {
  const { t } = useTranslation();

  // extract error information
  const errorStatus = info?.status;
  const errorDetail = info?.detail ? t(info.detail) : null;
  const errorTitle = info?.title
    ? t(info.title)
    : t("error.titleForSomethingWentWrong");

  const errorString = t("error.error");
  const returnHomeString = t("error.returnHome");

  if (errorStatus === 401) {
    // It isn't necessary to show an error page for 401 (Unauthorized) errors
    // since the user will be redirected to the login page.
    // Instead, we display a PageLoader to avoid the undesirable display
    // of an error screen while the user waits for that redirect to occur
    return <PageLoader />;
  }

  return (
    <>
      <div sx={{ p: [3, 4] }}>
        <H1>
          {/* render status code, localised error label and error title */}
          {/* "123 Virhe: Kirjaa ei löydy" */}
          {errorStatus} {errorString}: {errorTitle}
        </H1>
        <p>
          {/* render error detail (if it exists) */}
          {/* "Tämä kirja ei ole E-kirjaston kokoelmassa" */}
          {errorDetail}
          <br />
        </p>
        {/* render link to return to library home page */}
        {/* "Palaa etusivulle" */}
        <Link href="/">{returnHomeString}</Link>
      </div>
    </>
  );
};

export default ErrorComponent;
