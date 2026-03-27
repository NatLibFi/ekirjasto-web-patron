/** @jsxRuntime classic */
/** @jsx jsx */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { jsx } from "theme-ui";
import * as React from "react";
import { NextPage, GetStaticProps, GetStaticPaths } from "next";
import LayoutPage from "components/LayoutPage";
import withAppProps, { AppProps } from "dataflow/withAppProps";
import useUser from "components/context/UserContext";
import useLibraryContext from "components/context/LibraryContext";
import {
  getMagazineReaderUrl,
  getMagazineAllowedOrigin,
  MAGAZINE_CONFIG
} from "config/magazines";
import Head from "next/head";
import BreadcrumbBar from "components/BreadcrumbBar";
import { EKIRJASTO_AUTH_TYPE } from "utils/constants";
import { useTranslation } from "next-i18next";

const MagazinesFixedContent: React.FC = () => {
  const iframeRef = React.useRef<HTMLIFrameElement | null>(null);
  const { token, getEkirjastoToken } = useUser();
  const { slug, authMethods } = useLibraryContext();
  const ekirMethod = authMethods.find(
    method => method.type === EKIRJASTO_AUTH_TYPE
  );
  let ekirjastoToken: string | undefined;
  if (ekirMethod && token) {
    try {
      //Get the ekirjastoToken
      const ekirjastoTokenUrl = ekirMethod.links.find(
        link => link.rel === "ekirjasto_token"
      )?.href;
      ekirjastoToken = getEkirjastoToken(token, ekirjastoTokenUrl);
    } catch (error) {
      //Can not start the reader so should show not logged in or something
    }
  }
  if (!token) {
    //If there is no token, reload should happen
    ekirjastoToken = undefined;
  }

  const storageKey = React.useMemo(
    () => `${MAGAZINE_CONFIG.STORAGE_KEY_PREFIX}${slug ?? "default"}`,
    [slug]
  );

  const [initialPath, setInitialPath] = React.useState<string | undefined>(
    undefined
  );

  React.useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey) || undefined;
      setInitialPath(saved);
    } catch {
      setInitialPath(undefined);
    }
  }, [storageKey]);

  const handleMessage = React.useCallback(
    (e: MessageEvent) => {
      const allowedOrigin = getMagazineAllowedOrigin();

      if (e.origin !== allowedOrigin || typeof e.data !== "string") return;

      if (e.data === "ewl:unauthorized") {
        if (ekirjastoToken) {
          iframeRef.current?.contentWindow?.postMessage(
            `ewl:login:${ekirjastoToken}`,
            allowedOrigin
          );
        }
        return;
      }

      if (e.data.startsWith("ewl:navigate:")) {
        const path = e.data.slice("ewl:navigate:".length);
        try {
          window.localStorage.setItem(storageKey, path);
        } catch {}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        window?.dataLayer?.push({
          event: "magazines_navigate",
          magazines_path: path // eslint-disable-line camelcase
        });
      }
    },
    [ekirjastoToken, storageKey]
  );

  React.useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [handleMessage]);

  const src = React.useMemo(() => {
    const path = initialPath ?? "";
    const baseUrl = getMagazineReaderUrl();
    return `${baseUrl}${path}`;
  }, [initialPath]);

  const { t } = useTranslation();

  // fixed-height layout where only the iframe scrolls and the footer is hidden
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        flex: "1 1 auto",
        minHeight: 0,
        overflow: "hidden",
        position: "relative"
      }}
    >
      <iframe
        ref={iframeRef}
        title={t("magazines.titleForIframe")}
        src={src}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          border: 0
        }}
        allow={MAGAZINE_CONFIG.IFRAME_ALLOW}
        sandbox={MAGAZINE_CONFIG.IFRAME_SANDBOX}
      />
    </div>
  );
};

const MagazinesFixedPage: NextPage<AppProps> = ({ library, error }) => {
  const { t } = useTranslation();
  return (
    <LayoutPage library={library} error={error} hideFooter>
      <>
        <Head>
          <title>{t("magazines.HTMLtitleForMagazines")}</title>
        </Head>
        <BreadcrumbBar
          currentLocation={t("magazines.breadcrumbForMagazines")}
        />
        <MagazinesFixedContent />
      </>
    </LayoutPage>
  );
};

export const getStaticProps: GetStaticProps = withAppProps();

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true
  };
};

export default MagazinesFixedPage;
