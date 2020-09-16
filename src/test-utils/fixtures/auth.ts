import {
  AuthProvider,
  BasicAuthMethod,
  ClientSamlMethod,
  AuthMethod
} from "owc/interfaces";

import CleverButton from "auth/cleverAuthButton";
import AuthButton from "auth/AuthButton";

import BasicAuthForm from "auth/BasicAuthForm";
import { AuthState } from "owc/reducers/auth";
import SamlAuthForm from "auth/SamlAuthForm";

export const cleverAuthId =
  "http://librarysimplified.org/authtype/OAuth-with-intermediary";

export const basicAuthId = "http://opds-spec.org/auth/basic";
export const samlAuthId = "http://librarysimplified.org/authtype/SAML-2.0";

export const basicAuthMethod = {
  labels: {
    login: "Barcode",
    password: "Pin"
  },
  type: basicAuthId,
  description: "Library Barcode",
  inputs: {
    login: { keyboard: "Default" },
    password: { keyboard: "Default" }
  },
  links: [
    {
      href: "https://example.com/LoginButton280.png",
      rel: "logo"
    }
  ]
};

export const cleverAuthProvider: AuthProvider<AuthMethod> = {
  id: cleverAuthId,
  plugin: {
    formComponent: undefined,
    buttonComponent: CleverButton,
    lookForCredentials: jest.fn(),
    type: cleverAuthId
  },
  method: {
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
    type: cleverAuthId
  }
};

export const basicAuthProvider: AuthProvider<BasicAuthMethod> = {
  id: basicAuthId,
  plugin: {
    type: basicAuthId,
    formComponent: BasicAuthForm,
    buttonComponent: AuthButton,
    lookForCredentials: jest.fn()
  },
  method: basicAuthMethod
};

export const samlAuthHref = "/saml-auth-url";
export const samlAuthProvider: AuthProvider<ClientSamlMethod> = {
  id: samlAuthHref,
  plugin: {
    type: samlAuthId,
    formComponent: SamlAuthForm,
    buttonComponent: AuthButton,
    lookForCredentials: jest.fn()
  },
  method: {
    href: samlAuthHref,
    type: samlAuthId,
    description: "SAML IdP",
    links: [
      {
        href: "https://example.com/LoginButton280.png",
        rel: "logo"
      }
    ]
  }
};

export const unauthenticatedAuthState: AuthState = {
  showForm: false,
  callback: null,
  cancel: null,
  credentials: null,
  title: null,
  error: null,
  attemptedProvider: null,
  providers: [basicAuthProvider]
};
