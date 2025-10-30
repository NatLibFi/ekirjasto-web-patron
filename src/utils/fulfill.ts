import FulfillmentButton from "components/FulfillmentButton";
import { fetchBearerToken, fetchBook } from "dataflow/opds1/fetch";
import ApplicationError from "errors";
import {
  FulfillableBook,
  FulfillmentLink,
  MediaSupportLevel,
  OPDS1
} from "interfaces";
import { headers } from "next/headers";
import { DownloadMediaType, LcpDrmMediaType, ExternalReaderMediaType} from "types/opds1";
import { bookIsAudiobook } from "utils/book";
import { APP_CONFIG } from "utils/env";
import { typeMap } from "utils/file";

/**
 * Fulfilling a book requires a couple pieces of information:
 *  - The configured support type for that combination of indirectionType and contentType
 *  - What UX should be presented to the user
 *  - How to actually go about fulfilling that UX
 *
 * Both of these are determined by a combination of the final content type
 * and any layers of indirection the media is wrapped in. This file is an
 * attempt to centralize the logic of dealing with different media types
 * and layers of indirection.
 *
 * This file is based on:
 * https://docs.google.com/document/d/1dli5mgTbVaURN_B2AtUmPhgpaFUVqOqrzsaoFvCXnkA/edit?pli=1#
 */

export type AuthorizedLocation = {
  url: string;
  token?: string;
  lcpContentType?: DownloadMediaType;
};

export type DownloadFulfillment = {
  type: "download";
  id: string;
  contentType: DownloadMediaType;
  getLocation: GetLocationWithIndirection;
  buttonLabel: string;
};
export type ReadInternalFulfillment = {
  type: "read-online-internal";
  id: string;
  url: string;
  buttonLabel: string;
};
export type ReadExternalFulfillment = {
  type: "read-online-external";
  id: string;
  getLocation: GetLocationWithIndirection;
  buttonLabel: string;
};
export type UnsupportedFulfillment = {
  type: "unsupported";
};

export type SupportedFulfillment =
  | DownloadFulfillment
  | ReadExternalFulfillment
  | ReadInternalFulfillment;

export type AnyFullfillment = SupportedFulfillment | UnsupportedFulfillment;

export function getFulfillmentFromLink(link: FulfillmentLink): AnyFullfillment {
  const { contentType, indirectionType, supportLevel } = link;

  // don't show fulfillment option if it is unsupported or only allows
  // a redirect to the companion app.
  if (supportLevel === "unsupported" || supportLevel === "redirect") {
    return { type: "unsupported" };
  }

  // TODO: I'm not sure that we need these special "unsupported" cases here,
  //  since we can set this in the configuration. For example, there might
  //  be cases in the future in which there is no support in this app, but
  //  support is present in the mobile apps. It might be better to restrict
  //  the possible types, depending on whether we directly support it in-app.
  // there is no support for books with "Libby" DRM
  // There is no support for books with AxisNow DRM.
  if (
    [OPDS1.OverdriveEbookMediaType, OPDS1.AxisNowWebpubMediaType].includes(
      contentType
    )
  ) {
    return { type: "unsupported" };
  }

  switch (contentType) {
    case OPDS1.PdfMediaType:
    case OPDS1.Mobi8Mediatype:
    case OPDS1.MobiPocketMediaType:
    case OPDS1.EpubMediaType:
      const typeName = typeMap[contentType].name;
      const drm = (indirectionType === OPDS1.LcpDrmMediaType ? "LCP " : "");

      return {
        id: link.url,
        getLocation: constructGetLocation(
          indirectionType,
          contentType,
          link.url,
        ),
        type: "download",
        buttonLabel: `Download ${drm}${typeName}`,
        contentType
      };

    case OPDS1.ExternalReaderMediaType:
      return {
        id: link.url,
        type: "read-online-external",
        getLocation: constructGetLocation(
          indirectionType,
          contentType,
          link.url,
        ),
        buttonLabel: "Read Online"
      };
  }
  // TODO: track to bugsnag that we have found an unhandled media type
  return {
    type: "unsupported"
  };
}

export function getFulfillmentsFromBook(
  book: FulfillableBook
): SupportedFulfillment[] {
  // we don't support any audiobooks whatsoever right now
  if (bookIsAudiobook(book)) return [];
  const links = book.fulfillmentLinks;
  const dedupedLinks = dedupeLinks(links);
  const supported = dedupedLinks
    .map(getFulfillmentFromLink)
    .filter(isSupported);
  return supported;
}

function isSupported(
  fulfillment: AnyFullfillment
): fulfillment is SupportedFulfillment {
  return fulfillment.type !== "unsupported";
}

/**
 * Constructs a function to be used later to fetch the actual url and token to use to retrieve the
 * book, when a user clicks on the fulfillment button
 */
type GetLocationWithIndirection = (
  catalogUrl: string,
  token?: string
) => Promise<AuthorizedLocation>;

const constructGetLocation = (
  indirectionType: OPDS1.IndirectAcquisitionType | undefined,
  contentType: OPDS1.AnyBookMediaType,
  url: string,
): GetLocationWithIndirection => async (catalogUrl: string, token?: string) => {

  switch (indirectionType) {
    case OPDS1.OPDSEntryMediaType:
      return await resolveOpdsEntry(url, catalogUrl, token, contentType);

    case OPDS1.BearerTokenMediaType:
      return await resolveBearerToken(url, token);

    case OPDS1.LcpDrmMediaType:
      //read online
      if (contentType == ExternalReaderMediaType) {
        return await resolveLcpDrm(url, token);
      }
      //download
      else {
        return {url, token, lcpContentType: LcpDrmMediaType };
      }

    default:
      // No indirection — return as-is
      return { url, token };
  }
};

async function resolveOpdsEntry(
  url: string,
  catalogUrl: string,
  token: string | undefined,
  contentType: OPDS1.AnyBookMediaType
): Promise<AuthorizedLocation> {
  const book = (await fetchBook(url, catalogUrl, token)) as FulfillableBook;
  if (!book) {
    throw new ApplicationError({
      title: "Fetch Error",
      detail: "Fetching book failed"
    })
  }
  const fulfillmentLink = book.fulfillmentLinks?.find(
    link => link.contentType === contentType
  )?.url;

  if (!fulfillmentLink) {
    throw new ApplicationError({
      title: "OPDS Error",
      detail:
        "Indirect OPDS Entry did not contain the correct acquisition link."
    });
  }
  return {url: fulfillmentLink, token  };
}

async function resolveBearerToken(
  url: string,
  token: string | undefined
): Promise<AuthorizedLocation> {
  const bearerToken = await fetchBearerToken(url, token);
  if (!bearerToken) {
    throw new ApplicationError({
      title: "Bearer Token Error",
      detail: "Could not retrieve bearer token."
    });
  }
  const fulfillmentLink =  bearerToken.location;
  const fulfillmentToken = `${bearerToken.token_type} ${bearerToken.access_token}`;

  return {url: fulfillmentLink, token: fulfillmentToken  };
} 
//url is fullfillmentlink.url
//
async function resolveLcpDrm(
  url: string,
  token: string | undefined,
): Promise<AuthorizedLocation> {
  if (!token) {
    throw new ApplicationError({
      title: "token not found",
      detail: "Could not retrieve token."
    });
  }

  const headers = { 'Authorization': token };
  try {
    const response = await fetch(url, { method: "GET", headers });
    if (!response.ok) throw new Error(response.statusText);

    const body = await response.json();
    const link = body.links.find(link => link.rel === "ellibs");
    return { url: link.href, token};
  }
  catch (err: any) {
    console.error("ERROR:", err.message);
    throw err;
  }
}

export function dedupeLinks(links: readonly FulfillmentLink[]) {
  return links.reduce<FulfillmentLink[]>((uniqueArr, current) => {
    const isDup = uniqueArr.find(
      uniqueLink => uniqueLink.contentType === current.contentType
    );

    return isDup ? uniqueArr : [...uniqueArr, current];
  }, []);
}

export function getAppSupportLevel(
  contentType: OPDS1.AnyBookMediaType,
  indirectionType: OPDS1.IndirectAcquisitionType | undefined
): MediaSupportLevel {
  const { mediaSupport } = APP_CONFIG;
  const defaultSupportLevel: MediaSupportLevel =
    mediaSupport?.default ?? "unsupported";
  // if there is indirection, we search through the dictionary nested inside the
  // indirectionType
  if (indirectionType) {
    const supportLevel = mediaSupport[indirectionType]?.[contentType];
    return supportLevel ?? defaultSupportLevel;
  }

  return mediaSupport[contentType] ?? defaultSupportLevel;
}

/**
 * Check if any of the links is redirect or redirect-and-show support level
 */
export function shouldRedirectToCompanionApp(
  links: readonly FulfillmentLink[]
) {
  return links.reduce((prev, link) => {
    if (prev) return true;
    const supportLevel = link.supportLevel;
    if (supportLevel === "redirect" || supportLevel === "redirect-and-show") {
      return true;
    }
    return false;
  }, false);
}

