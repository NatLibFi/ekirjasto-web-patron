/** @jsx jsx */
import { jsx } from "theme-ui";
import * as React from "react";
import { Theme } from "../theme";
import { NavButton } from "./Button";

type FilterButtonProps = { selected: boolean } & React.ComponentProps<
  typeof NavButton
>;
const FilterButton: React.FC<FilterButtonProps> = ({
  selected,
  children,
  className,
  ...props
}) => {
  const selectedStyles = {
    bg: (theme: Theme) => (selected ? theme.colors.primaries.dark : undefined),
    "&:hover,&:focus": selected
      ? {
          bg: (theme: Theme) => theme.colors.primaries.dark
        }
      : undefined
  };
  return (
    <NavButton
      role="tab"
      aria-selected={selected}
      className={className}
      sx={{
        height: 40,
        width: 40,
        p: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        mx: 1,
        alignSelf: "flex-end",
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 0,
        ...selectedStyles
      }}
      {...props}
    >
      {children}
    </NavButton>
  );
};

export default FilterButton;
