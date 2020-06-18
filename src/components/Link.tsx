/** @jsx jsx */
import { jsx } from "theme-ui";
import * as React from "react";
import BaseLink from "next/link";
import useLinkUtils, { LinkUtils } from "./context/LinkUtilsContext";
import { NextLinkConfig } from "../interfaces";

type CollectionLinkProps = {
  collectionUrl: string;
};
type BookLinkProps = {
  bookUrl: string;
};

type BaseLinkProps = Omit<
  React.ComponentProps<typeof BaseLink>,
  "href" | "as"
> &
  Omit<React.ComponentPropsWithoutRef<"a">, "href"> & {
    className?: string;
  };

export type LinkProps = BaseLinkProps &
  (CollectionLinkProps | BookLinkProps | NextLinkConfig);

/**
 * converts bookUrl and collectionUrl to as/href props
 * prepends with multi library path if needed
 * removes consumed props and returns normalized props
 */
const buildLinkFromProps = (props: LinkProps, linkUtils: LinkUtils) => {
  if ("bookUrl" in props) {
    const { bookUrl, ...rest } = props;
    return { ...linkUtils.buildBookLink(bookUrl), ...rest };
  }
  if ("collectionUrl" in props) {
    const { collectionUrl, ...rest } = props;
    return { ...linkUtils.buildCollectionLink(collectionUrl), ...rest };
  }
  const { as, href, ...rest } = props;
  return {
    ...linkUtils.buildMultiLibraryLink({
      as: props.as,
      href: props.href
    }),
    ...rest
  };
};
/**
 * Extends next/Link to:
 *  - add styles
 *  - automatically prepend the library ID if using multiple libraries.
 *  - allows user to pass in ONE OF:
 *    - "href" and "as", a normal next/Link
 *    - "bookUrl"
 *    - "collectionUrl"
 */
const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ children, className, ...props }, ref) => {
    const linkUtils = useLinkUtils();
    const {
      as,
      href,
      prefetch,
      replace,
      scroll,
      shallow,
      ...rest
    } = buildLinkFromProps(props, linkUtils);
    return (
      <BaseLink
        href={href}
        as={as}
        prefetch={prefetch}
        replace={replace}
        scroll={scroll}
        shallow={shallow}
        passHref
      >
        <a
          ref={ref}
          sx={{ textDecoration: "none", color: "inherit" }}
          className={className}
          {...rest}
        >
          {children}
        </a>
      </BaseLink>
    );
  }
);

export default Link;
