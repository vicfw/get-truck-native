import { Chat, Message } from "../../globalTypes";
import { api } from "./main";

export const ChatApi = api.injectEndpoints({
  endpoints: (build) => ({
    getChats: build.query<Chat[], void>({
      query: () => {
        return {
          url: "/chat",
          method: "GET",
        };
      },
      providesTags: ["Chat"],
    }),
    createOrAccessChat: build.mutation<Chat, { userId: string; adId: string }>({
      query: (body) => {
        return {
          url: "/chat",
          method: "POST",
          body,
        };
      },

      invalidatesTags: ["Chat"],
    }),
    getAllMessages: build.query<Message[], { chatId: string }>({
      query: ({ chatId }) => {
        return {
          url: `/message/${chatId}`,
          method: "GET",
        };
      },
    }),
    sendMessage: build.mutation<Message, { content: string; chatId: string }>({
      query: (body) => {
        return {
          url: "/message",
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["Chat"],
    }),
    deleteChat: build.mutation<{ status: string; data: null }, { id: string }>({
      query: ({ id }) => {
        return {
          url: `/chat/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Chat"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetChatsQuery,
  useCreateOrAccessChatMutation,
  useSendMessageMutation,
  useGetAllMessagesQuery,
  useDeleteChatMutation,
} = ChatApi;
