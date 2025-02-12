import { api } from "../store/api";

interface Location {
  id: number;
  name: string;
  address: string;
}

export const locationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getLocations: builder.query<Location[], void>({
      query: () => "location",
    }),
    updateLocation: builder.mutation<
      Location,
      Partial<Location> & { id: number }
    >({
      query: ({ id, ...data }) => ({
        url: `location/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteLocation: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `location/${id}`,
        method: "DELETE",
      }),
    }),
    createLocation: builder.mutation<Location, Omit<Location, "id">>({
      query: (data) => ({
        url: `location`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetLocationsQuery,
  useUpdateLocationMutation,
  useDeleteLocationMutation,
  useCreateLocationMutation,
} = locationApi;
