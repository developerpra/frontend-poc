import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../../config/environment';

// Define a service using a base URL and expected endpoints
export const apiSlice = createApi({
  reducerPath: 'api', // The key in the store
  baseQuery: fetchBaseQuery({ 
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      // You can add auth headers here if needed
      // const token = localStorage.getItem('token');
      // if (token) {
      //   headers.set('authorization', `Bearer ${token}`);
      // }
      return headers;
    },
  }),
  // Define tags for caching and invalidation
  tagTypes: ['Vessel'], 
  endpoints: (builder) => ({
    // Example query: Get a vessel by ID
    getVessel: builder.query<any, string>({
      query: (id) => `/vessels/${id}`, // Appended to BASE_URL
      providesTags: (result, error, id) => [{ type: 'Vessel', id }],
    }),
    // Example mutation: Update a vessel
    updateVessel: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/vessels/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Vessel', id }],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetVesselQuery, useUpdateVesselMutation } = apiSlice;

