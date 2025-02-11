import { api } from "../store/api";

interface Employee {
  id: number;
  fullName: string;
  phone: string;
  status: string;
  userId: number;
  locationId: number;
}

export const employeesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getEmployees: builder.query<Employee[], void>({
      query: () => "employee",
    }),
    updateEmployee: builder.mutation<Employee, Partial<Employee> & { id: number }>({
      query: ({ id, ...data }) => ({
        url: `employee/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteEmployee: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `employee/${id}`,
        method: "DELETE",
      }),
    }),

    getEmployeeByUserId: builder.query<Employee, number>({
      query: (userId) => `employee/user/${userId}`,
    }),

    createEmployee: builder.mutation<Employee, Omit<Employee, "id">>({
      query: (newEmployee) => ({
        url: "employee",
        method: "POST",
        body: newEmployee,
      }),
    }),
  }),
});

export const {
  useGetEmployeesQuery,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
  useGetEmployeeByUserIdQuery,
  useCreateEmployeeMutation, 
} = employeesApi;
