import { api } from "../store/api";

interface Booking {
  id: number;
  startTime: string;
  endTime: string;
  status: string;
  comment: string;
  roomId: number;
  clientId: number;
}

export const bookingsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getBookings: builder.query<Booking[], void>({
      query: () => "booking",
    }),

    createBooking: builder.mutation<Booking, Partial<Booking>>({
      query: (newBooking) => ({
        url: "booking",
        method: "POST",
        body: newBooking,
      }),
    }),

    updateBooking: builder.mutation<
      Booking,
      {
        id: number;
        startTime: string;
        endTime: string;
        comment: string;
        status: string;
        roomId: number;
        clientId: number;
      }
    >({
      query: ({
        id,
        startTime,
        endTime,
        comment,
        status,
        roomId,
        clientId,
      }) => ({
        url: `booking/${id}`,
        method: "PUT",
        body: {
          startTime,
          endTime,
          comment,
          status,
          roomId,
          clientId,
        },
      }),
    }),

    updateBookingStatus: builder.mutation<
      Booking,
      { id: number; status: string }
    >({
      query: ({ id, status }) => ({
        url: `booking/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
    }),

    extendBooking: builder.mutation<
      Booking,
      { id: number; newEndTime: string }
    >({
      query: ({ id, newEndTime }) => ({
        url: `booking/${id}/extend`,
        method: "PATCH",
        body: { newEndDate: newEndTime },
      }),
    }),

    deleteBooking: builder.mutation<void, { id: number }>({
      query: ({ id }) => ({
        url: `booking/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetBookingsQuery,
  useCreateBookingMutation,
  useUpdateBookingMutation,
  useUpdateBookingStatusMutation,
  useExtendBookingMutation,
  useDeleteBookingMutation,
} = bookingsApi;
