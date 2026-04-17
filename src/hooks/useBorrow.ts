import * as React from "react";
import { fetchBook } from "dataflow/opds1/fetch";
import useUser from "components/context/UserContext";
import useLibraryContext from "components/context/LibraryContext";
import useError from "hooks/useError";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

export default function useBorrow(isBorrow: boolean) {
  const { catalogUrl } = useLibraryContext();
  const { setBook, token } = useUser();
  const isUnmounted = React.useRef(false);
  const [isLoading, setLoading] = React.useState(false);
  const { error, handleError, setErrorString, clearError } = useError();
  const { t } = useTranslation();
  const { locale } = useRouter();

  const loadingText = isBorrow
    ? t("useBorrow.borrowing")
    : t("useBorrow.reserving");
  const buttonLabel = isBorrow
    ? t("useBorrow.borrowBook")
    : t("useBorrow.reserveBook");

  const borrowOrReserve = async (url: string) => {
    clearError();
    if (!token) {
      setErrorString(t("useBorrow.signInToBorrow"));
      return;
    }
    setLoading(true);
    try {
      const book = await fetchBook(url, catalogUrl, token, locale);
      setBook(book);
    } catch (e) {
      handleError(e);
    }

    if (!isUnmounted.current) setLoading(false);
  };

  React.useEffect(
    () => () => {
      isUnmounted.current = true;
    },
    []
  );

  return {
    isLoading,
    loadingText,
    buttonLabel,
    borrowOrReserve,
    error
  };
}
