import { api } from "../store/api";

interface Location {
  id: number;
  name: string;
  address: string;
}

interface Room {
  id: number;
  name: string;
  status: string;
  locationId: number;
  location: Location;
}

export const roomApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getRooms: builder.query<Room[], void>({
      query: () => "room",
    }),
    updateRoom: builder.mutation<Room, Partial<Room> & { id: number }>({
      query: ({ id, ...data }) => ({
        url: `room/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteRoom: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `room/${id}`,
        method: "DELETE",
      }),
    }),
    createRoom: builder.mutation<
      Room,
      Omit<Room, "id" | "location" > & { locationId: number }
    >({
      query: (data) => ({
        url: `room`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetRoomsQuery,
  useUpdateRoomMutation,
  useDeleteRoomMutation,
  useCreateRoomMutation,
} = roomApi;
