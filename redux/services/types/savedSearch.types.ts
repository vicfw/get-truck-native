import { SavedSearch } from '../../../globalTypes';

export interface SavedSearchCreateResponse {
  status: string;
  data: SavedSearch;
}

export interface SavedSearchDeleteResponse {
  status: string;
  message: string;
}
export interface GetSavedSearchResponse {
  status: string;
  count: number;

  data: SavedSearch[];
}
