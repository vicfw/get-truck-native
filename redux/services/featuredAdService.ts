import { api } from "./main";
import { DeleteResponse } from "./types/api.global.types";
import {
  CreateFeaturedAd,
  FeaturedAdResponse,
  GetFeaturedAdByUserResponse,
} from "./types/featuredAd.types";

export const FeaturedAdApi = api.injectEndpoints({
  endpoints: (build) => ({
    getFeaturedAdsByCurrentUser: build.query<GetFeaturedAdByUserResponse, void>(
      {
        query: () => {
          return {
            url: "/featuredAd/featuredAdByUser",
            method: "GET",
          };
        },
        providesTags: ["FeaturedAd"],
      }
    ),
    createFeaturedAd: build.mutation<FeaturedAdResponse, CreateFeaturedAd>({
      query: (body) => {
        return {
          url: "/featuredAd/create",
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["FeaturedAd", "User"],
    }),
    deleteFeaturedAd: build.mutation<DeleteResponse, { featuredAdId: string }>({
      query: ({ featuredAdId }) => {
        return {
          url: `/featuredAd/${featuredAdId}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["FeaturedAd", "User"],
    }),
  }),
  overrideExisting: true,
});
export const {
  useCreateFeaturedAdMutation,
  useGetFeaturedAdsByCurrentUserQuery,
  useDeleteFeaturedAdMutation,
} = FeaturedAdApi;
