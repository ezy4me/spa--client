import { api } from "../store/api";

interface Client {
  id: number;
  fullName: string;
  phone: string;
  comment: string;
}

export const clientsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getClients: builder.query<Client[], void>({
      query: () => "client",
    }),
    updateClient: builder.mutation<Client, Partial<Client> & { id: number }>({
      query: ({ id, ...data }) => ({
        url: `clients/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),
    deleteClient: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `clients/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const { useGetClientsQuery, useUpdateClientMutation, useDeleteClientMutation } = clientsApi;
