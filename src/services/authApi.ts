import { api } from "../store/api";

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  accesToken: string;
  refreshToken: {
    token: string;
    exp: string;
  };
  user: {
    id: number;
    username: string;
    role: string;
  };
}

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const { useLoginMutation } = authApi;
