// Magazine service related (epress) TypeScript interfaces

export interface MagazineTitle {
  id: string;
  name: string;
  path: string;
  publisher?: string;
  language?: string;
  categoryIds?: string[];
}

export interface MagazineIssue {
  id: string;
  name: string;
  path: string;
  publicationDate?: string;
  coverUrl?: string;
  title?: MagazineTitle;
}

export interface MagazineCategory {
  id: string;
  name: string;
  path?: string;
}

// API Response structure based on the documentation
export interface ApiMagazineEntry {
  titles?: Array<{
    id: string;
    name: string;
    path: string;
    publisher?: string;
    language?: string;
    categoryIds?: string[];
  }>;
  issues?: Array<{
    id: string;
    name: string;
    path: string;
    publicationDate?: string;
    coverUrl?: string;
  }>;
  categories?: Array<{
    id: string;
    name: string;
  }>;
}

export interface MagazinesResponse {
  titles?: MagazineTitle[];
  issues?: MagazineIssue[];
  categories?: MagazineCategory[];
}

export interface MagazineFilters {
  selectedTitle?: string;
  selectedCategory?: string;
}
