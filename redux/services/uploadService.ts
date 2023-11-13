import { api } from "./main";
import { UploadResponse } from "./types/upload.types";

export const UploadApi = api.injectEndpoints({
  endpoints: (build) => ({
    uploadAdPhoto: build.mutation<UploadResponse, FormData>({
      query: (body) => {
        return {
          url: "/upload/adImage",
          method: "POST",
          body,
        };
      },
    }),
    uploadProfilePhoto: build.mutation<UploadResponse, FormData>({
      query: (body) => {
        return {
          url: "/upload/profilePhoto",
          method: "POST",
          body,
        };
      },
    }),
  }),
  overrideExisting: true,
});
export const { useUploadAdPhotoMutation, useUploadProfilePhotoMutation } =
  UploadApi;
