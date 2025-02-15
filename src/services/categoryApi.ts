import { api } from "../store/api";

interface Category {
  id: number;
  name: string;
}

export const categoryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], void>({
      query: () => "category",
    }),
    updateCategory: builder.mutation<Category, Partial<Category> & { id: number }>({
      query: ({ id, ...data }) => ({
        url: `category/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteCategory: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `category/${id}`,
        method: "DELETE",
      }),
    }),
    createCategory: builder.mutation<Category, Omit<Category, 'id'>>({
      query: (data) => ({
        url: `category`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useCreateCategoryMutation,
} = categoryApi;
