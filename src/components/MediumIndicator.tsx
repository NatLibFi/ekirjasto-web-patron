/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "theme-ui";
import * as React from "react";
import { Text } from "./Text";
import { bookMediumMap, getMedium } from "utils/book";
import { AnyBook } from "interfaces";
import { useTranslation } from "next-i18next";

const MediumIndicator: React.FC<{ book: AnyBook; className?: string }> = ({
  book,
  className
}) => {
  const medium = getMedium(book);
  const { t } = useTranslation();

  if (Object.keys(bookMediumMap).indexOf(medium) === -1) return null;
  if (medium === "") return null;
  const mediumInfo = bookMediumMap[medium];
  const mediumLabel = t("mediumIndicator.labelFor" + mediumInfo.name);
  return (
    <Text sx={{ display: "flex", alignItems: "center" }} className={className}>
      <MediumIcon sx={{ mr: 1 }} book={book} />
      {mediumLabel}
    </Text>
  );
};

export default MediumIndicator;

export const MediumIcon: React.FC<{ book: AnyBook; className?: string }> = ({
  book,
  className,
  ...rest
}) => {
  const medium = getMedium(book);
  const { t } = useTranslation();

  if (Object.keys(bookMediumMap).indexOf(medium) === -1) return null;
  if (medium === "") return null;
  const mediumInfo = bookMediumMap[medium];
  const MediumSvg = mediumInfo.icon;
  const mediumAriaLabel = t(
    "mediumIndicator.ariaLabelForIcon" + mediumInfo.name
  );

  return MediumSvg ? (
    <MediumSvg aria-label={mediumAriaLabel} className={className} {...rest} />
  ) : null;
};
