/* eslint-disable camelcase */
import { NextWebVitalsMetric } from "next/app";

type PageData = {
  path: string;
  codePath: string;
  appEnvironment: Record<string, unknown>;
  library?: string;
  collectionUrl?: string;
  bookUrl?: string;
};
// doesn't track an event, just updates the data layer for the page
function pageview(page: PageData) {
  window?.dataLayer?.push({
    event: "pageview",
    page: {
      ...page,
      // clear out the collection/book url and library on each page view if it isn't present
      // in the new page view
      library: page.library ?? undefined,
      collectionUrl: page.collectionUrl ?? undefined,
      bookUrl: page.bookUrl ?? undefined
    }
  });
}

// allows us to track performance using web vitals reports
// https://nextjs.org/docs/advanced-features/measuring-performance
function webVitals({ id, name, value, label }: NextWebVitalsMetric) {
  window.dataLayer?.push("performance_metric_recorded", {
    metric_name: name,
    metric_category:
      label === "web-vital" ? "Web Vitals" : "Next.js custom metric",
    metric_value: Math.round(name === "CLS" ? value * 1000 : value), // values must be integers
    metric_id: id // id unique to current page load
  });
}

export default {
  webVitals,
  pageview
};
