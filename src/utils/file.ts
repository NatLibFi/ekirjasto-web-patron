import { OPDS1 } from "interfaces";

export const typeMap: Record<
  OPDS1.DownloadMediaType,
  { extension: string; name: string }
> = {
  "application/epub+zip": {
    extension: ".epub",
    name: "EPUB"
  },
  "application/kepub+zip": {
    // got this from here: https://wiki.mobileread.com/wiki/Kepub
    extension: ".kepub.epub",
    name: "KEPUB"
  },
  "application/pdf": {
    extension: ".pdf",
    name: "PDF"
  },
  "application/x-mobipocket-ebook": {
    extension: ".mobi",
    name: "MOBI"
  },
  "application/x-mobi8-ebook": {
    extension: ".azw3",
    name: "Mobi8"
  },
  "application/vnd.readium.lcp.license.v1.0+json": {
    extension: ".lcpl",
    name: "LCPL"
  }
};

export const generateFilename = (str: string, extension: string) => {
  return (
    str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") + extension
  );
};
