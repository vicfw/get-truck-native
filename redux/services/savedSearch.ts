import { objectToSearch } from '../../utils/objectToSearchParam';
import { api } from './main';
import { DeleteResponse } from './types/api.global.types';
import {
  CreateFeaturedAd,
  FeaturedAdResponse,
  GetFeaturedAdByUserResponse,
} from './types/featuredAd.types';
import {
  GetSavedSearchResponse,
  SavedSearchCreateResponse,
  SavedSearchDeleteResponse,
} from './types/savedSearch.types';

export const SavedSearchApi = api.injectEndpoints({
  endpoints: (build) => ({
    getSavedSearch: build.query<GetSavedSearchResponse, { count?: string }>({
      query: (args) => {
        return {
          url: '/savedSearch'.concat(
            objectToSearch(args as { [count: string]: any })
          ),
          method: 'GET',
        };
      },
      providesTags: ['SavedSearch'],
    }),
    createSavedSearch: build.mutation<
      SavedSearchCreateResponse,
      { searchTerm: string }
    >({
      query: (body) => {
        return {
          url: '/savedSearch',
          method: 'POST',
          body,
        };
      },
      invalidatesTags: ['SavedSearch'],
    }),
    deleteSavedSearch: build.mutation<
      SavedSearchDeleteResponse,
      { savedSearchId: string }
    >({
      query: (body) => {
        return {
          url: `/savedSearch/${body.savedSearchId}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: ['SavedSearch'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useCreateSavedSearchMutation,
  useGetSavedSearchQuery,
  useDeleteSavedSearchMutation,
} = SavedSearchApi;
