/** @jsx jsx */
import { jsx } from "theme-ui";
import * as React from "react";
import useTypedSelector from "../hooks/useTypedSelector";
import FormField from "./form/FormField";
import FormLabel from "./form/FormLabel";
import Router from "next/router";
import useLinkUtils from "./context/LinkUtilsContext";
import Select from "./Select";

/**
 * This filter depends on the "Formats" facetGroup, which should have
 * at least two facets with labels:
 *  - Audiobooks
 *  - eBooks
 * It can optionally have an additional "All" facet. Note that the facet
 * labels must match the spelling and capitalization exactly.
 */
const FormatFilter: React.FC = () => {
  const { buildCollectionLink } = useLinkUtils();
  const isCollectionLoaded = useTypedSelector(
    state => !!state.collection.data && !state.collection.isFetching
  );
  const formatFacetGroup = useTypedSelector(state =>
    state.collection.data?.facetGroups?.find(
      facetGroup => facetGroup.label === "Formats"
    )
  );

  const ebookFacet = formatFacetGroup?.facets.find(
    facet => facet.label === "eBooks"
  );
  const audiobookFacet = formatFacetGroup?.facets.find(
    facet => facet.label === "Audiobooks"
  );
  const allFacet = formatFacetGroup?.facets.find(
    facet => facet.label === "All"
  );

  if (!isCollectionLoaded) return null;
  if (!ebookFacet || !audiobookFacet) {
    console.warn(
      "In order to display the format selector, you must configure an eBook and audiobook facet. You can also have an optional All facet."
    );
    return null;
  }
  const handleChange: React.ChangeEventHandler<HTMLSelectElement> = e => {
    // value will always be defined, but it could be an empty string.
    const collectionLink = buildCollectionLink(e.target.value);
    // check if value is defined?
    // if all facet isn't defined, go to the base url.
    Router.push(collectionLink.href, collectionLink.as);
  };

  const value = [allFacet, ebookFacet, audiobookFacet].find(
    facet => facet?.active
  )?.href;

  return (
    <FormField
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        width: "initial"
      }}
    >
      <FormLabel htmlFor="formatSelect">Format</FormLabel>
      <Select id="formatSelect" onChange={handleChange} value={value}>
        {allFacet && <option value={allFacet?.href}>All</option>}
        <option value={ebookFacet.href}>eBooks</option>
        <option value={audiobookFacet.href}>Audiobooks</option>
      </Select>
    </FormField>
  );
};
export default FormatFilter;
