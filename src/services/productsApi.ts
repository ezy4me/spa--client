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
    updateProduct: builder.mutation<
      Product,
      {
        id: number;
        name: string;
        price: number;
        stock: number;
        locationId: number;
        categoryId: number;
      }
    >({
      query: ({ id, categoryId, locationId, ...data }) => ({
        url: `product/${id}`,
        method: "PUT",
        body: {
          name: data.name,
          price: data.price,
          stock: data.stock,
          categoryId: categoryId, 
          locationId: locationId, 
        },
      }),
    }),
    deleteProduct: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `product/${id}`,
        method: "DELETE",
      }),
    }),
    createProduct: builder.mutation<
      Product,
      {
        name: string;
        price: number;
        stock: number;
        locationId: number;
        categoryId: number;
      }
    >({
      query: (data) => ({
        url: `product`,
        method: "POST",
        body: {
          name: data.name,
          price: data.price,
          stock: data.stock,
          locationId: data.locationId, //
          categoryId: data.categoryId,
        },
      }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useCreateProductMutation,
} = productsApi;
