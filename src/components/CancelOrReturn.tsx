/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "theme-ui";
import * as React from "react";
import useLibraryContext from "components/context/LibraryContext";
import useUser from "components/context/UserContext";
import { fetchBook } from "dataflow/opds1/fetch";
import Button from "components/Button";
import { Text } from "components/Text";
import useError from "hooks/useError";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

const CancelOrReturn: React.FC<{
  text: string;
  loadingText: string;
  url: string | null;
  id: string;
}> = ({ text, loadingText, url, id }) => {
  const { token, setBook } = useUser();
  const { catalogUrl } = useLibraryContext();
  const [loading, setLoading] = React.useState(false);
  const { error, handleError, setErrorString, clearError } = useError();
  const { t } = useTranslation();
  const { locale } = useRouter();

  async function cancelReservation(revokeUrl: string) {
    clearError();
    if (!token) {
      setErrorString(t("cancelOrReturn.signIn"));
      return;
    }
    setLoading(true);
    try {
      const newBook = await fetchBook(revokeUrl, catalogUrl, token, locale);
      setBook(newBook, id);
    } catch (e) {
      handleError(e);
    }
    setLoading(false);
  }
  if (!url) return null;
  return (
    <>
      <Button
        onClick={() => cancelReservation(url)}
        loading={loading}
        loadingText={loadingText}
      >
        {text}
      </Button>
      {error && <Text>{error}</Text>}
    </>
  );
};

export default CancelOrReturn;
