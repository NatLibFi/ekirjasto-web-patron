import * as React from "react";
import { NextPage, GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head"; // Import Head for meta tags
import LayoutPage from "components/LayoutPage";
import withAppProps, { AppProps } from "dataflow/withAppProps";
import { useTranslation } from "next-i18next";

const StatisticsPage: NextPage<AppProps> = ({ library, error }) => {
  const { t } = useTranslation();

  return (
    <LayoutPage library={library} error={error}>
      <Head>
        <meta name="robots" content="noindex" />
      </Head>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh"
        }}
      >
        <iframe
          title={t("statisticsPage.titleForIframe")}
          width="1140"
          height="541.25"
          src="https://app.powerbi.com/reportEmbed?reportId=e8ece40d-ad3c-4757-bb27-908c1c9be3af&autoAuth=true&ctid=98ae7559-10dc-4288-8e2e-4593e62fe3ee&actionBarEnabled=true"
          frameBorder="0"
          style={{
            border: "none",
            width: "100%",
            height: "100%"
          }}
        ></iframe>
      </div>
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

export default StatisticsPage;
