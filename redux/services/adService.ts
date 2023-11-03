import { objectToSearch } from "../../utils/objectToSearchParam";
import { api } from "./main";
import {
  AdFilterType,
  AdSearchType,
  CreateOrUpdateAdBody,
  CreateOrUpdateAdResponse,
  DeleteAdResponse,
  GetAllAdsResponse,
  GetSingleAdResponse,
} from "./types/ad.types";

export const AdApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAllAds: build.query<GetAllAdsResponse, AdFilterType>({
      query: (args) => {
        return {
          url: "/ad".concat(objectToSearch(args as { [name: string]: any })),
          method: "GET",
        };
      },
      providesTags: ["Ad"],
    }),
    searchAd: build.query<GetAllAdsResponse, AdSearchType>({
      query: (args) => {
        return {
          url: "/ad/search".concat(
            objectToSearch(args as { [name: string]: any })
          ),
          method: "GET",
        };
      },

      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.query.length !== previousArg?.query.length;
      },
    }),
    getSingleAd: build.query<GetSingleAdResponse, { adId: string }>({
      query: ({ adId }) => {
        return {
          url: `/ad/${adId}`,
          method: "GET",
        };
      },
      providesTags: ["SingleAd"],
    }),
    createAd: build.mutation<CreateOrUpdateAdResponse, CreateOrUpdateAdBody>({
      query: (body) => {
        return {
          url: "/ad/create",
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["Ad", "User"],
    }),
    updateAd: build.mutation<
      CreateOrUpdateAdResponse,
      { body: CreateOrUpdateAdBody; adId: string }
    >({
      query: ({ body, adId }) => {
        return {
          url: `/ad/${adId}`,
          method: "PATCH",
          body,
        };
      },
      invalidatesTags: ["Ad", "User", "SingleAd", "Category"],
    }),
    deleteAd: build.mutation<DeleteAdResponse, { id: string }>({
      query: ({ id }) => {
        return {
          url: `/ad/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Ad", "User", "FeaturedAd", "Chat"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useCreateAdMutation,
  useGetAllAdsQuery,
  useGetSingleAdQuery,
  useDeleteAdMutation,
  useUpdateAdMutation,
  useSearchAdQuery,
} = AdApi;
