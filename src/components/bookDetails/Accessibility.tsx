/** @jsxRuntime classic */
/** @jsx jsx */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { AnyBook } from "interfaces";
import { H3, Text } from "components/Text";
import { jsx } from "theme-ui";
import { useTranslation } from "next-i18next";
import * as React from "react";
import DetailField from "components/BookMetaDetail";

const Accessibility: React.FC<{ book: AnyBook; className?: string }> = ({
  book,
  className
}) => {
  const { t } = useTranslation();

  return (
    <div sx={{ my: 2 }} className={className}>
      <H3
        id="accessibility-heading"
        sx={{ mb: 2, variant: "text.headers.tertiary" }}
      >
        {t("bookDetails.headerForAccessibility")}
      </H3>

      <DetailField
        heading={t("bookDetails.conformance")}
        details={book.accessibility?.conformance?.conformsTo}
      />

      <DetailField
        heading={t("bookDetails.waysOfReading")}
        details={book.accessibility?.waysOfReading?.features?.join(", ")}
      />

      <Text>
        {!book.accessibility?.conformance && !book.accessibility?.waysOfReading
          ? t("bookDetails.noAccessibilityAvailable")
          : ""}
      </Text>
    </div>
  );
};

export default Accessibility;
