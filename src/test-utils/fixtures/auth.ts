import {
  ClientBasicMethod,
  ClientCleverMethod,
  ClientSamlMethod,
  CollectionData
} from "interfaces";
import { OPDS1 } from "interfaces";
import { makeFulfillableBooks } from "test-utils/fixtures/book";

export const basicAuthId = "http://opds-spec.org/auth/basic";
export const samlAuthId = "http://librarysimplified.org/authtype/SAML-2.0";

export const basicAuthMethod: ClientBasicMethod = {
  id: "client-basic",
  labels: {
    login: "Barcode",
    password: "Pin"
  },
  type: basicAuthId,
  description: "Library Barcode",
  // inputs: {
  //   login: { keyboard: "Default" },
  //   password: { keyboard: "Default" }
  // },
  links: [
    {
      href: "https://example.com/LoginButton280.png",
      rel: "logo"
    }
  ]
};

export const cleverAuthMethod: ClientCleverMethod = {
  id: "client-clever",
  description: "Clever",
  links: [
    {
      href: "https://example.com/oauth_authenticate?provider=Clever",
      rel: "authenticate"
    },
    {
      href: "https://example.com/CleverLoginButton280.png",
      rel: "logo"
    }
  ],
  type: OPDS1.CleverAuthType
};

export const samlAuthHref = "/saml-auth-url";
export const clientSamlMethod: ClientSamlMethod = createSamlMethod(0);

export function createSamlMethod(num: number): ClientSamlMethod {
  return {
    id: `id-${num}`,
    href: `https://saml-auth.com/${num}`,
    type: OPDS1.SamlAuthType,
    description: `SAML IdP ${num}`,
    links: [
      {
        href: "https://example.com/LoginButton280.png",
        rel: "logo"
      }
    ]
  };
}

export const loans: CollectionData = {
  id: "loans-id",
  url: "/loans-url",
  title: "My Loans",
  lanes: [],
  books: makeFulfillableBooks(1),
  navigationLinks: [],
  searchDataUrl: "/search-data-url"
};
