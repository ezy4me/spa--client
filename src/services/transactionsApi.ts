import { api } from "../store/api";

interface Client {
  id: number;
  fullName: string;
  phone: string;
  comment: string;
}

interface TransactionProduct {
  productId: number;
  quantity: number;
  price: number;
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
  transactionProducts: TransactionProduct[];
}

export const transactionsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTransactions: builder.query<Transaction[], void>({
      query: () => "transaction",
    }),

    createTransaction: builder.mutation<
      void,
      Omit<Transaction, "id" | "client">
    >({
      query: (newTransaction) => ({
        url: "transaction",
        method: "POST",
        body: newTransaction,
      }),
    }),

    updateTransaction: builder.mutation<
      void,
      Partial<Transaction> & { id: number }
    >({
      query: ({ id, ...patch }) => ({
        url: `transaction/${id}`,
        method: "PUT",
        body: patch,
      }),
    }),

    deleteTransaction: builder.mutation<void, number>({
      query: (id) => ({
        url: `transaction/${id}`,
        method: "DELETE",
      }),
    }),

    generateTransactionReport: builder.mutation<void, number>({
      query: (transactionId) => ({
        url: `transaction/${transactionId}/report`,
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

export const {
  useGetTransactionsQuery,
  useCreateTransactionMutation,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
  useGenerateTransactionReportMutation,
} = transactionsApi;
