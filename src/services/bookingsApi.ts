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
    updateBooking: builder.mutation<Booking, { id: number; status: string }>({
      query: ({ id, status }) => ({
        url: `booking/${id}`,
        method: "PUT",
        body: { status },
      }),
    }),
  }),
});

export const { useGetBookingsQuery, useCreateBookingMutation, useUpdateBookingMutation } = bookingsApi;
