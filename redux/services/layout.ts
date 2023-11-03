import { api } from "./main";
import { GetBannerResponse } from "./types/layout.types";

export const LayoutApi = api.injectEndpoints({
  endpoints: (build) => ({
    getBanner: build.query<GetBannerResponse, void>({
      query: () => {
        return {
          url: "/layout/banner",
        };
      },
    }),
  }),
  overrideExisting: true,
});

export const { useGetBannerQuery } = LayoutApi;
