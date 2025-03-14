import { api } from "../store/api";

interface Location {
  id: number;
  name: string;
  address: string;
}

interface User {
  username: string;
  role: string;
}

interface Employee {
  fullName: string;
  phone: string;
  status: string;
  locationId: number;
  user: User;
}

export const locationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getLocations: builder.query<Location[], void>({
      query: () => "location",
    }),
    getEmployeesByLocationId: builder.query<Employee[], number>({
      query: (locationId) => `location/${locationId}/employees`,
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
  useGetEmployeesByLocationIdQuery,
  useUpdateLocationMutation,
  useDeleteLocationMutation,
  useCreateLocationMutation,
} = locationApi;
