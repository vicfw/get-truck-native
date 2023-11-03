import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseUrl } from '../../constants/Api';
import { setBearerToken } from '../../utils/setBearerToken';

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    timeout: 10000,
    prepareHeaders: (headers, { getState, endpoint }) => {
      return setBearerToken(headers, getState);
    },
  }),
  reducerPath: 'api',
  tagTypes: [
    'Ad',
    'FeaturedAd',
    'Category',
    'User',
    'SingleAd',
    'Chat',
    'SavedSearch',
    'NotificationSender',
  ],
  endpoints: () => ({}),
});
