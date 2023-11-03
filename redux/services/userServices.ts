import { User } from "../../globalTypes";
import { api } from "./main";
import {
  AuthUserResponse,
  ForgotPasswordEmailBody,
  ForgotPasswordEmailResponse,
  ForgotPasswordResetBody,
  ForgotPasswordResetResponse,
  ForgotPasswordValidationBody,
  ForgotPasswordValidationResponse,
  LoginUserBody,
  RegisterUserBody,
  UpdateUserBody,
  UpdateUserResponse,
} from "./types/auth-user.types";
import { getMeResponse } from "./types/user.types";

export const UserApi = api.injectEndpoints({
  endpoints: (build) => ({
    me: build.query<getMeResponse, void>({
      // note: an optional `queryFn` may be used in place of `query`
      query: () => {
        return {
          url: "/users/me",
          method: "GET",
        };
      },
      providesTags: ["User"],
      transformResponse: (res: getMeResponse) => res,
    }),

    signupUser: build.mutation<AuthUserResponse, RegisterUserBody>({
      // note: an optional `queryFn` may be used in place of `query`
      query: (body) => {
        return {
          url: "/users/mobile-signup",
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["User"],
    }),
    loginUser: build.mutation<AuthUserResponse, LoginUserBody>({
      // note: an optional `queryFn` may be used in place of `query`
      query: (body) => {
        return {
          url: "/users/mobile-login",
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["User"],
    }),
    updateUser: build.mutation<UpdateUserResponse, UpdateUserBody>({
      // note: an optional `queryFn` may be used in place of `query`
      query: (body) => {
        return {
          url: "/users/updateMe",
          method: "PATCH",
          body,
        };
      },
      invalidatesTags: ["User"],
    }),
    forgotPasswordEmail: build.mutation<
      ForgotPasswordEmailResponse,
      ForgotPasswordEmailBody
    >({
      query: (body) => {
        return {
          url: "/users/forgotPassword",
          method: "POST",
          body,
        };
      },
    }),

    forgotPasswordValidation: build.mutation<
      ForgotPasswordValidationResponse,
      ForgotPasswordValidationBody
    >({
      query: (body) => {
        return {
          url: "/users/forgotPasswordValidation",
          method: "POST",
          body,
        };
      },
    }),

    forgotPasswordReset: build.mutation<
      ForgotPasswordResetResponse,
      ForgotPasswordResetBody
    >({
      query: (body) => {
        return {
          url: "/users/resetPassword",
          method: "PATCH",
          body,
        };
      },
    }),
  }),
  overrideExisting: true,
});

export const {
  useSignupUserMutation,
  useLoginUserMutation,
  useMeQuery,
  useUpdateUserMutation,
  useForgotPasswordEmailMutation,
  useForgotPasswordValidationMutation,
  useForgotPasswordResetMutation,
} = UserApi;
