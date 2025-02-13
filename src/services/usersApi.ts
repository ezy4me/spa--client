import { api } from "../store/api";

export const usersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<any[], void>({
      query: () => "user",
    }),
    createUser: builder.mutation<void, any>({
      query: (newUser) => ({
        url: "user",
        method: "POST",
        body: newUser,
      }),
    }),
    updateUser: builder.mutation<void, any>({
      query: ({ id, ...updates }) => ({
        url: `user/${id}`,
        method: "PUT",
        body: updates,
      }),
    }),
    deleteUser: builder.mutation<void, number>({
      query: (id) => ({
        url: `user/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi;
