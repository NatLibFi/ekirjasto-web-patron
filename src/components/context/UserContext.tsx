import { fetchAuthToken } from "auth/fetch";
import useCredentials from "auth/useCredentials";
import useLibraryContext from "components/context/LibraryContext";
import { fetchCollection } from "dataflow/opds1/fetch";
import { ServerError } from "errors";
import { AppAuthMethod, AnyBook, AuthCredentials, Token } from "interfaces";
import * as React from "react";
import useSWR from "swr";
import { BasicTokenAuthType, EkirjastoAuthType } from "types/opds1";
import { addHours, isBefore } from "date-fns";
import { fetchEAuthToken, fetchEkirjastoToken } from "auth/ekirjastoFetch";
import { useRouter } from "next/router";

type Status = "authenticated" | "loading" | "unauthenticated";
export type UserState = {
  loans: AnyBook[] | undefined;
  selected: AnyBook[] | undefined;
  recentlyRevokedBooks: AnyBook[];
  status: Status;
  isAuthenticated: boolean;
  isLoading: boolean;
  refetchLoans: () => void;
  signIn: (
    token: string,
    method: AppAuthMethod,
    authenticationUrl: string | undefined
  ) => void;
  signOut: () => void;
  getEkirjastoToken: (
    token: string,
    fetchUrl?: string,
    refreshUrl?: string
  ) => Promise<string>;
  setBook: (book: AnyBook, id?: string) => void;
  setSelected: (book: AnyBook, id?: string) => void;
  error: any;
  token: string | undefined;
  clearCredentials: () => void;
};

export const UserContext = React.createContext<UserState | undefined>(
  undefined
);

interface UserProviderProps {
  children: React.ReactNode;
}

/**
 * Here we fetch the loans and provide functions to sign in
 * and sign out. Calling mutate() will invalidate the SWR
 * cache and therefore cause a refetch. The key to the cache
 * includes the shelfUrl, token and auth method type, so if any of
 * those change it will cause a refetch.
 */
export const UserProvider = ({ children }: UserProviderProps) => {
  const { shelfUrl, selectedUrl, slug, authMethods } = useLibraryContext();
  const { credentials, setCredentials, clearCredentials } = useCredentials(
    slug,
    authMethods
  );
  const [error, setError] = React.useState<ServerError | null>(null);
  // Track recently revoked books that became unavailable (0 copies, license expired).
  // This is needed because the revoke response indicates the book is unavailable,
  // but subsequent fetches from the book details endpoint may return stale "available" data.
  // BookDetails uses this to detect revocation and redirect.
  const [recentlyRevokedBooks, setRecentlyRevokedBooks] = React.useState<
    AnyBook[]
  >([]);

  const shouldRevalidate = () => {
    if (credentials?.methodType === BasicTokenAuthType) {
      if (typeof credentials?.token !== "string" && credentials?.token) {
        if (credentials.token?.expirationDate) {
          return isBefore(credentials?.token?.expirationDate, new Date());
        }
      }
    }

    return false;
  };

  const token = stringifyToken(credentials);
  const { data: loansData, mutate, isValidating } = useFetchFeed(shelfUrl);
  const { data: selectedData, mutate: mutateSelected } = useFetchFeed(
    selectedUrl
  );

  function useFetchFeed(fetchableUrl: string | null) {
    const { locale } = useRouter();
    return useSWR(
      // pass null if there are no credentials or shelfUrl to tell SWR not to fetch at all.
      credentials && fetchableUrl
        ? [fetchableUrl, token, locale, credentials?.methodType]
        : null,
      fetchLoans,
      {
        shouldRetryOnError:
          credentials?.methodType === BasicTokenAuthType ||
          credentials?.methodType === EkirjastoAuthType,
        revalidateOnFocus: shouldRevalidate(),
        revalidateOnReconnect: false,
        errorRetryCount:
          credentials?.methodType === BasicTokenAuthType ||
          credentials?.methodType === EkirjastoAuthType
            ? 1
            : 0,
        // Try and fetch new token once old token has expired
        onErrorRetry: async (err, _key, _config, revalidate) => {
          if (err instanceof ServerError && err?.info.status === 401) {
            if (credentials?.methodType === BasicTokenAuthType) {
              try {
                // assume expiresIn is in seconds
                const { accessToken, expiresIn } = await fetchAuthToken(
                  credentials?.authenticationUrl,
                  stringifyToken(credentials, "basicToken")
                );
                setCredentials({
                  authenticationUrl: credentials?.authenticationUrl,
                  methodType: credentials.methodType,
                  token: {
                    bearerToken: `Bearer ${accessToken}`,
                    basicToken: stringifyToken(credentials, "basicToken"),
                    expirationDate: addHours(new Date(), expiresIn / 3600)
                  }
                });
                revalidate();
              } catch (err) {
                setError(err);
                clearCredentials();
              }
            }
            if (credentials?.methodType === EkirjastoAuthType) {
              try {
                // Try refreshing the access token
                const { access_token: accessToken } = await fetchEAuthToken(
                  credentials?.authenticationUrl,
                  stringifyToken(credentials)
                );
                setCredentials({
                  authenticationUrl: credentials?.authenticationUrl,
                  methodType: credentials.methodType,
                  token: `Bearer ${accessToken}`
                });
                revalidate();
              } catch (err) {
                setError(err);
                clearCredentials();
              }
            }
          }
        },
        // clear credentials whenever we receive a 401, but save the error so it sticks around.
        // however, BasicTokenAuthType methods are retried in onErrorRetry to get new token
        onError: err => {
          if (err instanceof ServerError && err?.info.status === 401) {
            if (
              credentials?.methodType !== BasicTokenAuthType &&
              credentials?.methodType !== EkirjastoAuthType
            ) {
              setError(err);
              clearCredentials();
            }
          }
        }
      }
    );
  }

  async function getEkirjastoToken(
    token: string,
    fetchUrl?: string,
    refreshUrl?: string
  ): Promise<string> {
    const { token: ekirjastoToken } = await fetchEkirjastoToken(
      fetchUrl,
      token,
      refreshUrl
    );
    return ekirjastoToken;
  }

  function signIn(
    token: string | Token,
    method: AppAuthMethod,
    authenticationUrl: string | undefined
  ) {
    setCredentials({ token, authenticationUrl, methodType: method.type });
    mutate();
  }

  function signOut() {
    clearCredentials();
    mutate();
  }

  function setBook(book: AnyBook, id?: string) {
    // Get the current loans array from SWR cache, or empty array if undefined
    const existing = loansData ?? [];

    let newData: AnyBook[];

    if (id) {
      // REVOKE CASE: Remove the book with the specified id from loans
      newData = existing.filter(existingBook => existingBook.id !== id);

      // If the revoke response indicates the book is now unavailable (0 copies),
      // track it so BookDetails can detect and redirect.
      // We trust the revoke response over potentially stale book details endpoint data.
      if (book.status === "unavailable") {
        setRecentlyRevokedBooks(prev => {
          // Avoid duplicates
          const withoutOld = prev.filter(b => b.id !== id);
          return [...withoutOld, book];
        });
      }
    } else {
      // BORROW/RESERVE CASE: Add or update the book in loans
      // Remove any existing book with the same id first (in case it's an update)
      const withoutOld = existing.filter(
        existingBook => existingBook.id !== book.id
      );
      // Add the new/updated book
      newData = [...withoutOld, book];
    }

    // Update the loans SWR cache with the new data.
    // This triggers an update to all components using loans (like MyBooks list).
    // The 'false' parameter tells SWR NOT to revalidate/refetch from the API after this update,
    // so the data stays as we set it instead of being overwritten by stale API data.
    mutate(newData, false);
  }

  function setSelected(book: AnyBook, id?: string) {
    const existing = selectedData ?? [];

    if (id) {
      // REMOVE case: filter out the book with the given id, do not re-add it
      mutateSelected(
        existing.filter(b => b.id !== id),
        false
      );
    } else {
      // ADD case: replace any existing entry for this book, then append
      const withoutOld = existing.filter(b => b.id !== book.id);
      mutateSelected([...withoutOld, book], false);
    }
  }

  /**
   * We should only ever be in one of these three states.
   */
  const status: Status =
    loansData && credentials
      ? "authenticated"
      : credentials && isValidating
      ? "loading"
      : "unauthenticated";

  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";
  const user: UserState = {
    status,
    isAuthenticated,
    isLoading,
    loans: isAuthenticated ? loansData ?? [] : undefined,
    selected: isAuthenticated ? selectedData ?? [] : undefined,
    recentlyRevokedBooks,
    refetchLoans: mutate,
    signIn,
    signOut,
    getEkirjastoToken,
    setBook,
    setSelected,
    error,
    token: stringifyToken(credentials),
    clearCredentials
  };

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export default function useUser() {
  const context = React.useContext(UserContext);
  if (typeof context === "undefined") {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

// we only need the books out of a collection for loans,
// so this is a utility to extract those.
async function fetchLoans(url: string, token: string, locale: string) {
  const collection = await fetchCollection(url, token, locale);
  return collection.books;
}

function stringifyToken(
  credentials: AuthCredentials | undefined,
  tokenType: string = "bearerToken"
): string | undefined {
  if (
    credentials?.methodType === BasicTokenAuthType &&
    typeof credentials?.token === "object"
  ) {
    return credentials?.token?.[tokenType];
  }

  if (typeof credentials?.token === "string") {
    return credentials.token;
  }

  return undefined;
}
