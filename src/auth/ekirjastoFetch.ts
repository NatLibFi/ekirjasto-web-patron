import ApplicationError, { ServerError } from "errors";
import fetchWithHeaders from "../dataflow/fetch";

/**
 * Fetch bearer (circulation) token for authenticating user
 */
export async function fetchEAuthToken(
  url: string | undefined,
  token: string | undefined
) {
  if (!url || !token) {
    throw new ApplicationError({
      title: "Incomplete Authentication Info",
      detail: "No URL or Token was provided for authentication"
    });
  }

  //If in some case, the bearer text is present, remove it so there is no repetition in the request
  if (token?.startsWith("Bearer ")) {
    token = token.replace("Bearer ", "");
  }

  const response = await fetchWithHeaders(url, `Bearer ${token}`, {}, "POST");
  const json = await response.json();

  if (!response.ok) {
    throw new ServerError(url, response.status, json);
  }

  return json;
}

export async function fetchEkirjastoToken(
  url: string | undefined,
  token: string | undefined
) {
  if (!url || !token) {
    throw new ApplicationError({
      title: "Incomplete Authentication Info",
      detail: "No URL or Token was provided for authentication"
    });
  }

  const response = await fetchWithHeaders(url, token, {}, "GET");
  const json = await response.json();

  if (!response.ok) {
    throw new ServerError(url, response.status, json);
  }

  return json;
}
