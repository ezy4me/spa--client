import { api } from "../store/api";

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  locationId: number;
  categoryId: number;
  category: {
    id: number;
    name: string;
  };
  location: {
    id: number;
    name: string;
    address: string;
  };
}

export const productsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], void>({
      query: () => "product",
    }),
    updateProduct: builder.mutation<Product, Partial<Product> & { id: number }>({
      query: ({ id, ...data }) => ({
        url: `product/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),
    deleteProduct: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `product/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;
