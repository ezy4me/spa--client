import { api } from "../store/api";

export const shiftApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getShiftsByUserId: builder.query<any[], number>({
      query: (userId) => `shift/user/${userId}`,
    }),

    getShiftById: builder.query<any, number>({
      query: (id) => `shift/${id}`,
    }),

    getActiveShift: builder.query<any, number>({
      query: (employeeId) => `shift/active/${employeeId}`,
    }),

    createShift: builder.mutation<
      void,
      { userId: number; startTime: string; endTime: string | null }
    >({
      query: (newShift) => ({
        url: "shift",
        method: "POST",
        body: newShift,
      }),
    }),

    updateShift: builder.mutation<
      void,
      { id: number; startTime: string; endTime: string }
    >({
      query: ({ id, startTime, endTime }) => ({
        url: `shift/${id}`,
        method: "PUT",
        body: { startTime, endTime },
      }),
    }),

    deleteShift: builder.mutation<void, number>({
      query: (id) => ({
        url: `shift/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetShiftsByUserIdQuery,
  useGetShiftByIdQuery,
  useGetActiveShiftQuery,
  useCreateShiftMutation,
  useUpdateShiftMutation,
  useDeleteShiftMutation,
} = shiftApi;
