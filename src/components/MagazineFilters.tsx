/** @jsxRuntime classic */
/** @jsx jsx */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { jsx } from "theme-ui";
import * as React from "react";
import Select, { Label } from "./Select";
import {
  MagazineTitle,
  MagazineCategory,
  MagazineFilters
} from "../types/magazines";

interface MagazineFiltersProps {
  titles: MagazineTitle[];
  categories: MagazineCategory[];
  filters: MagazineFilters;
  onFiltersChange: (filters: MagazineFilters) => void;
  className?: string;
}

const MagazineFiltersComponent: React.FC<MagazineFiltersProps> = ({
  titles,
  categories,
  filters,
  onFiltersChange,
  className
}) => {
  const handleTitleChange = (e: React.FormEvent<HTMLSelectElement>) => {
    const selectedTitle = e.currentTarget.value || undefined;
    onFiltersChange({
      ...filters,
      selectedTitle
    });
  };

  const handleCategoryChange = (e: React.FormEvent<HTMLSelectElement>) => {
    const selectedCategory = e.currentTarget.value || undefined;
    onFiltersChange({
      ...filters,
      selectedCategory
    });
  };

  return (
    <div
      className={className}
      sx={{
        display: "flex",
        flexDirection: ["column", "row"],
        gap: 3,
        px: [2, 3, 4],
        py: 3,
        borderBottom: "1px solid",
        borderColor: "ui.gray.light",
        backgroundColor: "ui.gray.extraExtraLight"
      }}
    >
      <div sx={{ flex: 1, minWidth: "200px" }}>
        <Label htmlFor="magazine-title-filter" sx={{ display: "block", mb: 1 }}>
          Valitse lehti...
        </Label>
        <Select
          id="magazine-title-filter"
          value={filters.selectedTitle || ""}
          onChange={handleTitleChange}
          onBlur={handleTitleChange}
        >
          <option value="">Kaikki lehdet</option>
          {titles.map(title => (
            <option key={title.id} value={title.id}>
              {title.name}
            </option>
          ))}
        </Select>
      </div>

      <div sx={{ flex: 1, minWidth: "200px" }}>
        <Label
          htmlFor="magazine-category-filter"
          sx={{ display: "block", mb: 1 }}
        >
          Valitse aihelue...
        </Label>
        <Select
          id="magazine-category-filter"
          value={filters.selectedCategory || ""}
          onChange={handleCategoryChange}
          onBlur={handleCategoryChange}
        >
          <option value="">Kaikki aiheet</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
};

export default MagazineFiltersComponent;
