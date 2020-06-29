/** @jsx jsx */
import { jsx } from "theme-ui";
import * as React from "react";
import { H1 } from "./Text";
import Stack from "./Stack";
import FormatFilter from "./FormatFilter";

const PageTitle: React.FC = ({ children }) => {
  return (
    <Stack
      direction="row"
      sx={{
        px: [3, 5],
        my: 4,
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap"
      }}
    >
      <H1 sx={{ m: 0 }}>{children}</H1>
      <FormatFilter />
    </Stack>
  );
};

export default PageTitle;
