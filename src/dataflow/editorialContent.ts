import { EditorialItem } from "interfaces";

export function localizedEditorialUrl(
  url: string | undefined,
  locale: string | undefined
): string | null {
  if (!url) return null;

  const result = new URL(url);
  if (locale) result.searchParams.set("language", locale);
  return result.toString();
}

export async function fetchEditorialContent(
  url: string,
  locale?: string
): Promise<EditorialItem[]> {
  const localizedUrl = localizedEditorialUrl(url, locale);
  if (!localizedUrl) return [];

  const response = await fetch(localizedUrl);
  if (!response.ok) throw new Error("Could not load editorial content");

  const data = await response.json();
  return data.content ?? [];
}
