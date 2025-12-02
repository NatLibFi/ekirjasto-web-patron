/** @jsxRuntime classic */
/** @jsx jsx */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { jsx } from "theme-ui";
import * as React from "react";
import { H3, Text } from "components/Text";
import { AnyBook } from "interfaces";
import DetailField from "components/BookMetaDetail";

const Accessibility: React.FC<{ book: AnyBook; className?: string }> = ({
  book,
  className
}) => {
  return (
    <div sx={{ my: 2 }} className={className}>
      <H3
        id="accessibility-heading"
        sx={{ mb: 2, variant: "text.headers.tertiary" }}
      >
        Accessibility
      </H3>

      <DetailField heading="Conformance" details="conformsTo" />

      <DetailField
        heading="Ways of reading"
        details="feature, feature, feature"
      />

      <Text>
        {!book.accessibility?.conformance && !book.accessibility?.waysOfReading
          ? "This book does not have any accessibility information available"
          : ""}
      </Text>
    </div>
  );
};

export default Accessibility;
