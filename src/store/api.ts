import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiUrl = import.meta.env.VITE_PUBLIC_API_URL;

export const api = createApi({
  reducerPath: "",
  baseQuery: fetchBaseQuery({
    baseUrl: apiUrl, 
  }),
  endpoints: () => ({}),
});
