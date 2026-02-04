/** @jsxRuntime classic */
/** @jsx jsx */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { jsx } from "theme-ui";
import * as React from "react";
import TextInput from "./TextInput";
import Button from "./Button";
import Router from "next/router";
import SvgSearch from "icons/Search";
import useLinkUtils from "hooks/useLinkUtils";
import useSWR from "swr";
import useCollection from "hooks/useCollection";
import { fetchSearchData } from "dataflow/opds1/fetch";
import ApplicationError from "errors";
import { SearchData } from "interfaces";

interface SearchProps extends React.InputHTMLAttributes<HTMLInputElement> {}

/**
 * We currently have to save old search data around in case we navigate
 * to a book page, which as no search link. In this case, we use the old data
 */
let searchData: null | SearchData = null;

/**
 * Search component providing input and
 * search button with styles and defaults.
 * Fetches new description whenever
 * collection.searchDataUrl changes
 */

const Search: React.FC<SearchProps> = ({ className, ...props }) => {
  const [value, setValue] = React.useState("");
  const linkUtils = useLinkUtils();
  const { collection, error } = useCollection();

  const { data } = useSWR(collection?.searchDataUrl ?? null, fetchSearchData);

  // update the searchData if we have new data
  if (data) {
    searchData = data;
  }

  // show no searchbar if we cannot perform a search or there was an error
  if (!searchData || error) return null;

  // handle the search
  const onSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchData)
      throw new ApplicationError({
        detail: "Cannot perform search. No search template available."
      });
    const searchTerms = encodeURIComponent(value);
    const url = createSearchUrl(
      searchData.template,
      searchData.url,
      searchTerms
    );
    if (!url) return;
    const link = linkUtils.buildCollectionLink(url);
    Router.push(link, undefined, { shallow: true });
  };

  return (
    <form
      onSubmit={onSearch}
      className={className}
      role="search"
      sx={{ display: "flex", flexDirection: "row" }}
    >
      <TextInput
        id="search-bar"
        type="search"
        name="search"
        title={searchData?.shortName}
        placeholder="Enter an author, keyword, etc..."
        aria-label="Enter search keyword or keywords"
        value={value}
        onChange={e => setValue(e.target.value)}
        sx={{
          borderRight: "none",
          borderTopLeftRadius: 30,
          borderBottomLeftRadius: 30,
          letterSpacing: 0.4,
          padding: 15,
          fontSize: 16
        }}
        {...props}
      />
      <Button
        type="submit"
        color="ui.ekirjastogreen"
        aria-label="Search content"
        sx={{
          height: "initial",
          flex: "1 0 auto",
          letterSpacing: "0.4px",
          borderTopRightRadius: "30px",
          borderBottomRightRadius: "30px",
          padding: "15px, 30px, 15px, 30px",
          fontSize: "16px"
        }}
        iconLeft={SvgSearch}
      >
        Search
      </Button>
    </form>
  );
};

function createSearchUrl(
  templateString: string,
  searchUrl: string,
  query: string
) {
  return new URL(
    templateString.replace("{searchTerms}", query),
    searchUrl
  ).toString();
}

export default Search;
