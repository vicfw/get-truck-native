import { api } from "./main";
import {
  CreateOrUpdateNotificationSenderResponse,
  GetNotificationSender,
} from "./types/notificationSender.types";

export const NotificationSenderApi = api.injectEndpoints({
  endpoints: (build) => ({
    getNotificationForSend: build.query<GetNotificationSender, void>({
      query: () => {
        return {
          url: "/notificationSender",
          method: "GET",
        };
      },
      providesTags: ["NotificationSender"],
    }),
    createNotificationSender: build.mutation<
      CreateOrUpdateNotificationSenderResponse,
      {
        categoryId: string;
        brand: string;
        minKilometers?: number;
        maxKilometers?: number;
        minYear: number;
        maxYear: number;
      }
    >({
      query: (body) => {
        return {
          url: "/notificationSender",
          method: "POST",
          body,
        };
      },

      invalidatesTags: ["NotificationSender"],
    }),
    updateNotificationSender: build.mutation<
      CreateOrUpdateNotificationSenderResponse,
      {
        body: {
          categoryId: string;
          brand: string;
          minKilometers?: number;
          maxKilometers?: number;
          minYear: number;
          maxYear: number;
        };
        notificationSenderId: string;
      }
    >({
      query: ({ body, notificationSenderId }) => {
        return {
          url: `/notificationSender/${notificationSenderId}`,
          method: "PATCH",
          body,
        };
      },

      invalidatesTags: ["NotificationSender"],
    }),

    deleteNotificationForSend: build.mutation<
      { status: string },
      { id: string }
    >({
      query: ({ id }) => {
        return {
          url: `/notificationSender/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["NotificationSender"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetNotificationForSendQuery,
  useCreateNotificationSenderMutation,
  useDeleteNotificationForSendMutation,
  useUpdateNotificationSenderMutation,
} = NotificationSenderApi;
