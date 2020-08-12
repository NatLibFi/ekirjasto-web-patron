import { AXIS_NOW_DECRYPT } from "../utils/env";

import {
  SepiaTheme,
  SerifFont,
  SansFont,
  PublisherFont,
  LocalStorageStore,
  IFrameNavigator,
  DayTheme,
  NightTheme,
  BookSettings,
  LocalAnnotator,
  ServiceWorkerCacher,
  ColumnsPaginatedBookView,
  ScrollingBookView
} from "library-simplified-webpub-viewer";

export default async function (
  bookUrl: string,
  catalogName: string,
  decryptorParams?: any
) {
  console.log("decryptorParams", decryptorParams);
  const element = document.getElementById("viewer");
  const webpubBookUrl = new URL(bookUrl, window.location.href);
  const containerHref = webpubBookUrl.href.endsWith("container.xml")
    ? webpubBookUrl.href
    : "";
  const response = await fetch(containerHref);
  const text = await response.text();
  const xml = new window.DOMParser().parseFromString(text, "text/html");
  const rootfile = xml.getElementsByTagName("rootfile")[0]
    ? xml.getElementsByTagName("rootfile")[0].getAttribute("full-path")
    : "";
  const url = containerHref.replace("META-INF/container.xml", rootfile || "");
  const finalUrl = rootfile ? new URL(url) : webpubBookUrl;

  initBookSettings(element, finalUrl, catalogName, decryptorParams);
}

async function initBookSettings(
  element,
  webpubManifestUrl,
  catalogName,
  decryptorParams?
) {
  const store = new LocalStorageStore({
    prefix: webpubManifestUrl.href
  });
  const cacher = new ServiceWorkerCacher({
    store: store,
    manifestUrl: webpubManifestUrl,
    serviceWorkerUrl: new URL("sw.js", window.location.href),
    staticFileUrls: [
      new URL(window.location.href),
      new URL("index.html", window.location.href),
      new URL("main.css", window.location.href),
      new URL("require.js", window.location.href),
      new URL("fetch.js", window.location.href),
      new URL("webpub-viewer.js", window.location.href)
    ]
  });

  const fontSizes = [12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32];
  const annotator = new LocalAnnotator({ store: store });
  const settingsStore = new LocalStorageStore({
    prefix: "webpub-viewer"
  });
  const upLink = {
    url: new URL(document.referrer || window.location.origin),
    label: `Return to ${catalogName}`,
    ariaLabel: `Return to ${catalogName}`
  };
  const publisher = new PublisherFont();
  const serif = new SerifFont();
  const sans = new SansFont();
  const day = new DayTheme();
  const sepia = new SepiaTheme();
  const night = new NightTheme();
  const paginator = new ColumnsPaginatedBookView();
  const scroller = new ScrollingBookView();

  const Decryptor = AXIS_NOW_DECRYPT
    ? await import("../../axisnow-access-control-web/src/decryptor")
    : undefined;
  let decryptor;
  if (Decryptor) {
    decryptor = Decryptor
      ? await Decryptor.default.createDecryptor(decryptorParams)
      : undefined;
  }

  const entryUrl: string = decryptor
    ? decryptor.getEntryUrl()
    : webpubManifestUrl;

  const bookSettings = await BookSettings.create({
    store: settingsStore,
    bookFonts: [publisher, serif, sans],
    fontSizesInPixels: fontSizes,
    bookThemes: [day, sepia, night],
    bookViews: [paginator, scroller]
  });
  IFrameNavigator.create({
    decryptor,
    element: element,
    entryUrl: new URL(entryUrl),
    store: store,
    cacher: cacher,
    settings: bookSettings,
    annotator: annotator,
    publisher: publisher,
    serif: serif,
    sans: sans,
    day: day,
    sepia: sepia,
    night: night,
    paginator: paginator,
    scroller: scroller,
    upLink: upLink,
    allowFullscreen: true
  });
}
