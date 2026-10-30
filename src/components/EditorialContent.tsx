/* eslint-disable prettier/prettier */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "theme-ui";
import * as React from "react";
import useSWR from "swr";
import DOMPurify from "dompurify";
import { EditorialItem, LibraryData } from "interfaces";
import { localizedEditorialUrl } from "dataflow/editorialContent";
import LayoutPage from "components/LayoutPage";
import BreadcrumbBar from "components/BreadcrumbBar";
import PageTitle from "components/PageTitle";
import { H1 } from "components/Text";
import { useTranslation } from "next-i18next";

type EditorialFetchError = Error & { status?: number };

const fetcher = (url: string) => fetch(url).then(response => {
  if (!response.ok) {
    const error: EditorialFetchError = new Error("Could not load editorial content");
    error.status = response.status;
    throw error;
  }
  return response.json();
});

const SafeHtml: React.FC<{ html: string }> = ({ html }) => (
  <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />
);

export const EditorialList: React.FC<{
  library: LibraryData;
  type: "news" | "faq";
}> = ({ library, type }) => {
  const { t, i18n } = useTranslation();
  const link = type === "news"
    ? library.editorialContentLinks?.news
    : library.editorialContentLinks?.faq;
  const url = localizedEditorialUrl(link?.href, i18n.language);
  const { data, error } = useSWR<{ content: EditorialItem[] }>(url, fetcher);
  const items = data?.content || [];
  return <LayoutPage library={library}>
    <BreadcrumbBar currentLocation={t(`editorial.${type}`)} />
    <PageTitle>{t(`editorial.${type}`)}</PageTitle>
    {error && <p role="alert">{t("editorial.loadError")}</p>}
    {!error && !data && <p>{t("editorial.loading")}</p>}
    {!error && data && items.length === 0 && <p sx={{ px: [3, 5] }}>{t("editorial.empty")}</p>}
    <section sx={{ px: [3, 5], pb: 5 }}>
      {type === "faq" ? items.map(item => (
        <article key={item.id} sx={{ mb: 4 }}>
          <h2><a href={`/${library.slug}/faq/${encodeURIComponent(item.slug)}`}>{item.title}</a></h2>
          {item.intro_html && <SafeHtml html={item.intro_html} />}
        </article>
      )) : items.map(item => (
        <article key={item.id} sx={{ mb: 4 }}>
          <h2><a href={`/${library.slug}/news/${encodeURIComponent(item.slug)}`}>{item.title}</a></h2>
          {item.published_at && <time dateTime={item.published_at}>{new Date(item.published_at).toLocaleDateString(i18n.language)}</time>}
          {item.intro_html && <SafeHtml html={item.intro_html} />}
        </article>
      ))}
    </section>
  </LayoutPage>;
};

export const EditorialDetail: React.FC<{
  library: LibraryData;
  type: "news" | "faq";
  identifier: string;
}> = ({ library, type, identifier }) => {
  const { t, i18n } = useTranslation();
  const link = type === "news"
    ? library.editorialContentLinks?.news
    : library.editorialContentLinks?.faq;
  const url = localizedEditorialUrl(link?.href, i18n.language);
  const detailUrl = url ? (() => {
    const parsed = new URL(url);
    parsed.pathname = `${parsed.pathname.replace(/\/$/, "")}/${encodeURIComponent(identifier)}`;
    parsed.searchParams.delete("type");
    return parsed.toString();
  })() : null;
  const { data, error } = useSWR<EditorialItem>(detailUrl, fetcher);
  const isUnavailable = error?.status === 404 || data === null;
  const creationDate = data?.created_at || data?.published_at;
  const editedDate = data?.updated_at && creationDate &&
    new Date(data.updated_at).getTime() !== new Date(creationDate).getTime()
    ? data.updated_at
    : undefined;
  return <LayoutPage library={library}>
    <BreadcrumbBar
      breadcrumbs={[{ text: t(`editorial.${type}`), url: `/${library.slug}/${type}` }]}
      currentLocation={data?.title}
    />
    <div sx={{ width: "100%", maxWidth: 1100, mx: "auto" }}>
      <section sx={{ width: "100%", px: [3, 5], pb: 5, pt: 5 }}>
        {isUnavailable && <p>{t("editorial.notAvailable")}</p>}
        {error && !isUnavailable && <p role="alert">{t("editorial.loadError")}</p>}
        {!error && data === undefined && <p>{t("editorial.loading")}</p>}
        {data && <article sx={{ width: "100%" }}>
          <H1 sx={{ m: 0, mt: 4, mb: 4, textAlign: "left" }}>
            {data.title}
          </H1>
          {(creationDate || editedDate) && <div sx={{ display: "flex", gap: 2, mb: 4, fontSize: "-1" }}>
            {creationDate && <time dateTime={creationDate}>
              {new Date(creationDate).toLocaleString(i18n.language)}
            </time>}
            {editedDate && <span>
              {t("editorial.updatedAt")}: <time dateTime={editedDate}>
                {new Date(editedDate).toLocaleString(i18n.language)}
              </time>
            </span>}
          </div>}
          <SafeHtml html={data.body_html} />
        </article>}
      </section>
    </div>
  </LayoutPage>;
};

export const NewsWidget: React.FC<{
  library: LibraryData;
  news?: EditorialItem[];
}> = ({ library, news = [] }) => {
  const { t, i18n } = useTranslation();
  const url = localizedEditorialUrl(library.editorialContentLinks?.news?.href, i18n.language);
  const { data } = useSWR<{ content: EditorialItem[] }>(url, fetcher);
  const items = (news.length ? news : data?.content || []).slice(0, 3);

  if (!items.length) return null;

  return (
    <section sx={{ px: [3, 5], pb: 4 }} aria-labelledby="news-widget-title">
      <h2 id="news-widget-title">{t("editorial.currentNews")}</h2>
      {items.map(item => <article key={item.group_id}>
        <a href={`/${library.slug}/news/${encodeURIComponent(item.slug)}`}>
          <h3>{item.title}</h3>
        </a>
        {item.intro_html && <SafeHtml html={item.intro_html} />}
      </article>)}
    </section>
  );
};
