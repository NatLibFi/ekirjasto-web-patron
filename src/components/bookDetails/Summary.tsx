/** @jsxRuntime classic */
/** @jsx jsx */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { jsx } from "theme-ui";
import * as React from "react";
import { H2 } from "components/Text";
import { AnyBook } from "interfaces";
import { useTranslation } from "next-i18next";

const Summary: React.FC<{ book: AnyBook; className?: string }> = ({
  book,
  className
}) => {
  const { t } = useTranslation();

  return (
    <div
      sx={{ my: 2 }}
      className={className}
      aria-label={t("bookDetails.ariaLabelForSummary")}
    >
      <H2 sx={{ mb: 2, variant: "text.headers.tertiary" }}>
        {t("bookDetails.headerForsummary")}
      </H2>
      <div
        data-testid="summary-content"
        dangerouslySetInnerHTML={{
          __html: book.summary ?? t("bookDetails.summaryNotProvided")
        }}
      />
    </div>
  );
};

export default Summary;
