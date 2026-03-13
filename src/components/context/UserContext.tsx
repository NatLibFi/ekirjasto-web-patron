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

type Status = "authenticated" | "loading" | "unauthenticated";
export type UserState = {
  loans: AnyBook[] | undefined;
  selected: AnyBook[] | undefined;
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
    fetchUrl: string | undefined
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
    return useSWR(
      // pass null if there are no credentials or shelfUrl to tell SWR not to fetch at all.
      credentials && fetchableUrl
        ? [fetchableUrl, token, credentials?.methodType]
        : null,
      fetchLoans,
      {
        shouldRetryOnError: credentials?.methodType === BasicTokenAuthType,
        revalidateOnFocus: shouldRevalidate(),
        revalidateOnReconnect: false,
        errorRetryCount: credentials?.methodType === BasicTokenAuthType ? 1 : 0,
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
    fetchUrl: string | undefined
  ): Promise<string> {
    const { token: ekirjastoToken } = await fetchEkirjastoToken(
      fetchUrl,
      token
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
    const existing = loansData ?? [];

    // if the id exists, remove that book and set the new one
    const withoutOldBook = existing.filter(book => book.id !== id);
    const newData: AnyBook[] = [...withoutOldBook, book];
    mutate(newData);
  }

  function setSelected(book: AnyBook, id?: string) {
    const existing = selectedData ?? [];

    // if the id exists, remove that book and set the new one
    const withoutOldBook = existing.filter(book => book.id !== id);
    const newData: AnyBook[] = [...withoutOldBook, book];
    mutateSelected(newData);
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
async function fetchLoans(url: string, token: string) {
  const collection = await fetchCollection(url, token);
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
