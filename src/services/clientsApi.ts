import { api } from "../store/api";

export const clientsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getClients: builder.query<any[], void>({
      query: () => "client",
    }),
    createClient: builder.mutation<void, any>({
      query: (newClient) => ({
        url: "client",
        method: "POST",
        body: newClient,
      }),
    }),
    updateClient: builder.mutation<void, any>({
      query: ({ id, ...updates }) => ({
        url: `client/${id}`,
        method: "PUT",
        body: updates,
      }),
    }),
    deleteClient: builder.mutation<void, number>({
      query: (id) => ({
        url: `client/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetClientsQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
} = clientsApi;
