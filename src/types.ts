export interface RequestType {
  imdbId: string;
  season?: number;
  episode?: number;
}

export interface ResponseType {
  id: string;
  url: string;
  type: string;
  language: string; // ISO639 locale
  hasCorsRestrictions: boolean;
}