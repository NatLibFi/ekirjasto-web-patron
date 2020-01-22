/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable camelcase */
import { expect } from "chai";
import { stub } from "sinon";
const fetchMock = require("fetch-mock");

import LibraryDataCache, {
  RegistryEntry,
  AuthDocument,
  CacheEntry
} from "../LibraryDataCache";
import { OPDSFeed } from "opds-feed-parser";

describe("LibraryDataCache", () => {
  const config = {
    a: "http://a",
    b: "http://b"
  };

  let getCatalog;
  let getAuthDocument;
  class LibraryDataCacheWithCatalogAndAuthDocument extends LibraryDataCache {
    getCatalog(url: string): Promise<OPDSFeed> {
      return getCatalog();
    }
    getAuthDocument(catalog: OPDSFeed): Promise<AuthDocument> {
      return getAuthDocument();
    }
  }

  beforeEach(() => {
    const feed = new OPDSFeed({
      id: "1",
      title: "Library",
      updated: "20180102",
      entries: [],
      links: [
        {
          rel: "related",
          href: "http://library.org/1.html",
          type: "text/html",
          title: "One",
          role: "navigation"
        },
        {
          rel: "related",
          href: "http://library.org/2.html",
          type: "text/html",
          title: "Two",
          role: "navigation"
        },
        {
          rel: "about",
          href: "about.html",
          type: "text/html",
          title: "About",
          role: ""
        }
      ],
      complete: true,
      search: { totalResults: 0, startIndex: 0, itemsPerPage: 0 },
      unparsed: {}
    });
    getCatalog = stub().returns(
      new Promise<OPDSFeed>(resolve => resolve(feed))
    );
    getAuthDocument = stub().returns(
      new Promise<AuthDocument>(resolve =>
        resolve({ links: [], title: "title" })
      )
    );
  });

  afterEach(() => {
    fetchMock.restore();
  });

  describe("getLibraryUrlTemplate", () => {
    it("fetches registry base url to get url template", async () => {
      const cache = new LibraryDataCache("base-url");
      const template = "/library/{uuid}";
      const registryCatalog = {
        links: [
          {
            rel: "http://librarysimplified.org/rel/registry/library",
            href: template
          }
        ]
      };

      fetchMock.mock("/base-url", { status: 200, body: registryCatalog });
      const fetchArgs = fetchMock.calls();

      const uncachedResult = await cache.getLibraryUrlTemplate();
      expect(uncachedResult).to.equal(template);
      expect(fetchMock.called()).to.equal(true);
      expect(fetchArgs.length).to.equal(1);
      expect(fetchArgs[0][0]).to.equal("/base-url");

      // Now the template is cached so fetch won't be called again.
      const cachedResult = await cache.getLibraryUrlTemplate();
      expect(cachedResult).to.equal(template);
      expect(fetchArgs.length).to.equal(1);
    });

    it("throws an error if the registry returns an error", async () => {
      const cache = new LibraryDataCache("base-url");
      fetchMock.mock("/base-url", 400);

      try {
        // This should raise an error since the registry response was an error.
        const result = await cache.getLibraryUrlTemplate();
        // Fail the test if it's successful.
        expect(true, "no error was raised").to.equal(false);
      } catch (error) {
        expect(error).to.contain("Library registry is not available");
        expect(fetchMock.called()).to.equal(true);
      }
    });
  });

  describe("getDataFromAuthDocumentAndCatalog", () => {
    const authDocument = {
      title: "title",
      links: [
        {
          href: "http://library.org/logo",
          rel: "logo"
        },
        {
          href: "http://library.org/style.css",
          rel: "stylesheet"
        },
        {
          href: "http://library.org/style2.css",
          rel: "stylesheet"
        }
      ],
      web_color_scheme: {
        background: "#000000",
        foreground: "#ffffff"
      }
    };

    const feed = new OPDSFeed({
      id: "1",
      title: "Library",
      updated: "20180102",
      entries: [],
      links: [
        {
          rel: "related",
          href: "http://library.org/1.html",
          type: "text/html",
          title: "One",
          role: "navigation"
        },
        {
          rel: "related",
          href: "http://library.org/2.html",
          type: "text/html",
          title: "Two",
          role: "navigation"
        },
        {
          rel: "about",
          href: "about.html",
          type: "text/html",
          title: "About",
          role: ""
        }
      ],
      complete: true,
      search: { totalResults: 0, startIndex: 0, itemsPerPage: 0 },
      unparsed: {}
    });

    it("returns data", () => {
      const cache = new LibraryDataCache("base-url");
      const data = cache.getDataFromAuthDocumentAndCatalog(authDocument, feed);
      expect(data.catalogName).to.equal("title");
      expect(data.logoUrl).to.equal("http://library.org/logo");
      expect(data.cssLinks).to.deep.equal([
        authDocument.links[1],
        authDocument.links[2]
      ]);
      expect(data.colors).to.deep.equal(authDocument.web_color_scheme);
      expect(data.headerLinks).to.deep.equal([feed.links[0], feed.links[1]]);
    });
  });

  describe("getLibraryData", () => {
    const cacheEntry = {
      registryEntry: {
        links: [
          {
            href: "http://library.org/catalog",
            rel: "http://opds-spec.org/catalog"
          }
        ],
        metadata: {
          updated: "20180901",
          id: "uuid",
          title: "the library in the registry"
        }
      },
      authDocument: {
        title: "the library in the auth document",
        links: [
          {
            href: "http://library.org/logo",
            rel: "logo"
          }
        ],
        web_color_scheme: {
          background: "#000000",
          foreground: "#ffffff"
        }
      },
      catalog: new OPDSFeed({
        id: "1",
        title: "Library",
        updated: "20180102",
        entries: [],
        links: [
          {
            rel: "related",
            href: "http://library.org/1.html",
            type: "text/html",
            title: "one",
            role: "navigation"
          },
          {
            rel: "related",
            href: "http://library.org/2.html",
            type: "text/html",
            title: "two",
            role: "navigation"
          },
          {
            rel: "about",
            href: "about.html",
            type: "text/html",
            title: "About",
            role: ""
          }
        ],
        complete: true,
        search: { totalResults: 0, startIndex: 0, itemsPerPage: 0 },
        unparsed: {}
      }),
      timestamp: new Date().getTime()
    };
    let getCacheEntry;
    // Create a mock class that already has a cache entry.
    class LibraryDataCacheWithEntry extends LibraryDataCache {
      async getCacheEntry(library: string): Promise<CacheEntry> {
        return getCacheEntry();
      }
    }

    beforeEach(() => {
      getCacheEntry = stub().returns(
        new Promise(resolve => resolve(cacheEntry))
      );
    });

    it("converts cache entry from registry to library data", async () => {
      const cache = new LibraryDataCacheWithEntry("base-url");
      const libraryData = await cache.getLibraryData("uuid");

      expect(libraryData.id).to.equal("uuid");
      expect(libraryData.catalogUrl).to.equal("http://library.org/catalog");
      expect(libraryData.catalogName).to.equal(
        "the library in the auth document"
      );
      expect(libraryData.logoUrl).to.equal("http://library.org/logo");
      expect(libraryData.onlyLibrary).to.be.undefined;
      expect(libraryData.colors?.background).to.equal("#000000");
      expect(libraryData.colors?.foreground).to.equal("#ffffff");
      expect(libraryData.headerLinks).to.deep.equal([
        {
          href: "http://library.org/1.html",
          title: "one",
          rel: "related",
          type: "text/html",
          role: "navigation"
        },
        {
          href: "http://library.org/2.html",
          title: "two",
          rel: "related",
          type: "text/html",
          role: "navigation"
        }
      ]);
    });

    it("converts cache entry from config to library data", async () => {
      (cacheEntry as any).registryEntry = null;
      const config = { library: "http://libraryfromconfig.org" };
      const cache = new LibraryDataCacheWithEntry(undefined, 100, config);
      const libraryData = await cache.getLibraryData("library");
      expect(libraryData.id).to.equal("library");
      expect(libraryData.catalogUrl).to.equal("http://libraryfromconfig.org");
      expect(libraryData.catalogName).to.equal(
        "the library in the auth document"
      );
      expect(libraryData.logoUrl).to.equal("http://library.org/logo");
      expect(libraryData.onlyLibrary).to.be.undefined;
      expect(libraryData.colors?.background).to.equal("#000000");
      expect(libraryData.colors?.foreground).to.equal("#ffffff");
      expect(libraryData.headerLinks).to.deep.equal([
        {
          href: "http://library.org/1.html",
          title: "one",
          rel: "related",
          type: "text/html",
          role: "navigation"
        },
        {
          href: "http://library.org/2.html",
          title: "two",
          rel: "related",
          type: "text/html",
          role: "navigation"
        }
      ]);
    });
  });

  describe("getCacheEntry", () => {
    // Create a mock cache class that already has a url template as well
    // an auth document and catalog.
    class LibraryDataCacheWithTemplate extends LibraryDataCacheWithCatalogAndAuthDocument {
      protected libraryUrlTemplate = "/library/{uuid}";
    }
    const registryEntry = {
      links: [
        {
          href: "http://library.org/catalog",
          rel: "http://opds-spec.org/catalog"
        }
      ],
      metadata: {
        updated: "20180901",
        id: "uuid",
        title: "the library"
      }
    };

    it("fetches an entry from the registry if it's not in the cache", async () => {
      const cache = new LibraryDataCacheWithTemplate("base-url");

      // What gets called in `getRegistryEntry`
      fetchMock.mock("/library/uuid", {
        status: 200,
        body: { catalogs: [registryEntry] }
      });
      const fetchArgs = fetchMock.calls();

      const uncachedResult = await cache.getCacheEntry("uuid");
      expect(uncachedResult.registryEntry).to.deep.equal(registryEntry);
      expect(uncachedResult.authDocument).to.deep.equal({
        links: [],
        title: "title"
      });
      expect(fetchMock.called()).to.equal(true);
      expect(fetchArgs.length).to.equal(1);
      expect(fetchArgs[0][0]).to.equal("/library/uuid");
      expect(getCatalog.callCount).to.equal(1);
      expect(getAuthDocument.callCount).to.equal(1);

      // Now the entry is in the cache so fetch won't be called again.
      const cachedResult = await cache.getCacheEntry("uuid");
      expect(fetchArgs.length).to.equal(1);
      expect(cachedResult.registryEntry).to.deep.equal(registryEntry);
      expect(cachedResult.authDocument).to.deep.equal({
        links: [],
        title: "title"
      });
    });

    it("fetches an entry from the config file if it's not in the cache", async () => {
      const config = { library: "http://libraryfromconfig.org" };
      const cache = new LibraryDataCacheWithTemplate(undefined, 100, config);

      const uncachedResult = await cache.getCacheEntry("library");
      expect(uncachedResult.registryEntry).to.be.undefined;
      expect(uncachedResult.authDocument).to.deep.equal({
        links: [],
        title: "title"
      });
      expect(fetchMock.called()).to.equal(false);
      expect(getCatalog.callCount).to.equal(1);
      expect(getAuthDocument.callCount).to.equal(1);

      // Now the entry is in the cache so fetch won't be called.
      const cachedResult = await cache.getCacheEntry("library");
      expect(fetchMock.called()).to.equal(false);
      expect(uncachedResult.registryEntry).to.be.undefined;
      expect(cachedResult.authDocument).to.deep.equal({
        links: [],
        title: "title"
      });
    });

    it("fetches an entry from the registry if it's in the cache but expired", async () => {
      const cache = new LibraryDataCacheWithTemplate("base-url", 1);

      fetchMock.mock("/library/uuid", {
        status: 200,
        body: { catalogs: [registryEntry] }
      });
      const fetchArgs = fetchMock.calls();

      const uncachedResult = await cache.getCacheEntry("uuid");
      expect(uncachedResult.registryEntry).to.deep.equal(registryEntry);
      expect(uncachedResult.authDocument).to.deep.equal({
        links: [],
        title: "title"
      });
      expect(fetchArgs.length).to.equal(1);
      expect(fetchArgs[0][0]).to.equal("/library/uuid");
      expect(getAuthDocument.callCount).to.equal(1);

      // Now the entry is in the cache, but if we wait more than 1 second
      // it will be expired.
      await new Promise<void>(resolve => setTimeout(resolve, 1001));
      const cacheExpiredResult = await cache.getCacheEntry("uuid");
      expect(cacheExpiredResult.registryEntry).to.deep.equal(registryEntry);
      expect(cacheExpiredResult.authDocument).to.deep.equal({
        links: [],
        title: "title"
      });
      expect(fetchArgs.length).to.equal(2);
      expect(fetchArgs[1][0]).to.equal("/library/uuid");
      expect(getAuthDocument.callCount).to.equal(2);
    });

    it("fetches an entry from the config file if it's in the cache but expired", async () => {
      const config = { library: "http://libraryfromconfig.org" };
      const cache = new LibraryDataCacheWithTemplate(undefined, 1, config);

      const uncachedResult = await cache.getCacheEntry("library");
      expect(uncachedResult.registryEntry).to.be.undefined;
      expect(uncachedResult.authDocument).to.deep.equal({
        links: [],
        title: "title"
      });
      expect(fetchMock.called()).to.equal(false);
      expect(getCatalog.callCount).to.equal(1);
      expect(getAuthDocument.callCount).to.equal(1);

      // Now the entry is in the cache, but if we wait more than 1 second
      // it will be expired.
      await new Promise<void>(resolve => setTimeout(resolve, 1001));
      const cacheExpiredResult = await cache.getCacheEntry("library");
      expect(cacheExpiredResult.registryEntry).to.be.undefined;
      expect(cacheExpiredResult.authDocument).to.deep.equal({
        links: [],
        title: "title"
      });
      expect(fetchMock.called()).to.equal(false);
      expect(getCatalog.callCount).to.equal(2);
      expect(getAuthDocument.callCount).to.equal(2);
    });

    it("ignores errors fetching the auth document", async () => {
      const cache = new LibraryDataCacheWithTemplate("base-url");
      getAuthDocument.returns(
        new Promise<AuthDocument>((resolve, reject) => reject())
      );

      fetchMock.mock("/library/uuid", {
        status: 200,
        body: { catalogs: [registryEntry] }
      });
      const fetchArgs = fetchMock.calls();

      const uncachedResult = await cache.getCacheEntry("uuid");
      expect(uncachedResult.registryEntry).to.deep.equal(registryEntry);
      expect(uncachedResult.authDocument).to.be.undefined;
      expect(fetchMock.called()).to.equal(true);
      expect(fetchArgs[0][0]).to.equal("/library/uuid");
      expect(getAuthDocument.callCount, "getAuthDocument call count").to.equal(
        1
      );
    });

    it("throws an error if there's an error fetching the catalog", async () => {
      const cache = new LibraryDataCacheWithTemplate("/base-url");
      getCatalog.returns(
        new Promise<OPDSFeed>((resolve, reject) => reject())
      );

      const mockFetch = stub().returns(
        new Promise<any>(resolve => {
          resolve({
            json: () => {
              return { catalogs: [registryEntry] };
            }
          });
        })
      );

      fetchMock.mock("/library/uuid", {
        status: 200,
        body: { catalogs: [registryEntry] }
      });

      try {
        const result = await cache.getCacheEntry("uuid");
        // Fail the test if it's successful
        expect(true, "no error was raised").to.equal(false);
      } catch (error) {
        expect(error).to.contain("This library is not available");
        expect(fetchMock.called()).to.equal(true);
        expect(getCatalog.callCount).to.equal(1);
      }
    });

    it("throws an error if the registry response doesn't have a library catalog.", async () => {
      const cache = new LibraryDataCacheWithTemplate("/base-url");

      fetchMock.mock("/base-url", 200);
      fetchMock.mock("/library/uuid", { status: 200, body: { catalogs: [] } });

      try {
        // This should raise an error since the registry response does not have a catalog.
        const result = await cache.getCacheEntry("uuid");
        // Fail the test if it's successful.
        expect(true, "no error was raised").to.equal(false);
      } catch (error) {
        expect(error).to.contain("This library is not available");
        expect(fetchMock.called()).to.equal(true);
      }
    });

    it("throws an error if the registry returns a problem detail", async () => {
      const cache = new LibraryDataCacheWithTemplate("base url");
      fetchMock.mock("/base-url", 200);
      fetchMock.mock("/library/uuid", () => {
        throw "some problem detail";
      });

      try {
        // This should raise an error since the registry response was an error.
        const result = await cache.getCacheEntry("uuid");
        // Fail the test if it's successful.
        expect(true, "no error was raised").to.equal(false);
      } catch (error) {
        expect(error).to.contain("This library is not available");
        expect(fetchMock.called()).to.equal(true);
      }
    });

    it("returns an error if the registry entry doesn't have a catalog url", async () => {
      const registryEntryWithoutCatalog = { ...registryEntry, links: [] };
      const cache = new LibraryDataCacheWithTemplate("base-url");

      fetchMock.mock("/base-url", 200);
      fetchMock.mock("/library/uuid", {
        status: 200,
        body: { catalogs: [registryEntryWithoutCatalog] }
      });

      try {
        // This should raise an error.
        const result = await cache.getCacheEntry("uuid");
        // Fail the test if it's successful.
        expect(true, "no error was raised").to.equal(false);
      } catch (error) {
        expect(error).to.contain("Registry entry does not have a catalog URL");
      }
    });

    it("throws an error if the config file doesn't have an entry for the library", async () => {
      const config = { library: "http://libraryfromconfig.org" };
      const cache = new LibraryDataCacheWithTemplate(undefined, 10, config);

      try {
        // This should raise an error since the library is not in the config.
        const result = await cache.getCacheEntry("otherlibrary");
        // Fail the test if it's successful.
        expect(true, "no error was raised").to.equal(false);
      } catch (error) {
        expect(error).to.contain("No catalog is configured");
      }
    });
  });

  describe("getRegistryEntry", () => {
    // Create a mock cache class that already has a url template.
    class LibraryDataCacheWithTemplate extends LibraryDataCache {
      protected libraryUrlTemplate = "/library/{uuid}";
    }
    const cache = new LibraryDataCacheWithTemplate("base-url");
    const registryEntry = {
      links: [
        {
          href: "http://library.org/catalog",
          rel: "http://opds-spec.org/catalog"
        }
      ],
      metadata: {
        updated: "20180901",
        id: "uuid",
        title: "the library"
      }
    };

    it("fetches a registry entry", async () => {
      const registryResponse = {
        catalogs: [registryEntry]
      };

      const mockFetch = stub();
      mockFetch.returns(
        new Promise<any>(resolve => {
          resolve({ json: () => registryResponse });
        })
      );

      fetchMock.mock("/library/uuid", { status: 200, body: registryResponse });

      const fetchArgs = fetchMock.calls();

      const result = await cache.getRegistryEntry("uuid");
      expect(result).to.deep.equal(registryEntry);
      expect(fetchMock.called()).to.equal(true);
      expect(fetchArgs[0][0]).to.equal("/library/uuid");
    });

    it("throws an error if the registry returns the wrong number of catalogs", async () => {
      const catalogsLists = [[], [registryEntry, registryEntry]];
      for (const catalogs of catalogsLists) {
        const registryResponse = {
          catalogs: catalogs
        };

        fetchMock.mock("/library/uuid", {
          status: 200,
          body: registryResponse
        });

        try {
          // This should raise an error.
          const result = await cache.getRegistryEntry("uuid");
          // Fail the test if it's successful.
          expect(true, "no error was raised").to.equal(false);
        } catch (error) {
          expect(error).to.contain("This library is not available");
        }

        fetchMock.restore();
      }
    });
  });

  describe("getCatalog", () => {
    const cache = new LibraryDataCache("base-url");
    const opdsFeed = `<feed xmlns:app="http://www.w3.org/2007/app" xmlns:bib="http://bib.schema.org/" xmlns:bibframe="http://bibframe.org/vocab/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:drm="http://librarysimplified.org/terms/drm" xmlns:opds="http://opds-spec.org/2010/catalog" xmlns:opf="http://www.idpf.org/2007/opf" xmlns:schema="http://schema.org/" xmlns:simplified="http://librarysimplified.org/terms/" xmlns="http://www.w3.org/2005/Atom" simplified:entryPoint="http://schema.org/EBook">
      <id>http://library.org/catalog</id>
      <title>Library</title>
      <link href="http://library.org/authentication_document" rel="http://opds-spec.org/auth/document"/>
      </feed>`;

    it("fetches a catalog", async () => {
      fetchMock.mock("/base-url", 200);
      fetchMock.mock("http://library.org/catalog", {
        status: 200,
        body: opdsFeed
      });
      const fetchArgs = fetchMock.calls();

      const result = await cache.getCatalog("http://library.org/catalog");
      expect(result.id).to.equal("http://library.org/catalog");
      expect(result.title).to.equal("Library");
      expect(result.links.length).to.equal(1);
      expect(result.links[0].rel).to.equal(
        "http://opds-spec.org/auth/document"
      );
      expect(result.links[0].href).to.equal(
        "http://library.org/authentication_document"
      );
      expect(fetchMock.called()).to.equal(true);
      expect(fetchArgs[0][0]).to.equal("http://library.org/catalog");
    });

    it("returns an error if it can't fetch the catalog", async () => {
      fetchMock.mock("http://library.org/catalog", () => Promise.reject(""));

      try {
        // This should raise an error.
        const result = await cache.getCatalog("http://library.org/catalog");
        // Fail the test if it's successful.
        expect(true, "no error was raised").to.equal(false);
      } catch (error) {
        expect(error).to.contain("Could not get OPDS catalog");
        expect(fetchMock.called()).to.equal(true);
      }
    });

    it("returns an error if fetching the catalog does not return an OPDS feed", async () => {
      fetchMock.mock("http://library.org/catalog", {
        status: 200,
        body: "not OPDS"
      });
      try {
        // This should raise an error.
        const result = await cache.getCatalog("http://library.org/catalog");
        // Fail the test if it's successful.
        expect(true, "no error was raised").to.equal(false);
      } catch (error) {
        expect(error).to.contain("Could not get OPDS catalog");
        expect(fetchMock.called()).to.equal(true);
      }
    });
  });

  describe("getAuthDocument", () => {
    const cache = new LibraryDataCache("base-url");
    const feed = new OPDSFeed({
      id: "1",
      title: "Library",
      updated: "20180102",
      entries: [],
      links: [
        {
          rel: "related",
          href: "http://library.org/1.html",
          type: "text/html",
          title: "One",
          role: "navigation"
        },
        {
          rel: "related",
          href: "http://library.org/2.html",
          type: "text/html",
          title: "Two",
          role: "navigation"
        },
        {
          rel: "http://opds-spec.org/auth/document",
          href: "http://library.org/authentication_document",
          type: "application/json",
          title: "Auth",
          role: ""
        }
      ],
      complete: true,
      search: { totalResults: 0, startIndex: 0, itemsPerPage: 0 },
      unparsed: {}
    });
    const authDoc = {
      title: "title",
      links: []
    };

    it("fetches an auth document", async () => {
      fetchMock.mock("http://library.org/authentication_document", {
        status: 200,
        body: authDoc
      });
      const fetchArgs = fetchMock.calls();

      const result = await cache.getAuthDocument(feed);
      expect(result).to.deep.equal(authDoc);
      expect(fetchMock.called()).to.equal(true);
      expect(fetchArgs[0][0]).to.equal(
        "http://library.org/authentication_document"
      );
    });

    it("returns an error if the catalog does not have an auth document url", async () => {
      const mockFetch = stub();
      const feedWithoutAuthDoc = new OPDSFeed({
        id: "1",
        title: "Library",
        updated: "20180102",
        entries: [],
        links: [],
        complete: true,
        search: { totalResults: 0, startIndex: 0, itemsPerPage: 0 },
        unparsed: {}
      });

      try {
        // This should raise an error.
        const result = await cache.getAuthDocument(feedWithoutAuthDoc);
        // Fail the test if it's successful.
        expect(true, "no error was raised").to.equal(false);
      } catch (error) {
        expect(error).to.contain("Could not find authentication document");
      }
    });

    it("returns an error if it can't fetch the auth document", async () => {
      fetchMock.mock("http://library.org/authentication_document", () =>
        Promise.reject("")
      );

      try {
        // This should raise an error.
        const result = await cache.getAuthDocument(feed);
        // Fail the test if it's successful.
        expect(true, "no error was raised").to.equal(false);
      } catch (error) {
        expect(error).to.contain("Could not get authentication document");
        expect(fetchMock.called()).to.equal(true);
      }
    });
  });
});
