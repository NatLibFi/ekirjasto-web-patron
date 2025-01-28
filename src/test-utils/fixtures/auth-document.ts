import { OPDS1 } from "interfaces";

const baseAuthDoc: OPDS1.AuthDocument = {
  id: "auth-doc-id",
  title: "auth doc title",
  description: "auth doc description",
  links: [],
  authentication: [],
};

export const authDoc: OPDS1.AuthDocument = {
  ...baseAuthDoc,
  links: [
    ...baseAuthDoc.links,
    {
      rel: OPDS1.SelfRel,
      href: "/auth-doc"
    },
    {
      rel: OPDS1.CatalogRootRel,
      href: "/catalog-root"
    }
  ],
};

export const authDocNoLinks: OPDS1.AuthDocument = { ...baseAuthDoc };

export const authDocNoCatalogRoot: OPDS1.AuthDocument = {
  ...baseAuthDoc,
  links: [
    ...baseAuthDoc.links,
    {
      rel: OPDS1.SelfRel,
      href: "/auth-doc"
    }
  ]
};
