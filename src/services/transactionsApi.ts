import { api } from "../store/api";

interface Client {
  id: number;
  fullName: string;
  phone: string;
  comment: string;
}

interface Transaction {
  id: number;
  name: string;
  amount: number;
  type: string;
  paymentMethod: string;
  date: string;
  clientId: number;
  client: Client;
}

export const transactionsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTransactions: builder.query<Transaction[], void>({
      query: () => "transaction",
    }),
    updateTransaction: builder.mutation<
      void,
      Partial<Transaction> & { id: number }
    >({
      query: ({ id, ...patch }) => ({
        url: `transaction/${id}`,
        method: "PATCH",
        body: patch,
      }),
    }),
    deleteTransaction: builder.mutation<void, number>({
      query: (id) => ({
        url: `transaction/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetTransactionsQuery,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
} = transactionsApi;
