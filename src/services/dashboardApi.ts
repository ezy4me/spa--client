import { api } from "../store/api";

interface DashboardStats {
  revenue: number;
  totalClients: number;
  clientsLast30Days: number;
  lowStockProducts: { id: number; name: string; stock: number }[];
  activeBookings: number;
}

export const dashboardApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStats, void>({
      query: () => "dashboard/stats",
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardApi;
