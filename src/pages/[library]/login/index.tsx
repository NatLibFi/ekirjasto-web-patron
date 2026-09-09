import * as React from "react";
import { NextPage, GetStaticPaths, GetStaticProps } from "next";
import LayoutPage from "components/LayoutPage";
import withAppProps, { AppProps } from "dataflow/withAppProps";
import LoginWrapper from "auth/LoginWrapper";
import Login from "auth/Login";
import OpenEbooksLoginPicker from "auth/OpenEbooksLoginPicker";
import { APP_CONFIG } from "utils/env";

type PageProps = AppProps & {
  bannerInitiallyVisible: boolean;
};

const LoginPage: NextPage<PageProps> = ({
  library,
  error,
  bannerInitiallyVisible
}) => {
  return (
    <LayoutPage
      library={library}
      error={error}
      bannerInitiallyVisible={bannerInitiallyVisible}
    >
      <LoginWrapper>
        {APP_CONFIG.openebooks ? <OpenEbooksLoginPicker /> : <Login />}
      </LoginWrapper>
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

export default LoginPage;
