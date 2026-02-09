import { fetchEAuthToken } from "auth/ekirjastoFetch";
import type { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";
import { APP_CONFIG } from "utils/env";
import { buildLibraryData, fetchAuthDocument } from "dataflow/getLibraryData";
import { EKIRJASTO_AUTH_TYPE } from "utils/constants";

type ResponseData = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Handle POST method to /api/authsuccess
  if (req.method === "POST") {
    // Available in the result are result, token and exp (token expiration time)
    const { result, token } = req.body;

    //If the authentication was successful
    if (result === "success") {
      // Get authenticateHref from our AppConfigs so we find a suitable link for getting the authenticate link for ekirjasto
      const authenticateHref = await fetchEkirjastoAuthenticationLink();

      // Get circulation token
      const { access_token } = await fetchEAuthToken(authenticateHref, token);

      // Set the circulation token as a cookie that can be read on the other page and stored
      res.setHeader(
        "Set-Cookie",
        serialize("access_token", access_token, {
          httpOnly: false,
          path: "/"
        })
      );

      // Redirect to back to ekirjasto
      res.writeHead(302, { Location: "/ekirjasto" });
      res.end();
    }
    if (result === "failure") {
      // TODO: handling of authentication failure
      res.status(401).redirect("/ekirjasto");
    }
  } else {
    // If any other request comes to this location, just redirect to ekirjasto
    res.status(200).redirect("/ekirjasto");
  }
}

async function fetchEkirjastoAuthenticationLink(): Promise<string | undefined> {
  // Extract ekirjasto information
  const library = APP_CONFIG.libraries.ekirjasto;
  // If for some reason we don't find the authentication document, return early
  if (!library?.authDocUrl) {
    return;
  }
  // Get the authentication document links for circulation authentication
  const authDoc = await fetchAuthDocument(library?.authDocUrl);
  const libraryData = buildLibraryData(authDoc, library?.title);
  const links = libraryData.authMethods.find(
    method => method.type === EKIRJASTO_AUTH_TYPE
  )?.links;
  // Get the authentication link
  const authenticateHref = links?.find(link => link.rel === "authenticate")
    ?.href;
  return authenticateHref;
}
