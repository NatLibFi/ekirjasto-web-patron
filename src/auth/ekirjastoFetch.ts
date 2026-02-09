import ApplicationError, { ServerError } from "errors";
import fetchWithHeaders from "../dataflow/fetch";

/**
 * Fetch bearer (circulation) token for authenticating user
 */
export async function fetchEAuthToken(
  url: string | undefined,
  token: string | undefined
) {
  if (!url) {
    throw new ApplicationError({
      title: "Incomplete Authentication Info",
      detail: "No URL or Token was provided for authentication"
    });
  }

  const response = await fetchWithHeaders(url, `Bearer ${token}`, {}, "POST");
  const json = await response.json();
  console.log(json)

  if (!response.ok) {
    throw new ServerError(url, response.status, json);
  }

  return json;
}
