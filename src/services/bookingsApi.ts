import { api } from "../store/api";

interface Booking {
  id: number;
  startTime: string;
  endTime: string;
  status: string;
}

export const bookingsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getBookings: builder.query<Booking[], void>({
      query: () => "bookings",
    }),
  }),
});

export const { useGetBookingsQuery } = bookingsApi;
