import { api } from "../store/api";

export const revenueApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTotalRevenue: builder.query<number, void>({
      query: () => "revenue/total",
    }),
    getRevenueByProduct: builder.query<any[], void>({
      query: () => "revenue/by-product",
    }),
    getRevenueByCategory: builder.query<any[], void>({
      query: () => "revenue/by-category",
    }),
    getMostActiveClients: builder.query<any[], void>({
      query: () => "revenue/active-clients",
    }),
    getLowStockProducts: builder.query<any[], void>({
      query: () => "revenue/low-stock",
    }),
  }),
});

export const {
  useGetTotalRevenueQuery,
  useGetRevenueByProductQuery,
  useGetRevenueByCategoryQuery,
  useGetMostActiveClientsQuery,
  useGetLowStockProductsQuery,
} = revenueApi;
