/** @jsxRuntime classic */
/** @jsx jsx */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { jsx } from "theme-ui";
import * as React from "react";
import { NextPage, GetStaticProps, GetStaticPaths } from "next";
import LayoutPage from "components/LayoutPage";
import withAppProps, { AppProps } from "dataflow/withAppProps";
// import useUser from "components/context/UserContext";
import useLogin from "auth/useLogin";
import useLibraryContext from "components/context/LibraryContext";
import {
  getMagazineReaderUrl,
  getMagazineAllowedOrigin,
  MAGAZINE_CONFIG
} from "config/magazines";
import Head from "next/head";
import BreadcrumbBar from "components/BreadcrumbBar";

const MagazinesFixedContent: React.FC = () => {
  const iframeRef = React.useRef<HTMLIFrameElement | null>(null);
  const token = "MOCK_TOKEN";
  // const { token } = useUser();
  const { initLogin } = useLogin();
  const { slug } = useLibraryContext();

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
        if (token) {
          iframeRef.current?.contentWindow?.postMessage(
            `ewl:login:${token}`,
            allowedOrigin
          );
        } else {
          initLogin();
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
    [initLogin, token, storageKey]
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
        title="Magazines (Fixed)"
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
  return (
    <LayoutPage library={library} error={error} hideFooter>
      <>
        <Head>
          <title>{t("title_magazines", "Magazines - E-library")}</title>
        </Head>
        <BreadcrumbBar currentLocation={t("breadcrumb_magazines", "Magazines")} />
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
