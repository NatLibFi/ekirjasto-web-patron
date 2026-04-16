/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "theme-ui";
import useUser from "components/context/UserContext";
import { PageLoader } from "components/LoadingIndicator";
import React from "react";
import { useTranslation } from "next-i18next";

/**
 * This will show a message if the user tries to access a route they are not permitted to see.
 */

interface Props {
  children: React.ReactNode;
}
const AuthProtectedRoute = ({ children }: Props) => {
  const { isLoading, isAuthenticated } = useUser();

  if (isAuthenticated) {
    return <>{children}</>;
  }
  if (isLoading) {
    return <PageLoader />;
  }
  return <Unauthorized />;
};

export default AuthProtectedRoute;

const Unauthorized = () => {
  const { t } = useTranslation();

  return (
    <div
      sx={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column"
      }}
    >
      <h4>{t("auth.unauthorizedMessage")}</h4>
    </div>
  );
};
