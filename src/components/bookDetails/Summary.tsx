/** @jsxRuntime classic */
/** @jsx jsx */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { jsx } from "theme-ui";
import * as React from "react";
import { H2 } from "components/Text";
import { AnyBook } from "interfaces";

const Summary: React.FC<{ book: AnyBook; className?: string }> = ({
  book,
  className
}) => {
  return (
    <div sx={{ my: 2 }} className={className} aria-label="Book summary">
      <H2 sx={{ mb: 2, variant: "text.headers.tertiary" }}>Summary</H2>
      <div
        data-testid="summary-content"
        dangerouslySetInnerHTML={{
          __html: book.summary ?? "Summary not provided."
        }}
      />
    </div>
  );
};

export default Summary;
