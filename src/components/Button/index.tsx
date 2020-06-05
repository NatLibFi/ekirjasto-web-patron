/** @jsx jsx */
import { jsx } from "theme-ui";
import { Button as BaseButton } from "reakit";
import * as React from "react";
import Link from "../Link";
import { Box, PolymorphicComponentProps } from "../PolymorphicBox";
import { styleProps } from "./styles";

export type ButtonVariant = "filled" | "outline" | "link";
export type ButtonSize = "sm" | "md" | "lg";
type ButtonOwnProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  color?: string;
  disabled?: boolean;
  className?: string;
};
type ButtonProps<E extends React.ElementType> = PolymorphicComponentProps<
  E,
  ButtonOwnProps
>;

const defaultComponent = BaseButton;

/**
 * renders anything with button styles from the theme. Pass an
 * "as" prop to control the backing component
 */
function Button<E extends React.ElementType = typeof defaultComponent>({
  variant = "filled",
  color = "brand.primary",
  size = "md",
  ...props
}: ButtonProps<E>): JSX.Element {
  return (
    <Box
      component={defaultComponent}
      sx={styleProps(color, size, variant)}
      {...props}
    />
  );
}

/**
 * The nav button renders a Link, which already takes an "as" prop, so
 * we need to pass that through the PolymorphicBox via some other name
 */
type NavButtonProps = React.ComponentProps<typeof Link> & ButtonOwnProps;
export function NavButton(props: NavButtonProps) {
  return <Button component={Link} {...props} />;
}

function isNavButton(props: AmbiguousButtonProps): props is NavButtonProps {
  return "collectionUrl" in props || "bookUrl" in props || "href" in props;
}

type AmbiguousButtonProps =
  | NavButtonProps
  | ButtonProps<typeof defaultComponent>;
export function AmbiguousButton(props: AmbiguousButtonProps) {
  if (isNavButton(props)) return <NavButton {...props} />;
  return <Button {...props} />;
}

type AnchorButtonProps = Omit<React.ComponentProps<"a">, "ref"> &
  ButtonOwnProps;
export function AnchorButton(props: AnchorButtonProps) {
  return <Button component="a" {...props} />;
}
export default Button;
