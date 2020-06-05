/** @jsx jsx */
import { jsx } from "theme-ui";
import * as React from "react";

type NativeComponent<
  T extends keyof JSX.IntrinsicElements | React.JSXElementConstructor<any>,
  P = {}
> = React.FC<React.ComponentProps<T>> & P;

export const H1: NativeComponent<"h1"> = ({ children, ...rest }) => {
  return (
    <h1 sx={{ variant: "headers.primary" }} {...rest}>
      {children}
    </h1>
  );
};

export const H2: NativeComponent<"h2"> = ({ children, ...rest }) => {
  return (
    <h2 sx={{ variant: "headers.secondary" }} {...rest}>
      {children}
    </h2>
  );
};

export const H3: NativeComponent<"h3"> = ({ children, ...rest }) => {
  return (
    <h3 sx={{ variant: "headers.tertiary" }} {...rest}>
      {children}
    </h3>
  );
};

export const Text: React.FC<{ variant?: string }> = ({
  variant = "body.regular",
  children,
  ...rest
}) => (
  <span sx={{ variant }} {...rest}>
    {children}
  </span>
);
