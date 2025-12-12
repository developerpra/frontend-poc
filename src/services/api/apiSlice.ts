import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../../config/environment';

export interface VesselOwner {
  vesselOwnerId: number;
  vesselId: number;
  ownerName: string;
  effectiveDate: string | null;
  expirationDate: string | null;
  active: boolean;
}

export interface VesselData {
  vesselId: number;
  vesselName: string;
  vesselType: string;
  vesselCompanyId: number | null;
  vesselCompartmentId: number | null;
  vefUnit: string;
  vesselBallast: string;
  vesselConnectionType: string;
  vesselCode: string;
  lastStrapping: string | null;
  lastDock: string | null;
  vesselGaugeUnit: string;
  vesselVolUnit: string;
  vesselDraftUnit: string;
  grossRegTons: string;
  netRegTons: string;
  lengthOverall: string;
  lbp: string;
  breadth: string;
  draught: string;
  builtYear: string | null;
  builtPlace: string;
  formerNames: string;
  flyingFlag: string;
  manifoldLocation: string;
  vessCapacityLine: string | null;
  vesselCapacity: string | null;
  vesselPhone: string | null;
  vesselEmail: string | null;
  notes: string | null;
  standPipe: string | null;
  strappingChartURL: string | null;
  oceanGoingBarges: boolean;
  active: boolean;
  vesselOwners: VesselOwner[];
}

export interface VesselListItem {
  vesselId: number;
  vesselName: string;
  vesselType: string;
  imoNumber: string;
  active: boolean;
}

export interface VesselListResponse {
  totalItems: number;
  items: VesselListItem[];
}

export interface VesselListParams {
  pageIndex: number;
  pageSize: number;
  VesselName?: string;
  VesselType?: string;
  ImoNumber?: string;
  Active?: boolean;
}

export interface ApiResponse<T> {
  isSuccess: boolean;
  data: T;
  errorCode: string | null;
  errorMessage: string | null;
}

// service using a base URL and expected endpoints
export const apiSlice = createApi({
  reducerPath: 'api', 
  baseQuery: fetchBaseQuery({ 
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      // const token = localStorage.getItem('token');
      // if (token) {
      //   headers.set('authorization', `Bearer ${token}`);
      // }
      return headers;
    },
  }),
  // tags: for caching and invalidation
  tagTypes: ['Vessel'], 
  endpoints: (builder) => ({
    // Get a vessel list
    getVesselList: builder.query<ApiResponse<VesselListResponse>, VesselListParams>({
      query: (params) => {
        const queryString = params ? '?' + new URLSearchParams(params as any).toString() : '';
        const fullUrl = `${BASE_URL}/VesselInformation${queryString}`;
        console.log('🔵 GET API Call - Vessel List:', {
          url: fullUrl,
          method: 'GET',
          params,
          timestamp: new Date().toISOString(),
        });
        return {
          url: '/VesselInformation',
          params,
        };
      },
      providesTags: ['Vessel'],
    }),
    // Get a vessel by ID
    getVesselInformation: builder.query<ApiResponse<VesselData>, number | string>({
      query: (id) => {
        const fullUrl = `${BASE_URL}/VesselInformation/${id}`;
        console.log('🔵 GET API Call - Vessel Information:', {
          url: fullUrl,
          method: 'GET',
          vesselId: id,
          timestamp: new Date().toISOString(),
        });
        return `/VesselInformation/${id}`;
      },
      providesTags: (result, error, id) => [{ type: 'Vessel', id }],
    }),
    // mutation: Update a vessel
    updateVessel: builder.mutation<any, { id: string | number; data: any }>({
      query: ({ id, data }) => {
        const fullUrl = `${BASE_URL}/VesselInformation/${id}`;
        console.log('🟢 PUT API Call - Update Vessel:', {
          url: fullUrl,
          method: 'PUT',
          vesselId: id,
          body: JSON.stringify(data, null, 2),
          timestamp: new Date().toISOString(),
        });
        return {
          url: `/VesselInformation/${id}`,
          method: 'PUT',
          body: data,
        };
      },
      invalidatesTags: (result, error, { id }) => [{ type: 'Vessel', id }],
    }),
    // mutation: Create a vessel
    createVessel: builder.mutation<any, any>({
      query: (data) => {
        const fullUrl = `${BASE_URL}/VesselInformation`;
        console.log('🟢 POST API Call - Create Vessel:', {
          url: fullUrl,
          method: 'POST',
          body: JSON.stringify(data, null, 2),
          timestamp: new Date().toISOString(),
        });
        return {
          url: '/VesselInformation',
          method: 'POST',
          body: data,
        };
      },
      invalidatesTags: ['Vessel'],
    }),
  }),
});

export const { 
  useUpdateVesselMutation, 
  useCreateVesselMutation,
  useGetVesselInformationQuery,
  useGetVesselListQuery
} = apiSlice;
