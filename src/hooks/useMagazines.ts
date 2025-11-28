import * as React from "react";
import useSWR from "swr";
import useUser from "components/context/UserContext";
import { MagazinesResponse, MagazineFilters } from "../types/magazines";
import { getMagazineApiUrl } from "../config/magazines";

function getLocalizedText(text: any, preferredLang = "fi"): string {
  if (typeof text === "string") {
    return text;
  }
  if (typeof text === "object" && text !== null) {
    return text[preferredLang] || text.fi || text.en || text.sv || String(text);
  }
  return String(text || "");
}

function transformApiResponse(apiData: any): MagazinesResponse {
  const titles = (apiData.titles || []).map((title: any) => ({
    id: title.uuid,
    name: getLocalizedText(title.name),
    path: title.path,
    publisher: getLocalizedText(title.publisher),
    language: title.language,
    categoryIds: title.categoryIds
  }));

  const categories = (apiData.categories || []).map((category: any) => ({
    id: category.id,
    name: getLocalizedText(category.name),
    path: category.path
  }));

  const issues: any[] = [];
  (apiData.titles || []).forEach((title: any) => {
    (title.issues || []).forEach((issue: any) => {
      const transformedTitle = titles.find((t: any) => t.id === title.uuid);

      issues.push({
        id: issue.uuid,
        name: issue.issueCode || getLocalizedText(issue.name),
        path: `${title.path}/${issue.uuid}`,
        publicationDate: issue.publishedAt,
        coverUrl:
          issue.coverUrl?.md || issue.coverUrl?.xl || issue.coverUrl?.sm,
        title: transformedTitle
      });
    });
  });

  return {
    titles,
    categories,
    issues
  };
}

async function fetchMagazines(
  url: string,
  token?: string
): Promise<MagazinesResponse> {
  const headers: HeadersInit = {
    Accept: "application/json",
    "Content-Type": "application/json"
  };

  if (token) {
    headers["Authorization"] = token;
  }

  const response = await fetch(url, {
    method: "GET",
    headers,
    mode: "cors"
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch magazines: ${response.status} ${response.statusText}`
    );
  }

  const apiData = await response.json();
  return transformApiResponse(apiData);
}

export default function useMagazines() {
  const { token } = useUser();
  const [filters, setFilters] = React.useState<MagazineFilters>({});

  const magazineApiUrl = getMagazineApiUrl();

  const { data, error, isValidating } = useSWR<MagazinesResponse, Error>(
    `magazines-${magazineApiUrl}-${token || "no-token"}`,
    () => fetchMagazines(magazineApiUrl, token),
    {
      // Refresh every 5 minutes
      refreshInterval: 5 * 60 * 1000,
      revalidateOnFocus: true,
      errorRetryCount: 3,
      errorRetryInterval: 5000,
      shouldRetryOnError: true
    }
  );

  const filteredIssues = React.useMemo(() => {
    if (!data?.issues) return [];

    let filtered = data.issues;

    if (filters.selectedTitle) {
      filtered = filtered.filter(
        issue => issue.title?.id === filters.selectedTitle
      );
    }

    if (filters.selectedCategory) {
      const titlesInCategory =
        data.titles
          ?.filter(title =>
            title.categoryIds?.includes(filters.selectedCategory!)
          )
          .map(title => title.id) || [];

      filtered = filtered.filter(
        issue => issue.title?.id && titlesInCategory.includes(issue.title.id)
      );
    }

    return filtered;
  }, [data?.issues, data?.titles, filters]);

  return {
    titles: data?.titles || [],
    categories: data?.categories || [],
    issues: filteredIssues,
    filters,
    setFilters,
    isLoading: isValidating,
    error
  };
}
