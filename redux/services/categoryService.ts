import { Category } from "../../globalTypes";
import { api } from "./main";
import {
  CategoriesResponse,
  CategoriesWithoutChildrenResponse,
  GetLastFourCategoriesResponse,
} from "./types/category.types";

export const CategoryApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAllCategories: build.query<Category[], void>({
      query: () => {
        return {
          url: "/categories",
          method: "GET",
        };
      },
      transformResponse: (response: CategoriesResponse, meta, arg) => {
        return response.categoryList;
      },
      transformErrorResponse: (response, meta, arg) => response,
      providesTags: ["Category"],
    }),
    getLastFourCategories: build.query<GetLastFourCategoriesResponse, void>({
      query: () => {
        return {
          url: "/categories/lastFour",
          method: "GET",
        };
      },
    }),
    getAllCategoriesWithoutChildren: build.query<
      CategoriesWithoutChildrenResponse[],
      void
    >({
      query: () => {
        return {
          url: "/categories/getallCategoriesWithoutChildren",
          method: "GET",
        };
      },
      transformResponse: (response: any, meta, arg) => {
        return response.data;
      },
      transformErrorResponse: (response, meta, arg) => response,
    }),
  }),
  overrideExisting: true,
});
export const {
  useGetAllCategoriesQuery,
  useGetAllCategoriesWithoutChildrenQuery,
  useGetLastFourCategoriesQuery,
} = CategoryApi;
